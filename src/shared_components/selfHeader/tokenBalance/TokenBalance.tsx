import Image from 'next/image';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/reduxHooks';
import {
  selectOrg,
  fetchOrgTokenBalance,
} from '@/features/organization/organizationSlice';
import { selectSelf } from '@/features/selfSlice';
import SecondaryButton from '@/shared_components/buttons/secondaryButton';

interface Props {
  tokenAmount?: number | string | null;
  tokenSymbol?: string;
}
const TokenBalance = ({ tokenAmount, tokenSymbol }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const dispatch = useAppDispatch();
  const org = useAppSelector((state) => selectOrg(state));
  const self = useAppSelector((state) => selectSelf(state));

  const contractAddress = org.avax_contract.address;
  const walletAddress = self?.walletAddressC;
  return (
    <div
      className="bg-primaryLightGray rounded-md flex justify-between items-center px-4 py-4 font-normal"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <span className="text-4 text-secondaryGray">Your Balance</span>
      {isExpanded && contractAddress && walletAddress && (
        <div>
          <SecondaryButton
            size="small"
            text="Refresh"
            onClick={() =>
              dispatch(
                fetchOrgTokenBalance({
                  contractAddress,
                  walletAddress,
                })
              )
            }
          />
        </div>
      )}
      <div className="flex  rounded-lg bg-white px-4 py-3 w-44">
        <Image
          src="/images/home/Arrow.svg"
          alt="arrow"
          width="9px"
          height="16px"
        />
        <span className="text-17px text-primaryPurple px-3">
          {tokenAmount} {tokenSymbol}
        </span>
      </div>
    </div>
  );
};

export default TokenBalance;
