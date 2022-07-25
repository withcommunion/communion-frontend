import { getUserJwtTokenOnServer } from '@/util/cognitoAuthUtil';
import { GetServerSideProps } from 'next';

import { RedeemSample } from '@/pages_components/org/[orgId]/redeemComponents';

const RedeemPage = () => {
  return (
    <div className="py-4 flex flex-col items-center ">
      <p>Have fun 😊</p>
      <p>Thank you 🙏</p>
      <RedeemSample />
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
export default RedeemPage;
