import Image from 'next/image';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/reduxHooks';
import {
  selectOrg,
  fetchOrgTokenBalance,
  selectOrgUserTokenStatus,
} from '@/features/organization/organizationSlice';
import { selectSelf } from '@/features/selfSlice';
import Greeting from '@/shared_components/selfHeader/greeting/Greeting';
import TokenBalance from '@/shared_components/selfHeader/tokenBalance/TokenBalance';
import {
  formatWalletAddress,
  getBaseSnowtraceUrl,
} from '@/util/avaxEthersUtil';

interface Props {
  tokenAmount?: number | string | null;
  tokenSymbol?: string;
  name?: string;
  orgId?: string;
}

const SelfOrgHeader = ({ tokenAmount, tokenSymbol, name, orgId }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const dispatch = useAppDispatch();
  const org = useAppSelector((state) => selectOrg(state));
  const self = useAppSelector((state) => selectSelf(state));
  const tokenBalanceStatus = useAppSelector((state) =>
    selectOrgUserTokenStatus(state)
  );

  const contractAddress = org.avax_contract.address;
  const walletAddress = self?.walletAddressC;
  return (
    <>
      <div className="relative">
        <Greeting name={name} />
        {orgId === 'jacks-pizza-pittsfield' && (
          <div className="absolute right-0 top-0">
            <Image
              src="/images/orgLogos/jacksPizzaLogo.png"
              height="65px"
              width="65px"
              alt="jacks pizza logo"
            />
          </div>
        )}
      </div>
      <div
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <TokenBalance
          tokenAmount={tokenAmount}
          tokenSymbol={tokenSymbol}
          isBalanceLoading={tokenBalanceStatus === 'loading'}
          isExpanded={isExpanded}
        />
      </div>
      {isExpanded && contractAddress && walletAddress && (
        <div className="flex justify-between align-middle">
          <div>
            <span className="text-12px">Your wallet address: </span>
            <a
              target="_blank"
              rel="noreferrer"
              className="text-12px text-blue-600 underline visited:text-purple-600 hover:text-blue-800"
              href={`${getBaseSnowtraceUrl()}/address/${walletAddress}`}
            >
              {formatWalletAddress(walletAddress)}
            </a>
          </div>
          <button
            className="self-end rounded border-2 border-primaryOrange py-1 px-1 text-sm text-primaryOrange"
            disabled={tokenBalanceStatus === 'loading'}
            onClick={() =>
              dispatch(
                fetchOrgTokenBalance({
                  contractAddress,
                  walletAddress,
                })
              )
            }
          >
            Refresh Balance
          </button>
        </div>
      )}
    </>
  );
};

export default SelfOrgHeader;
