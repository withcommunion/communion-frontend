// TODO: This will make this component real smoove https://reactjs.org/docs/animation.html
// TODO: Use Redux - but wait until it is necessary, right now it isn't
import { useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { User } from '@/util/walletApiUtil';
import { formatWalletAddress } from '@/util/avaxEthersUtil';

import {
  fetchSelfTransferFunds,
  selectLatestTxnStatus,
  selectLatestTxn,
  selectLatestTxnErrorMessage,
} from '@/features/transactions/transactionsSlice';
import Transaction from '@/shared_components/transaction';
import { useAppDispatch, useAppSelector } from '@/reduxHooks';
import {
  fetchOrgTokenBalance,
  selectOrgContract,
  selectOrgUserTokenStatus,
  selectOrgUserTokenBalance,
} from '@/features/organization/organizationSlice';

interface Props {
  userJwt: string;
  onClose?: () => void;
  onOpen?: () => void;
  fromUsersWallet: ethers.Wallet;
  toUser: User;
  children?: ReactNode;
}
export default function SendTokensModal({
  userJwt,
  fromUsersWallet,
  toUser,
  onOpen,
  onClose,
  children,
}: Props) {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [amountToSend, setAmountToSend] = useState(0);
  const [fromUserBalance, setFromUserBalance] = useState('');

  const latestTxnStatus = useAppSelector(selectLatestTxnStatus);
  const latestTxn = useAppSelector(selectLatestTxn);
  const latestTxnErrorMessage = useAppSelector(selectLatestTxnErrorMessage);
  const orgContract = useAppSelector(selectOrgContract);
  const orgTokenBalance = useAppSelector(selectOrgUserTokenBalance);
  const orgTokenBalanceStatus = useAppSelector(selectOrgUserTokenStatus);

  useEffect(() => {
    const fetchUserBalance = async () => {
      const balance = await fromUsersWallet.getBalance();
      setFromUserBalance(ethers.utils.formatEther(balance));
    };
    if (isOpen && fromUsersWallet && !fromUserBalance) {
      fetchUserBalance();
    }
  }, [isOpen, fromUsersWallet, fromUserBalance]);

  const toAddress = toUser.walletAddressC;

  const toggleVisibility = () => {
    setIsOpen(!isOpen);

    if (isOpen && onOpen) {
      onOpen();
    }

    if (!isOpen && onClose) {
      onClose();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const sendUserTokens = async (
    toUserId: string,
    amount: number,
    orgId: string,
    userJwt: string
  ) => {
    await dispatch(
      fetchSelfTransferFunds({ toUserId, orgId, amount, jwtToken: userJwt })
    );

    if (orgContract) {
      dispatch(fetchOrgTokenBalance({ contract: orgContract }));
    }
  };

  return (
    <>
      {children ? (
        <div onClick={() => toggleVisibility()}>{children}</div>
      ) : (
        <button onClick={() => toggleVisibility()}>Click me</button>
      )}
      {isOpen && (
        <div
          id="menu"
          hidden={!isOpen}
          className="absolute left-0 top-0 w-full h-screen overflow-hidden bg-gray-900 bg-opacity-80 z-10"
        >
          <div className="text-white justify-center items-center flex md:py-12 px-4">
            <div className="w-96 py-4 px-4 md:px-24 md:w-auto bg-gray-800 relative flex flex-col justify-center items-center ">
              <div className="mt-2">
                <h1
                  role="main"
                  className="text-3xl text-white font-semibold leading-7"
                >
                  Sending to:
                </h1>
                <h2 className="text-xl text-white">
                  {toUser.first_name} {toUser.last_name}
                </h2>
                <div className="container flex flex-col">
                  <p className="text-white">Their address:</p>
                  <div className="whitespace-normal break-words">
                    <p>
                      <small>
                        <a
                          className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                          target="_blank"
                          rel="noreferrer"
                          href={`https://testnet.snowtrace.io/address/${toAddress}`}
                        >
                          {formatWalletAddress(toAddress)}
                        </a>
                      </small>
                    </p>
                  </div>
                </div>
              </div>

              <div className="">
                <form
                  className="mt-6 w-full"
                  onSubmit={(event) => {
                    event.preventDefault();
                    sendUserTokens(
                      toUser.id,
                      amountToSend,
                      toUser.organizations[0].orgId,
                      userJwt
                    );
                  }}
                >
                  <div className="w-full">
                    <div className="flex flex-row my-5 leading-7">
                      <p>Asset:</p>
                      <div className="flex flex-col ml-5 px-2 bg-gray-900 w-8/12">
                        <p className="text-xl">{orgTokenBalance.tokenSymbol}</p>

                        <p>
                          {(latestTxnStatus === 'loading' ||
                            orgTokenBalanceStatus === 'loading') && (
                            <small>♻️</small>
                          )}{' '}
                          Available Balance:
                          {orgTokenBalance.valueString &&
                            orgTokenBalance.valueString}
                        </p>
                      </div>
                    </div>

                    <label className="text-white mr-2" htmlFor="amount">
                      Amount
                    </label>
                    <input
                      className="text-black pl-1 w-8/12"
                      type="number"
                      step="any"
                      min="0"
                      id="amount"
                      value={amountToSend}
                      onFocus={(e) => {
                        if (e.target.value === '0') {
                          e.target.value = '';
                        }
                      }}
                      onChange={(event) => {
                        const value = event.target.value;
                        if (!value) {
                          setAmountToSend(0);
                          return;
                        }
                        setAmountToSend(parseFloat(event.target.value));
                      }}
                    />
                  </div>

                  <div className="flex flex-row w-fit">
                    <button
                      type="button"
                      onClick={() => toggleVisibility()}
                      className="bg-gray-900 text-white mt-14 text-base text-center text-white py-6 px-16 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={latestTxnStatus === 'loading'}
                      className="bg-white disabled:bg-gray-500 text-gray-800 mt-14 text-base text-center text-white py-6 px-16 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </div>
              <div>
                {latestTxn && (
                  <div className="my-8">
                    <Transaction
                      transaction={latestTxn}
                      status={latestTxnStatus}
                      amount={amountToSend}
                      toFirstName={toUser.first_name}
                      toLastName={toUser.last_name}
                    />
                  </div>
                )}
                {latestTxnStatus === 'failed' && (
                  <div className="my-8">
                    <p className="text-red-600">
                      Transaction failed. Please try again.
                    </p>
                    <p>{latestTxnErrorMessage}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
