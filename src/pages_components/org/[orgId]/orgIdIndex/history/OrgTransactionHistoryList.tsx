import OrgTransactionHistory from '@/pages_components/org/[orgId]/orgIdIndex/history/orgTransactionHistory/OrgTransactionHistoryItem';

export interface ITransactions {
  status: string;
  value: number;
  name: string;
  date: string;
  tokenSymbol: string;
}

interface Props {
  transactions: ITransactions[];
}

const HistoryOrg = ({ transactions }: Props) => {
  return (
    <>
      <div className="my-4 flex justify-between text-center">
        <span className="text-primaryGray font-semibold text-4">History</span>
        {/** TODO: Make this functional */}
        {/* <button className="text-primaryOrange font-light text-13px">
          Show All
        </button> */}
      </div>
      <ul>
        {transactions.map((transaction, num: number) => (
          <OrgTransactionHistory key={num} transaction={transaction} />
        ))}
      </ul>
    </>
  );
};

export default HistoryOrg;
