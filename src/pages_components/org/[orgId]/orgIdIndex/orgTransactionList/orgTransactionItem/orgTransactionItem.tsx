import { useState } from 'react';
import Image from 'next/image';
import cx from 'classnames';

import { CommunionTx } from '@/util/walletApiUtil';
import { formatTxnHash } from '@/util/avaxEthersUtil';

import { useAppSelector } from '@/reduxHooks';
import { selectIsManagerModeActive } from '@/features/organization/organizationSlice';

interface Props {
  transaction: CommunionTx;
  selfWalletAddress: string;
  orgId: string;
}
const OrgTransactionHistoryItem = ({ transaction, orgId }: Props) => {
  const {
    modifier,
    fromUser,
    timeStampSeconds,
    tokenSymbol,
    value,
    toUser,
    txType,
    txHashUrl,
    txHash,
  } = transaction;
  const [isExpanded, setIsExpanded] = useState(false);

  const isManagerModeActive = useAppSelector((state) =>
    selectIsManagerModeActive(state)
  );

  const status = 'succeeded';
  const date = new Date(timeStampSeconds * 1000);
  const dateString = date.toLocaleDateString('en-US', {
    // hour: 'numeric',
    // minute: 'numeric',
  });

  const isFromBank = fromUser.firstName === orgId;

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
            {txType === 'redemption' &&
              `Redeemed award for ${value} ${tokenSymbol}`}
            {txType === 'received' &&
              `Received ${value} ${tokenSymbol} from ${
                isFromBank ? `🏦 ${tokenSymbol} Bank` : fromUser.firstName
              } `}
            {txType === 'sent' &&
              `Sent ${value} ${tokenSymbol} to ${toUser.firstName} `}
          </span>

          <span className="-ml-6 text-center md:ml-2">
            {modifier === 'bankHeist' && '🏦 Bank Heist!'}
          </span>
          {!isExpanded && transaction.message && (
            <span className="ml-2 text-13px font-light text-secondaryPurple">
              {' '}
              {transaction.message.substring(0, 8)}..
            </span>
          )}
        </div>
        <div>
          <span className="text-13px font-light text-secondaryPurple">
            {dateString}
          </span>
        </div>
      </div>
      {isExpanded && (
        <div className="ml-9 flex flex-col">
          <span className="my-2">{transaction.message}</span>
          <span className="text-15px font-normal text-primaryGray">
            View Txn Details:{' '}
          </span>
          <a
            className="text-15px text-blue-600 underline visited:text-purple-600 hover:text-blue-800"
            href={txHashUrl}
            target="_blank"
            rel="noreferrer"
          >
            {txHash && `${formatTxnHash(txHash)}`}
          </a>
        </div>
      )}
    </li>
  );
};

export default OrgTransactionHistoryItem;
