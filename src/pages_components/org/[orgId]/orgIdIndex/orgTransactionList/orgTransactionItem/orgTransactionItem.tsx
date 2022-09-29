import { useState } from 'react';
import Image from 'next/image';
import cx from 'classnames';

import { CommunionNft, CommunionTx } from '@/util/walletApiUtil';
import { formatTxnHash } from '@/util/avaxEthersUtil';

import { useAppSelector } from '@/reduxHooks';
import { selectIsManagerModeActive } from '@/features/organization/organizationSlice';

interface Props {
  transaction: CommunionTx;
  selfWalletAddress: string;
  orgId: string;
  availableNfts: CommunionNft[];
}
const OrgTransactionHistoryItem = ({
  transaction,
  orgId,
  availableNfts,
}: Props) => {
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

  const isNft = txType === 'nftMint';
  const foundNft = isNft
    ? availableNfts.find((nft) => nft.id === transaction.message)
    : null;

  let nftText;
  if (isNft && foundNft) {
    const nftName = foundNft?.erc721Meta.properties.name || 'Badge';
    nftText = isManagerModeActive
      ? `Sent ${nftName} to ${toUser.firstName} ${toUser.lastName.substring(
          0,
          1
        )}`
      : `Received ${nftName} from 🏦 ${tokenSymbol} Bank `;
  }

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
            {txType === 'nftMint' && foundNft && nftText}
          </span>

          <span className="text-center md:ml-2">
            {modifier === 'bankHeist' && '🏦 Bank Heist!'}
          </span>
          {!isExpanded && !isNft && transaction.message && (
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
          {!isNft && <span className="my-2">{transaction.message}</span>}
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
