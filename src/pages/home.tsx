import { getUserJwtTokenOnServer } from '@/util/cognitoAuthUtil';
import { GetServerSideProps } from 'next';
import { Transaction } from 'ethers';
import axios from 'axios';
import { API_URL } from '@/util/walletApiUtil';

const HomePage = ({ userJwt }: { userJwt: string }) => {
  const joinCommunionTestOrg = async () => {
    const joinGroupResp = await axios.post<{
      userAddedInDb: boolean;
      userAddedInSmartContract: boolean;
      userAddContractTxn: Transaction;
    }>(
      `${API_URL}/org/communion-test-org/join`,
      {
        role: 'owner',
      },
      {
        headers: {
          Authorization: userJwt,
        },
      }
    );
    console.log(joinGroupResp);
  };

  return (
    <div className="py-4 flex flex-col items-center ">
      <h2 className="text-xl">Available groups</h2>
      <button
        className="my-10 text-sm border-2 border-primaryOrange text-primaryOrange py-1 px-1 rounded"
        onClick={() => {
          joinCommunionTestOrg();
        }}
      >
        Join Communion test org
      </button>
      <p>Have fun 😊</p>
      <p>Thank you 🙏</p>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const userJwt = await getUserJwtTokenOnServer(context);
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
export default HomePage;
