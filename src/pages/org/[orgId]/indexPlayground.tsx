import { getUserJwtTokenOnServer } from '@/util/cognitoAuthUtil';
import { GetServerSideProps } from 'next';

import { OrgSample } from '@/pages_components/org/[orgId]/orgIdIndexComponents';

const indexPage = () => {
  return (
      <OrgSample />
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
