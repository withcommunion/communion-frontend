import { type Transaction } from 'ethers';
import { formatTxnHash } from '@/util/avaxEthersUtil';

interface Props {
  transaction: Transaction;
  amount: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  toFirstName: string;
  toLastName: string;
}

export default function Transaction({
  transaction,
  status,
  amount,
  toFirstName,
  toLastName,
}: Props) {
  return (
    <ul>
      {status === 'loading' && <li>♻️ Transaction in progress!</li>}
      {status === 'succeeded' && <li>✅ Transaction completed!</li>}
      <li>
        To: {toFirstName} {toLastName}
      </li>
      <li>Amount: {amount}</li>
      {status === 'succeeded' && transaction.hash && (
        <li>
          View Txn:{' '}
          <a
            className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
            href={`https://testnet.snowtrace.io/tx/${transaction.hash}`}
            target="_blank"
            rel="noreferrer"
          >
            {transaction.hash && formatTxnHash(transaction.hash)}
          </a>
        </li>
      )}
    </ul>
  );
}
