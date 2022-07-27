import { FC } from 'react';
import { ITransactions } from '@/pages_components/org/[orgId]/orgIdIndex/history/OrgTransactionHistoryList';
import Image from 'next/image';

const OrgTransactionHistory: FC<{ transaction: ITransactions }> = ({
  transaction,
}) => {
  const { status, name, value, date, tokenSymbol } = transaction;

  return (
    <li className="flex items-center justify-between px-3 bg-white my-1 rounded">
      <div className="flex items-center">
        <Image
          src={
            status === 'succeeded'
              ? '/images/home/history/success.svg'
              : '/images/home/history/warning.svg'
          }
          alt="operation"
          width="25px"
          height="22px"
        />
        <span className="py-4 text-primaryGray font-normal text-15px ml-2">
          {status === 'succeeded' ? `Sent ${name} ` : 'Claiming '} {value}{' '}
          {tokenSymbol}
        </span>
      </div>
      <div>
        <span className="text-secondaryPurple text-13px font-light">
          {date}
        </span>
      </div>
    </li>
  );
};

export default OrgTransactionHistory;
