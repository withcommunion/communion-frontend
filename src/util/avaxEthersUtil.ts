import { ethers } from 'ethers';

import { isProd } from '@/util/envUtil';

export const prodAvaxUrl = 'api.avalanche.network';
export const fujiTestAvaxUrl = 'api.avax-test.network';
export const prodAvaxRpcUrl = 'https://api.avax.network/ext/bc/C/rpc';
export const fujiTestAvaxRpcUrl = 'https://api.avax-test.network/ext/bc/C/rpc';

export const rootExplorerUrl = isProd
  ? `https://snowtrace.io`
  : `https://testnet.snowtrace.io`;

export const HTTPSProvider = new ethers.providers.JsonRpcProvider(
  isProd ? prodAvaxRpcUrl : fujiTestAvaxRpcUrl
);

export function getEthersWallet(
  privateKeyWithLeadingHex: string
): ethers.Wallet {
  return new ethers.Wallet(privateKeyWithLeadingHex, HTTPSProvider);
}

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
