import { useState } from 'react';
import Image from 'next/image';
import cx from 'classnames';

import { HistoricalTxn } from '@/util/walletApiUtil';
import { formatTxnHash } from '@/util/avaxEthersUtil';
import { isProd } from '@/util/envUtil';

import { useAppSelector } from '@/reduxHooks';
import { selectIsManagerModeActive } from '@/features/organization/organizationSlice';

interface Props {
  transaction: HistoricalTxn;
  selfWalletAddress: string;
}
// TODO: Need to get Status from TXN, need to handle redemptions!
const OrgTransactionHistory = ({ transaction, selfWalletAddress }: Props) => {
  const { toUser, fromUser, timeStamp, tokenSymbol, value, to } = transaction;
  const [isExpanded, setIsExpanded] = useState(false);

  const isManagerModeActive = useAppSelector((state) =>
    selectIsManagerModeActive(state)
  );

  const status = 'succeeded';
  const date = new Date(parseInt(timeStamp) * 1000);
  const dateString = date.toLocaleDateString('en-US', {
    // hour: 'numeric',
    // minute: 'numeric',
  });

  const isRedemptionTxn =
    to.toLowerCase() === '0x0000000000000000000000000000000000000000';
  const isReceivedTxn = to.toLowerCase() === selfWalletAddress.toLowerCase();
  const isSentTxn = !isRedemptionTxn && !isReceivedTxn;

  return (
    <li
      className={cx('my-1 cursor-pointer rounded bg-white px-3 py-4', {
        'border border-primaryOrange': isManagerModeActive,
      })}
    >
      <div
        className="flex items-center justify-between "
        onClick={() => {
          setIsExpanded(!isExpanded);
          console.log(transaction);
          console.log(selfWalletAddress);
        }}
      >
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
          <span className="ml-2 text-15px font-normal text-primaryGray">
            {isRedemptionTxn && `Redeemed award for ${value} ${tokenSymbol}`}
            {isReceivedTxn &&
              `Received ${value} ${tokenSymbol} from ${fromUser.first_name} `}
            {isSentTxn &&
              `Sent ${value} ${tokenSymbol} to ${toUser.first_name} `}
            {/** TODO: Handle statuses! */}
            {/* {status === 'succeeded'
            ? `Sent ${toUser.first_name} `
            : 'Claiming '}{' '} */}
          </span>
        </div>
        <div>
          <span className="text-13px font-light text-secondaryPurple">
            {dateString}
          </span>
        </div>
      </div>
      {isExpanded && (
        <div className="ml-9">
          <span className="text-15px font-normal text-primaryGray">
            View Txn Details:{' '}
          </span>
          <a
            className="text-15px text-blue-600 underline visited:text-purple-600 hover:text-blue-800"
            href={
              isProd
                ? `https://snowtrace.io/tx/${transaction.hash}`
                : `https://testnet.snowtrace.io/tx/${transaction.hash}`
            }
            target="_blank"
            rel="noreferrer"
          >
            {transaction.hash && `${formatTxnHash(transaction.hash)}`}
          </a>
        </div>
      )}
    </li>
  );
};

export default OrgTransactionHistory;
