import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/reduxHooks';
import { useRouter } from 'next/router';

import {
  reset as resetOrg,
  fetchOrgById,
  selectOrgStatus,
} from '@/features/organization/organizationSlice';

function useFetchOrg(userJwt: string) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { orgId } = router.query;

  const orgStatus = useAppSelector((state) => selectOrgStatus(state));

  useEffect(() => {
    if (userJwt && orgId && orgStatus === 'idle') {
      const id = orgId.toString();
      dispatch(fetchOrgById({ orgId: id, jwtToken: userJwt }));
    }
  }, [orgId, orgStatus, userJwt, dispatch]);

  useEffect(() => {
    if (orgStatus === 'failed') {
      // TODO: This causes an ugly infinite loop.  Fix it.
      dispatch(resetOrg());
      router.push('/');
    }
  }, [orgStatus, router, dispatch]);
}

export default useFetchOrg;
