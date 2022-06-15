import axios from 'axios';
import Avalanche from 'avalanche';
import { ethers } from 'ethers';

// TODO: Deal with prod and dev env
export const avaxTestNetworkNodeUrl =
  'https://api.avax-test.network/ext/bc/C/rpc';

const HTTPSProvider = new ethers.providers.JsonRpcProvider(
  avaxTestNetworkNodeUrl
);

export function getEthersWallet(
  privateKeyWithLeadingHex: string
): ethers.Wallet {
  return new ethers.Wallet(privateKeyWithLeadingHex, HTTPSProvider);
}

const chainId = 43113;
const avalanche = new Avalanche(
  'api.avax-test.network',
  undefined,
  'https',
  chainId
);
const cchain = avalanche.CChain();

/**
 * Base code taken from https://docs.avax.network/quickstart/sending-transactions-with-dynamic-fees-using-javascript/#function-for-estimating-max-fee-and-max-priority-fee
 * Info on maxFeePerGas and maxPriorityFeePerGas: https://docs.alchemy.com/alchemy/guides/eip-1559/maxpriorityfeepergas-vs-maxfeepergas
 *
 * Terms:
 * baseFee: set by network to perform transaction.  Gets burned and does not go to miner.
 * maxPriorityFeePerGas: This is the "tip" that goes to the miner.
 *  The higher the tip, the more likely the transaction will be included in a block.
 * maxFeePerGas: This is the total amount of gas used in the transaction.  Tip + Bare minimum set by network
 * Gwei and nAvax are the same thing
 */
export const calcBaseFee = async () => {
  const baseFee = parseInt(await cchain.getBaseFee(), 16) / 1e9;
  const maxPriorityFeePerGas =
    parseInt(await cchain.getMaxPriorityFeePerGas(), 16) / 1e9;

  const maxFeePerGas = baseFee + maxPriorityFeePerGas;

  if (maxFeePerGas < maxPriorityFeePerGas) {
    throw new Error(
      'Max fee per gas cannot be less than max priority fee per gas'
    );
  }

  const maxFees = {
    maxFeePerGasGwei: maxFeePerGas.toString(),
    maxPriorityFeePerGasGwei: maxPriorityFeePerGas.toString(),
  };

  return maxFees;
};

// TODO: Support prod and dev environment
export const createBaseTxn = async (
  fromAddress: string,
  amount: string,
  toAddress: string
) => {
  const MAX_GAS_WILLING_TO_SPEND_GWEI = '45';
  const chainId = 43113;
  const nodeURL = 'https://api.avax-test.network/ext/bc/C/rpc';
  const HTTPSProvider = new ethers.providers.JsonRpcProvider(nodeURL);

  const nonce = await HTTPSProvider.getTransactionCount(fromAddress);

  const { maxFeePerGasGwei, maxPriorityFeePerGasGwei } = await calcBaseFee();

  if (maxFeePerGasGwei > MAX_GAS_WILLING_TO_SPEND_GWEI) {
    console.log(`Spending more than MAX_GWEI_GAS_WILLING_TO_SPEND`, {
      MAX_GAS_WILLING_TO_SPEND_GWEI,
      maxFeePerGasGwei,
    });
    throw new Error(`Spending more than MAX_GWEI_GAS_WILLING_TO_SPEND`);
  }

  const maxFeePerGasInAvax = ethers.utils.parseUnits(maxFeePerGasGwei, 'gwei');
  const maxPriorityFeePerGasInAvax = ethers.utils.parseUnits(
    maxPriorityFeePerGasGwei,
    'gwei'
  );

  const baseTx: ethers.providers.TransactionRequest = {
    // Type 2 transaction is for EIP1559 (https://eips.ethereum.org/EIPS/eip-1559)
    type: 2,
    nonce,
    to: toAddress,
    maxPriorityFeePerGas: maxPriorityFeePerGasInAvax,
    maxFeePerGas: maxFeePerGasInAvax,
    value: ethers.utils.parseEther(amount),
    chainId,
  };

  return baseTx;
};

// TODO: Support prod and dev environment
export const getEstimatedTxnCost = async (
  fromAddress: string,
  amount: string,
  toAddress: string
) => {
  const nodeURL = 'https://api.avax-test.network/ext/bc/C/rpc';
  const HTTPSProvider = new ethers.providers.JsonRpcProvider(nodeURL);

  const baseTx = await createBaseTxn(fromAddress, amount, toAddress);

  // Gas is burned by chain
  const estimatedGasCost = await HTTPSProvider.estimateGas(baseTx);
  const estimatedTxnCost = estimatedGasCost.mul(
    // MaxFeePerGas is the minimum avax required for a miner to pick it up and put it on chain
    ethers.BigNumber.from(baseTx.maxFeePerGas)
  );
  return estimatedTxnCost;
};

// TODO: Support prod and dev environment
export const sendAvax = async (
  fromWallet: ethers.Wallet,
  amount: string,
  toAddress: string
) => {
  const baseTx = await createBaseTxn(fromWallet.address, amount, toAddress);
  const estimatedGasCost = await HTTPSProvider.estimateGas(baseTx);

  const fullTx: ethers.providers.TransactionRequest = {
    ...baseTx,
    gasLimit: estimatedGasCost,
  };

  const signedTx = await fromWallet.signTransaction(fullTx);
  const txHash = ethers.utils.keccak256(signedTx);
  const explorerUrl = `https://testnet.snowtrace.io/tx/${txHash}`;

  console.log('Sending signed transaction', {
    signedTx,
    fullTx,
    txHash,
    explorerUrl,
  });

  console.log(estimatedGasCost);
  const totalEstimatedCost = estimatedGasCost.mul(
    ethers.BigNumber.from(baseTx.maxFeePerGas)
  );
  const res = await HTTPSProvider.sendTransaction(signedTx);

  return {
    transaction: res,
    toAddress,
    estimatedCost: totalEstimatedCost,
    txHash,
    explorerUrl,
  };
};

export interface HistoricalTxn {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
}

export async function getAddressHistory(address: string) {
  interface TxListResponse {
    message: string;
    result: HistoricalTxn[];
    status: string;
  }
  const rawHistoryResp = await axios.get<TxListResponse>(
    // TODO: Support dev and prod environment
    'https://api-testnet.snowtrace.io/api',
    {
      params: {
        module: 'account',
        action: 'txlist',
        address,
        startblock: 1,
        endblock: 99999999,
        sort: 'desc',
      },
    }
  );

  return rawHistoryResp.data.result;
}

export function formatWalletAddress(address: string) {
  return `${address.substring(0, 10)}...${address.substring(32)}`;
}

export function formatTxnHash(txnHash: string) {
  return `${txnHash.substring(0, 6)}...${txnHash.substring(60)}`;
}
