import Avalanche from 'avalanche';
import { ethers } from 'ethers';

import { isProd } from '@/util/envUtil';

export const prodAvaxUrl = 'api.avalanche.network';
export const fujiTestAvaxUrl = 'api.avax-test.network';
export const prodAvaxRpcUrl = 'https://api.avax.network/ext/bc/C/rpc';
export const fujiTestAvaxRpcUrl = 'https://api.avax-test.network/ext/bc/C/rpc';

const chainId = 43113;
const avalanche = new Avalanche(
  isProd ? prodAvaxUrl : fujiTestAvaxUrl,
  undefined,
  'https',
  chainId
);
const cchain = avalanche.CChain();

export const HTTPSProvider = new ethers.providers.JsonRpcProvider(
  isProd ? prodAvaxRpcUrl : fujiTestAvaxRpcUrl
);

export function getEthersWallet(
  privateKeyWithLeadingHex: string
): ethers.Wallet {
  return new ethers.Wallet(privateKeyWithLeadingHex, HTTPSProvider);
}

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
export const getAvaxChainBaseFees = async () => {
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

export const createBaseTxn = async (
  fromAddress: string,
  amount: string,
  toAddress: string
): Promise<ethers.providers.TransactionRequest> => {
  const MAX_GAS_WILLING_TO_SPEND_GWEI = '45';

  const nonce = await HTTPSProvider.getTransactionCount(fromAddress);
  const { maxFeePerGasGwei, maxPriorityFeePerGasGwei } =
    await getAvaxChainBaseFees();

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

export const getEstimatedTxnCosts = async (
  baseTxn: ethers.providers.TransactionRequest
): Promise<{
  estimatedTotalTxnCost: ethers.BigNumber;
  estimatedGasCost: ethers.BigNumber;
}> => {
  // Gas is burned by chain
  const estimatedGasCost = await HTTPSProvider.estimateGas(baseTxn);

  const estimatedTotalTxnCost = estimatedGasCost.mul(
    // MaxFeePerGas is the minimum avax required for a miner to pick it up and put it on chain
    ethers.BigNumber.from(baseTxn.maxFeePerGas)
  );

  return { estimatedTotalTxnCost, estimatedGasCost };
};

export const sendAvax = async (
  unsignedBaseTxn: ethers.providers.TransactionRequest,
  fromWallet: ethers.Wallet
) => {
  const { estimatedTotalTxnCost, estimatedGasCost } =
    await getEstimatedTxnCosts(unsignedBaseTxn);

  const fullTxn: ethers.providers.TransactionRequest = {
    ...unsignedBaseTxn,
    gasLimit: estimatedGasCost,
  };

  const signedTxn = await fromWallet.signTransaction(fullTxn);
  const txnHash = ethers.utils.keccak256(signedTxn);
  const explorerUrl = isProd
    ? `https://snowtrace.io/tx/${txnHash}`
    : `https://testnet.snowtrace.io/tx/${txnHash}`;

  console.log('Sending signed transaction', {
    signedTxn,
    fullTxn,
    txnHash,
    explorerUrl,
  });

  const res = await HTTPSProvider.sendTransaction(signedTxn);

  return {
    transaction: res,
    toAddress: fullTxn.to,
    estimatedCost: estimatedTotalTxnCost,
    txnHash,
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

export function formatWalletAddress(address: string) {
  return `${address.substring(0, 10)}...${address.substring(32)}`;
}

export function formatTxnHash(txnHash: string) {
  return `${txnHash.substring(0, 6)}...${txnHash.substring(60)}`;
}

export function getBaseSnowtraceUrl() {
  return isProd ? `https://snowtrace.io` : `https://testnet.snowtrace.io`;
}

export function getSnowtraceExplorerUrl(txnHash: string) {
  return isProd
    ? `https://snowtrace.io/tx/${txnHash}`
    : `https://testnet.snowtrace.io/tx/${txnHash}`;
}
