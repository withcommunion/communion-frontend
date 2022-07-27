import OrgTransactionHistoryItem from '@/pages_components/org/[orgId]/orgIdIndex/history/orgTransactionHistory/OrgTransactionHistoryItem';
import { HistoricalTxn } from '@/util/walletApiUtil';

interface Props {
  fetchRefreshTxns: () => void;
  transactions: HistoricalTxn[];
}

const HistoryOrg = ({ transactions, fetchRefreshTxns }: Props) => {
  return (
    <>
      <div className="my-4 flex justify-between text-center">
        <span className="text-primaryGray font-semibold text-4">History</span>
        <button
          className="text-sm border-2 border-primaryOrange text-primaryOrange py-1 px-1 rounded"
          onClick={fetchRefreshTxns}
        >
          Refresh
        </button>
        {/** TODO: Make this functional */}
        {/* <button className="text-primaryOrange font-light text-13px">
          Show All
        </button> */}
      </div>
      <ul>
        {transactions.map((transaction, num: number) => (
          <OrgTransactionHistoryItem key={num} transaction={transaction} />
        ))}
      </ul>
    </>
  );
};

export default HistoryOrg;
