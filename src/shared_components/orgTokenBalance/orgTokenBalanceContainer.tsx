import Image from 'next/image';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/reduxHooks';
import {
  selectOrg,
  fetchOrgTokenBalance,
  selectOrgUserTokenBalance,
  selectOrgUserTokenStatus,
} from '@/features/organization/organizationSlice';
import { selectSelf } from '@/features/selfSlice';

import { useFetchOrgTokenBalance } from '@/shared_hooks/sharedHooks';

import Greeting from '@/shared_components/orgTokenBalance/greeting/greeting';
import TokenBalance from '@/shared_components/orgTokenBalance/tokenBalance/tokenBalance';
import {
  formatWalletAddress,
  getBaseSnowtraceUrl,
} from '@/util/avaxEthersUtil';

const SelfOrgHeader = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const dispatch = useAppDispatch();

  const org = useAppSelector((state) => selectOrg(state));
  const self = useAppSelector((state) => selectSelf(state));
  const tokenBalanceStatus = useAppSelector((state) =>
    selectOrgUserTokenStatus(state)
  );

  const { valueString, tokenSymbol } = useAppSelector((state) =>
    selectOrgUserTokenBalance(state)
  );

  const contractAddress = org.avax_contract.address;
  const walletAddress = self?.walletAddressC;

  useFetchOrgTokenBalance();

  return (
    <>
      <div className="relative">
        <Greeting name={self?.first_name} />
        {org.id === 'jacks-pizza-pittsfield' && (
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
          tokenAmount={valueString}
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
                  tokenContractAddress: org.avax_contract.token_address,
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
