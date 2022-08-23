import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/reduxHooks';

import {
  selectOrg,
  selectOrgUserTokenBalance,
  fetchOrgTokenBalance,
} from '@/features/organization/organizationSlice';

import { selectSelf } from '@/features/selfSlice';

function useFetchOrgTokenBalance() {
  const dispatch = useAppDispatch();

  const org = useAppSelector((state) => selectOrg(state));
  const userTokenBalance = useAppSelector((state) =>
    selectOrgUserTokenBalance(state)
  );

  const self = useAppSelector((state) => selectSelf(state));

  useEffect(() => {
    if (
      userTokenBalance.status === 'idle' &&
      org.avax_contract.address &&
      self
    ) {
      dispatch(
        fetchOrgTokenBalance({
          walletAddress: self.walletAddressC,
          tokenContractAddress: org.avax_contract.token_address,
        })
      );
    }
  }, [userTokenBalance, org, self, dispatch]);
}

export default useFetchOrgTokenBalance;
