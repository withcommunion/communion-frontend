import { Self, SelfState } from '@/features/selfSlice';
import { ethers } from 'ethers';

import { formatWalletAddress } from '@/util/avaxEthersUtil';

interface Props {
  self: Self | null;
  balance: SelfState['wallet']['balance'];
  ethersWallet: ethers.Wallet | null;
  // eslint-disable-next-line
  refreshWalletBalance: (ethersWallet: ethers.Wallet) => void;
}
const SelfHeader = ({
  self,
  balance,
  ethersWallet,
  refreshWalletBalance,
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

          {balance && (
            <>
              <p>Your balance:</p>
              <p>{balance.valueString} AVAX</p>
              {ethersWallet && (
                <button
                  className="bg-blue-500 disabled:bg-gray-400 hover:bg-blue-700 text-white py-1 px-2 rounded"
                  disabled={balance.status === 'loading'}
                  onClick={() => {
                    refreshWalletBalance(ethersWallet);
                  }}
                >
                  Balance is zero? Refresh!
                </button>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default SelfHeader;
