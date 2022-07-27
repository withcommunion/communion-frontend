import { getUserJwtTokenOnServer } from '@/util/cognitoAuthUtil';
import { GetServerSideProps } from 'next';
import NavBar from '@/shared_components/navBar/NavBar';
import SelfOrgHeader from '@/shared_components/selfHeader/selfOrgHeader';

import {
  OrgTransactionHistoryList,
  ShortcutActions,
} from '@/pages_components/org/[orgId]/orgIdIndexComponents';

export interface ISelfHeader {
  tokenAmount: number;
  tokenSymbol: string;
  name: string;
}

const transactions = [
  {
    status: 'failed',
    value: 5500,
    name: 'Nancy',
    date: '11/12/2022',
    tokenSymbol: 'ppp',
  },
  {
    status: 'succeeded',
    value: 5500,
    name: 'Nancy',
    date: '11/12/2022',
    tokenSymbol: 'ppp',
  },
  {
    status: 'succeeded',
    value: 5500,
    name: 'Nancy',
    date: '11/12/2022',
    tokenSymbol: 'ppp',
  },
];

const shortcutActions = [
  {
    name: 'Compliance',
    value: 15,
    image: '/images/home/tokenTips/Compliance.png',
  },
  {
    name: 'Kindness',
    value: 10,
    image: '/images/home/tokenTips/Kindness.png',
  },
  {
    name: 'Politeness',
    value: 25,
    image: '/images/home/tokenTips/Politeness.png',
  },
];

const indexPage = () => {
  return (
    <>
      <div className="bg-secondaryLightGray pb-2 h-screen">
        <div className="container w-full px-6 my-0 mx-auto">
          <SelfOrgHeader
            tokenAmount={5500}
            tokenSymbol={'JPET'}
            name="Alexandr"
          />
          <ul className="my-6">
            <ShortcutActions shortcutActions={shortcutActions} />
          </ul>
          <div className="my-8">
            <OrgTransactionHistoryList transactions={transactions} />
          </div>
        </div>
      </div>
      <NavBar />
    </>
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
export default indexPage;
