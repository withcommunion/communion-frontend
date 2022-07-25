import { getUserJwtTokenOnServer } from '@/util/cognitoAuthUtil';
import { GetServerSideProps } from 'next';

import { SendSample } from '@/pages_components/org/[orgId]/sendComponents';

const sendPage = () => {
  return (
    <div className="py-4 flex flex-col items-center ">
      <p>Have fun 😊</p>
      <p>Thank you 🙏</p>
      <SendSample />
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
export default sendPage;
