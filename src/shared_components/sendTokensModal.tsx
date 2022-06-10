// TODO: This will make this component real smoove https://reactjs.org/docs/animation.html
import { useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { User } from '@/util/walletApiUtil';
import { sendAvax, formatWalletAddress } from '@/util/avaxEthersUtil';
import Transaction from '@/shared_components/transaction';

interface Props {
  onClose?: () => void;
  onOpen?: () => void;
  fromUsersWallet: ethers.Wallet;
  toUser: User;
  children?: ReactNode;
}
export default function SendTokensModal({
  fromUsersWallet,
  toUser,
  children,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [amountToSend, setAmountToSend] = useState(0);
  const [fromUserBalance, setFromUserBalance] = useState('');
  const [latestTransaction, setLatestTransaction] = useState<{
    toAddress?: string;
    amount?: string;
    estimatedTxnCost?: string;
    actualTxnCost?: string;
    isInProgress: boolean;
    txnHash?: string;
    txnExplorerUrl?: string;
  }>();

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
  };

  const sendUserAvax = async (
    amount: string,
    wallet: ethers.Wallet,
    toAddress: string
  ) => {
    setLatestTransaction({ isInProgress: true });
    const txnInProgress = await sendAvax(wallet, amount, toAddress);

    const txn = {
      amount: ethers.utils.formatEther(txnInProgress.transaction.value),
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
    setFromUserBalance(ethers.utils.formatEther(balanceBigNumber));
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
          <div className="text-white justify-center items-center flex py-32 px-4">
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
                    sendUserAvax(
                      amountToSend.toString(),
                      fromUsersWallet,
                      toAddress
                    );
                  }}
                >
                  <div className="w-full">
                    <div className="flex flex-row my-5 leading-7">
                      <p>Asset:</p>
                      <div className="flex flex-col ml-5 px-2 bg-gray-900 w-8/12">
                        <p className="text-xl">Avax</p>

                        <p>
                          {latestTransaction?.isInProgress && <small>♻️</small>}{' '}
                          Available Balance:
                        </p>
                        {fromUserBalance && <p>{fromUserBalance}</p>}
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
                      disabled={
                        latestTransaction?.isInProgress || !amountToSend
                      }
                      onClick={() => {
                        sendUserAvax(
                          amountToSend.toString(),
                          fromUsersWallet,
                          toAddress
                        );
                      }}
                      className="bg-white disabled:bg-gray-500 text-gray-800 mt-14 text-base text-center text-white py-6 px-16 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </div>
              <div>
                {latestTransaction && (
                  <div className="my-8">
                    <Transaction
                      transaction={latestTransaction}
                      toFirstName={toUser.first_name}
                      toLastName={toUser.last_name}
                    />
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
