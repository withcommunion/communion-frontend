import { getUserJwtTokenOnServer } from '@/util/cognitoAuthUtil';
import { GetServerSideProps } from 'next';

import NavBar, { AvailablePages } from '@/shared_components/navBar/NavBar';
import {
  SendPageHeader,
  SendMemberListContainer,
} from '@/pages_components/org/[orgId]/sendComponents';

const sendPage = () => {
  return (
    <div className="pb-6 h-full bg-secondaryLightGray">
      <div className="container w-full px-6 my-0 mx-auto mb-10">
        <SendPageHeader />
        {/* <SearchPanel /> */}
        <SendMemberListContainer />
        <NavBar
          activePage={AvailablePages.orgSend}
          activeOrgId={'communion-test-org'}
        />
      </div>
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
