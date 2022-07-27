import { HistoricalTxn } from '@/util/walletApiUtil';
import Image from 'next/image';

interface Props {
  transaction: HistoricalTxn;
}
// TODO: Need to get Status from TXN, need to handle redemptions!
const OrgTransactionHistory = ({ transaction }: Props) => {
  const { toUser, timeStamp, tokenSymbol, value, to } = transaction;
  const status = 'succeeded';
  const date = new Date(parseInt(timeStamp) * 1000);
  const dateString = date.toLocaleDateString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
  });

  const isRedemptionTxn = to === '0x0000000000000000000000000000000000000000';

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
          {isRedemptionTxn && 'Redeemed award for '}
          {!isRedemptionTxn && `Sent ${toUser.first_name} `}
          {/** TODO: Handle statuses! */}
          {/* {status === 'succeeded'
            ? `Sent ${toUser.first_name} `
            : 'Claiming '}{' '} */}
          {value} {tokenSymbol}
        </span>
      </div>
      <div>
        <span className="text-secondaryPurple text-13px font-light">
          {dateString}
        </span>
      </div>
    </li>
  );
};

export default OrgTransactionHistory;
