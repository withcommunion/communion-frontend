import OrgTransactionHistoryItem from '@/pages_components/org/[orgId]/orgIdIndex/history/orgTransactionHistory/OrgTransactionHistoryItem';
import { HistoricalTxn } from '@/util/walletApiUtil';

interface Props {
  fetchRefreshTxns: () => void;
  transactions: HistoricalTxn[];
  selfWalletAddress: string;
  isManagerModeActive: boolean;
}

const HistoryOrg = ({
  isManagerModeActive,
  transactions,
  fetchRefreshTxns,
  selfWalletAddress,
}: Props) => {
  return (
    <>
      <div className="my-4 flex justify-between text-center">
        <span className="text-4 font-semibold text-primaryGray">
          {isManagerModeActive ? 'Bank History' : 'Your History'}
        </span>
        <button
          className="rounded border-2 border-primaryOrange py-1 px-1 text-sm text-primaryOrange"
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
          <OrgTransactionHistoryItem
            key={num}
            transaction={transaction}
            selfWalletAddress={selfWalletAddress}
          />
        ))}
      </ul>
    </>
  );
};

export default HistoryOrg;
