import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import { fetchWalletByUserId } from '@/util/walletApiUtil';
import { getEthersWallet, getBalanceOfAddress } from '@/util/avaxEthersUtil';

const BasicWallet = () => {
  const [userPrivateKey, setUserPrivateKey] = useState<string>('');
  const [ethersWallet, setEthersWallet] = useState<ethers.Wallet>();
  const [accountBalance, setAccountBalance] = useState<string>();

  useEffect(() => {
    if (userPrivateKey) {
      console.log('here');
      setEthersWallet(getEthersWallet(userPrivateKey));
    }
  }, [userPrivateKey]);

  useEffect(() => {
    const fetchBalance = async (address: string) => {
      const balance = await getBalanceOfAddress(address);
      // console.log(balance);
      // console.log(balance.toString());
      // console.log(balance.toBigInt());
      // console.log(ethers.utils.formatEther(balance));
      setAccountBalance(ethers.utils.formatEther(balance));
    };

    if (ethersWallet) {
      fetchBalance(ethersWallet.address);
    }
  }, [ethersWallet]);

  return (
    <div className="h-screen container flex flex-col justify-center items-center">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={async () => {
          const userPrivateKey = await fetchWalletByUserId();
          setUserPrivateKey(userPrivateKey);
        }}
      >
        Connect to wallet
      </button>
      {ethersWallet && (
        <div className="w-screen">
          <p>Your address:</p>
          <p>{ethersWallet.address}</p>
        </div>
      )}
      {accountBalance && (
        <div className="w-screen">
          <p>Your balance:</p>
          <p>{accountBalance}</p>
        </div>
      )}
    </div>
  );
};

export default BasicWallet;
