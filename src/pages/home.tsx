import { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import { getUserJwtTokenOnServer } from '@/util/cognitoAuthUtil';

import { useAppSelector, useAppDispatch } from '@/reduxHooks';
import { selectSelf, selectSelfStatus, fetchSelf } from '@/features/selfSlice';
import {
  fetchJoinOrgById,
  selectLatestJoinedOrgStatus,
} from '@/features/joinOrg/joinOrgSlice';
import { IndexHeader } from '@/pages_components/indexPageComponents';

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

  useEffect(() => {
    const shouldFetchSelf = selfStatus === 'idle';
    const shouldRouteUserToOnlyOrg =
      selfStatus === 'succeeded' &&
      self?.organizations.length === 1 &&
      !queryOrgId;

    if (shouldFetchSelf) {
      dispatch(fetchSelf(userJwt));
    } else if (shouldRouteUserToOnlyOrg) {
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
    <div className="py-4 flex flex-col items-center ">
      {self && (
        <div>
          <IndexHeader userName={self?.first_name} />
          <h2 className="text-xl">Available groups</h2>
          <ul>
            {self?.organizations.map((org) => (
              <li key={org.orgId}>{org.orgId}</li>
            ))}
          </ul>
        </div>
      )}
      {selfStatus === 'idle' && (
        <div>
          <span>Fetching you from the database!...</span>
        </div>
      )}
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
