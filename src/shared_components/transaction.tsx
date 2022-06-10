import { formatTxnHash } from '@/util/avaxEthersUtil';
export interface Transaction {
  toAddress?: string;
  amount?: string;
  estimatedTxnCost?: string;
  actualTxnCost?: string;
  isInProgress: boolean;
  txnHash?: string;
  txnExplorerUrl?: string;
}

interface Props {
  transaction: Transaction;
  toFirstName: string;
  toLastName: string;
}

export default function Transaction({
  transaction,
  toFirstName,
  toLastName,
}: Props) {
  return (
    <ul>
      {transaction.isInProgress && <li>♻️ Transaction in progress!</li>}
      {!transaction.isInProgress && <li>✅ Transaction completed!</li>}
      {transaction.amount && <li>Amount: {transaction.amount}</li>}
      {transaction.toAddress && (
        <li>
          To: {toFirstName} {toLastName}
        </li>
      )}
      {transaction.txnExplorerUrl && (
        <li>
          View Txn:
          <a
            className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
            href={transaction.txnExplorerUrl}
            target="_blank"
            rel="noreferrer"
          >
            {transaction.txnHash && formatTxnHash(transaction.txnHash)}
          </a>
        </li>
      )}
      {transaction.estimatedTxnCost && (
        <li>Estimated Txn Cost: {transaction.estimatedTxnCost} AVAX</li>
      )}
      {transaction.actualTxnCost && (
        <li>Actual Txn Cost: {transaction.actualTxnCost} AVAX</li>
      )}
    </ul>
  );
}
