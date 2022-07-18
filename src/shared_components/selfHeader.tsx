import { Self, SelfState } from '@/features/selfSlice';
import { OrganizationState } from '@/features/organization/organizationSlice';
import { ethers } from 'ethers';

import { formatWalletAddress } from '@/util/avaxEthersUtil';

interface Props {
  self: Self | null;
  balance: SelfState['wallet']['balance'];
  orgTokenBalance?: OrganizationState['userToken']['balance'];
  ethersWallet: ethers.Wallet | null;
  // eslint-disable-next-line
  refreshWalletBalance: (ethersWallet: ethers.Wallet) => void;
}
const SelfHeader = ({
  self,
  balance,
  orgTokenBalance,
  ethersWallet,
}: Props) => {
  return (
    <>
      {self && (
        <div className="container flex flex-col items-center">
          <h2>👋 Welcome {self.first_name}!</h2>
          {ethersWallet && (
            <>
              <p>Your address:</p>
              <div className="whitespace-normal break-words">
                <p>
                  <small>
                    <a
                      className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                      target="_blank"
                      rel="noreferrer"
                      href={`https://testnet.snowtrace.io/address/${ethersWallet.address}`}
                    >
                      {formatWalletAddress(ethersWallet.address)}
                    </a>
                  </small>
                </p>
              </div>
            </>
          )}

          {(balance || orgTokenBalance) && <p>Your balance:</p>}
          {balance && (
            <>
              <p>{balance.valueString} AVAX</p>
            </>
          )}
          {orgTokenBalance && (
            <>
              <p>
                {orgTokenBalance.valueString} {orgTokenBalance.tokenSymbol}
              </p>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default SelfHeader;
