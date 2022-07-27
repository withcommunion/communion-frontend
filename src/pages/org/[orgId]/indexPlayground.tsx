import { getUserJwtTokenOnServer } from '@/util/cognitoAuthUtil';
import { GetServerSideProps } from 'next';
import NavBar from "@/shared_components/navBar/NavBar";
import SelfHeaderOrg from "@/shared_components/selfHeader/selfHeaderOrg";
import HistoryOrg from "@/pages_components/org/[orgId]/orgIdIndex/history/HistoryOrg";
import ShortcutActions from "@/pages_components/org/[orgId]/orgIdIndex/shortcutActions/ShortcutActions";


export interface ISelfHeader {
  tokenAmount: number, tokenSymbol: string,name: string
}

const indexPage = () => {

  const selfHeader: ISelfHeader[] = [
    {tokenAmount: 5500,tokenSymbol: 'PPP',name: 'Alexandr'}
  ]


    return(<>
      <div className="bg-secondaryLightGray pb-2 h-screen">
        <div className="container w-full px-6 my-0 mx-auto">
          <SelfHeaderOrg selfHeader={selfHeader}/>
          <ul className="my-6">
            <ShortcutActions/>
          </ul>
          <div className="my-8">
            <HistoryOrg selfHeader={selfHeader}/>
          </div>
        </div>
      </div>
      <NavBar/>
    </>)
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
