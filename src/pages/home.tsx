import { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { getUserJwtTokenOnServer } from '@/util/cognitoAuthUtil';

import { useAppSelector, useAppDispatch } from '@/reduxHooks';
import { selectSelf, selectSelfStatus, fetchSelf } from '@/features/selfSlice';
import {
  fetchJoinOrgById,
  selectLatestJoinedOrgStatus,
  selectLatestJoinedOrgErrorMsg,
} from '@/features/joinOrg/joinOrgSlice';
import { IndexHeader } from '@/pages_components/indexPageComponents';
import Footer from '@/shared_components/footer/footer';

const HomePage = ({ userJwt }: { userJwt: string }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { joinCode, orgId } = router.query;
  const queryJoinCode = (joinCode as string) || '';
  const queryOrgId = (orgId as string) || '';

  const self = useAppSelector((state) => selectSelf(state));
  const selfStatus = useAppSelector((state) => selectSelfStatus(state));

  const latestJoinedOrgStatus = useAppSelector((state) =>
    selectLatestJoinedOrgStatus(state)
  );
  const latestJoinedOrgErrorMsg = useAppSelector((state) =>
    selectLatestJoinedOrgErrorMsg(state)
  );

  useEffect(() => {
    const shouldFetchSelf = selfStatus === 'idle';
    if (shouldFetchSelf && userJwt) {
      dispatch(fetchSelf(userJwt));
    }
  }, [userJwt, selfStatus, dispatch]);

  useEffect(() => {
    const shouldRouteUserToOnlyOrg =
      selfStatus === 'succeeded' &&
      self?.organizations.length === 1 &&
      !queryOrgId;

    if (shouldRouteUserToOnlyOrg) {
      router.push(`/org/${self.organizations[0].orgId}`);
    }
  }, [dispatch, selfStatus, self, queryOrgId, userJwt, router]);

  useEffect(() => {
    const joinOrgHelper = async () => {
      await dispatch(
        fetchJoinOrgById({
          orgId: queryOrgId,
          joinCode: queryJoinCode,
          jwtToken: userJwt,
        })
      );

      // Will handle routing to the org page if the user succesfully joins
      await dispatch(fetchSelf(userJwt));
    };

    const isUserAlreadyInOrg = Boolean(
      self?.organizations.find((org) => org.orgId === queryOrgId)
    );

    const shouldJoinOrg =
      !isUserAlreadyInOrg &&
      queryOrgId &&
      self &&
      latestJoinedOrgStatus === 'idle';

    if (isUserAlreadyInOrg) {
      router.push(`/org/${queryOrgId}`);
    }

    if (shouldJoinOrg) {
      joinOrgHelper();
    }
  }, [
    self,
    latestJoinedOrgStatus,
    queryOrgId,
    queryJoinCode,
    userJwt,
    dispatch,
    router,
  ]);

  return (
    <div className="bg-secondaryLightGray pb-2 min-h-100vh ">
      <div className="container flex w-full px-6 my-0 mx-auto md:max-w-50vw justify-center">
        <div className="mt-5">
          <IndexHeader userName={self?.first_name} />
          {(selfStatus === 'idle' || selfStatus === 'loading') && (
            <div className="text-center">
              <span>Setting you up!...</span>
              <Footer />
            </div>
          )}
          {selfStatus === 'succeeded' && self && !queryOrgId && (
            <div className="flex flex-col">
              {self.organizations.length ? (
                <div className="text-center ">
                  <h2 className="text-xl mt-5">Available groups</h2>
                  <ul>
                    {self.organizations.map((org) => (
                      <li key={org.orgId} className="my-2">
                        <Link href={`/org/${org.orgId}`}>
                          <button className="bg-secondaryOrange w-275px h-46px text-white shadow-primaryButtonShadow">
                            {org.orgId}
                          </button>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="mt-5">
                  <h2 className="text-2xl text-center">Hmmmm...</h2>
                  <h3 className="text-xl text-start">
                    It looks like you are not a member of any groups.
                  </h3>
                  <p>
                    If you have an invite link, please paste that into your
                    browser!
                  </p>
                  <Footer />
                </div>
              )}
            </div>
          )}

          {latestJoinedOrgStatus === 'loading' && (
            <div className="mt-5">
              <h2 className="text-2xl text-center">
                Joining the organization!
              </h2>
              <Footer />
            </div>
          )}
          {latestJoinedOrgStatus === 'failed' && (
            <div className="mt-5">
              <h2 className="text-2xl">Hmmmm...Something went wrong</h2>
              <p className="text-xl text-start my-2">
                It looks like the organization you are trying to join does not
                exist.
              </p>
              <p className="text-xl text-start my-2">
                Or the joinCode you were given is wrong.
              </p>
              <p>
                If you have an invite link, please paste that into your browser!
              </p>
              <p>
                If you already did that, please ask your organization admin to
                resend the url.
              </p>
              <p className="mt-5">{latestJoinedOrgErrorMsg}</p>
              <Footer />
            </div>
          )}
        </div>
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
export default HomePage;
