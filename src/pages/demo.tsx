import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { ethers } from 'ethers';
import { Amplify } from 'aws-amplify';
import { useAuthenticator } from '@aws-amplify/ui-react';

import {
  fetchSelf,
  Self,
  fetchOrganization,
  Organization,
} from '@/util/walletApiUtil';
import { getEthersWallet, sendAvax } from '@/util/avaxEthersUtil';
import { AMPLIFY_CONFIG } from '@/util/cognitoAuthUtil';

import { getUserJwtTokenOnServer } from '@/util/cognitoAuthUtil';
import NavBar from '@/shared_components/navBar';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: true });

interface Props {
  userJwt: string;
  self: Self;
}

const BasicWalletDemo = ({ userJwt, self }: Props) => {
  const [userPrivateKey, setUserPrivateKey] = useState<string>('');
  const [ethersWallet, setEthersWallet] = useState<ethers.Wallet>();
  const [accountBalance, setAccountBalance] = useState<string>();
  const [isAccountBalanceZero, setIsAccountBalanceZero] =
    useState<boolean>(false);
  const [isAccountBalanceZeroLoading, setIsAccountBalanceZeroLoading] =
    useState<boolean>(false);
  const [organization, setOrganization] = useState<Organization>();
  const [latestTransaction, setLatestTransaction] = useState<{
    toAddress?: string;
    estimatedTxnCost?: string;
    actualTxnCost?: string;
    isInProgress: boolean;
    txnHash?: string;
    txnExplorerUrl?: string;
  }>();

  const { signOut } = useAuthenticator((context) => [context.signOut]);

  useEffect(() => {
    if (!userPrivateKey && self && self.wallet.privateKeyWithLeadingHex) {
      setUserPrivateKey(self.wallet.privateKeyWithLeadingHex);
      setEthersWallet(getEthersWallet(self.wallet.privateKeyWithLeadingHex));
    }
  }, [self, userPrivateKey]);

  useEffect(() => {
    const fetchBalance = async (wallet: ethers.Wallet) => {
      const balanceBigNumber = await wallet.getBalance();
      const balance = ethers.utils.formatEther(balanceBigNumber);
      setIsAccountBalanceZero(balanceBigNumber.isZero());
      setAccountBalance(balance);
    };

    if (ethersWallet && !accountBalance) {
      fetchBalance(ethersWallet);
    }
  }, [ethersWallet, accountBalance]);

  useEffect(() => {
    const fetchOrg = async () => {
      const org = await fetchOrganization(self.organization, userJwt);
      setOrganization(org);
    };

    if (!organization && self && userJwt) {
      fetchOrg();
    }
  }, [self, organization, userJwt]);

  const getUserTxnIsTo = (toAddress: string) => {
    return organization?.users.find(
      (user) => user.wallet.addressC === toAddress
    );
  };

  const sendUserAvax = async (wallet: ethers.Wallet, toAddress: string) => {
    setLatestTransaction({ isInProgress: true });
    const txnInProgress = await sendAvax(wallet, '0.00000001', toAddress);

    const txn = {
      toAddress: toAddress,
      estimatedTxnCost: ethers.utils.formatEther(txnInProgress.estimatedCost),
      isInProgress: true,
      txnHash: txnInProgress.txHash,
      txnExplorerUrl: txnInProgress.explorerUrl,
    };

    setLatestTransaction(txn);

    const finishedTransaction = await txnInProgress.transaction.wait();

    const actualCost = finishedTransaction.effectiveGasPrice.mul(
      finishedTransaction.gasUsed
    );

    setLatestTransaction({
      ...txn,
      actualTxnCost: ethers.utils.formatEther(actualCost),
      isInProgress: false,
    });

    const balanceBigNumber = await wallet.getBalance();
    setIsAccountBalanceZero(balanceBigNumber.isZero());
    setAccountBalance(ethers.utils.formatEther(balanceBigNumber));
  };

  return (
    <>
      <NavBar signOut={signOut} active="send" />
      <div className="py-4 flex flex-col items-center ">
        <div className="w-full md:w-1/4 px-5">
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
                          {`${ethersWallet.address.substring(
                            0,
                            10
                          )}...${ethersWallet.address.substring(32)}`}
                        </a>
                      </small>
                    </p>
                  </div>
                </>
              )}

              {accountBalance && (
                <>
                  <p>Your balance:</p>
                  <p>
                    {latestTransaction?.isInProgress && <small>♻️</small>}
                    {accountBalance} AVAX
                  </p>
                  {isAccountBalanceZero && ethersWallet && (
                    <button
                      className="bg-blue-500 disabled:bg-gray-400 hover:bg-blue-700 text-white py-1 px-2 rounded"
                      disabled={isAccountBalanceZeroLoading}
                      onClick={async () => {
                        setIsAccountBalanceZeroLoading(true);
                        const balance = await ethersWallet.getBalance();
                        setIsAccountBalanceZero(balance.isZero());
                        setAccountBalance(ethers.utils.formatEther(balance));
                        setIsAccountBalanceZeroLoading(false);
                      }}
                    >
                      Balance is zero? Refresh!
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {organization && (
            <ul className="mt-5 h-50vh flex flex-col items-start gap-y-3 overflow-auto">
              {organization.users.map((user) => (
                <li
                  className="flex justify-between items-center w-full gap-x-2"
                  key={`${user.wallet.addressC}`}
                >
                  <p>
                    {user.first_name} {user.last_name}
                  </p>
                  <button
                    className="bg-blue-500 disabled:bg-gray-400 hover:bg-blue-700 text-white py-1 px-2 rounded"
                    disabled={latestTransaction?.isInProgress}
                    onClick={async () => {
                      if (ethersWallet) {
                        await sendUserAvax(ethersWallet, user.wallet.addressC);
                      }
                    }}
                  >
                    Send
                  </button>
                </li>
              ))}
            </ul>
          )}
          {latestTransaction && (
            <div className="mt-10">
              <ul>
                {latestTransaction.isInProgress && (
                  <li>♻️ Transaction in progress!</li>
                )}
                {!latestTransaction.isInProgress && (
                  <li>✅ Transaction completed!</li>
                )}
                {latestTransaction.toAddress && (
                  <li>
                    To:{' '}
                    {getUserTxnIsTo(latestTransaction.toAddress)?.first_name}{' '}
                    {getUserTxnIsTo(latestTransaction.toAddress)?.last_name}
                  </li>
                )}
                {latestTransaction.txnExplorerUrl && (
                  <li>
                    View Txn:
                    <a
                      className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                      href={latestTransaction.txnExplorerUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {latestTransaction.txnHash?.substring(0, 5)}...
                      {latestTransaction.txnHash?.substring(60)}
                    </a>
                  </li>
                )}
                {latestTransaction.estimatedTxnCost && (
                  <li>
                    Estimated Txn Cost: {latestTransaction.estimatedTxnCost}{' '}
                    AVAX
                  </li>
                )}
                {latestTransaction.actualTxnCost && (
                  <li>
                    Actual Txn Cost: {latestTransaction.actualTxnCost} AVAX
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const userJwt = await getUserJwtTokenOnServer(context);
    let self;
    if (userJwt) {
      self = await fetchSelf(userJwt);
      return {
        props: { userJwt, self },
      };
    }
    return {
      props: { userJwt },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {},
      redirect: {
        destination: '/',
      },
    };
  }
};

export default BasicWalletDemo;
