import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/reduxHooks';
import {
  selectOrg,
  // toggledManagerModeActive,
  calculatedIsManagerModeAvailable,
  selectIsManagerModeAvailable,
  // selectIsManagerModeActive,
} from '@/features/organization/organizationSlice';
import { selectSelf } from '@/features/selfSlice';

export default function ManagerModeBanner() {
  const dispatch = useAppDispatch();
  const self = useAppSelector((state) => selectSelf(state));
  const org = useAppSelector((state) => selectOrg(state));
  const isManagerModeAvailable = useAppSelector((state) =>
    selectIsManagerModeAvailable(state)
  );
  // const isManagerModeActive = useAppSelector((state) =>
  //   selectIsManagerModeActive(state)
  // );

  useEffect(() => {
    if (org && self) {
      console.log('fired');
      dispatch(calculatedIsManagerModeAvailable(self));
    }
  }, [org, self, dispatch]);

  return isManagerModeAvailable ? (
    <>
      {/* <p>Banner yay!</p>
      <p
        onClick={() => {
          dispatch(toggledManagerModeActive());
        }}
      >
        Active: {isManagerModeActive.toString()}
      </p> */}
    </>
  ) : null;
}
