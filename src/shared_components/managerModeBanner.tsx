import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/reduxHooks';
import {
  selectOrg,
  toggledManagerModeActive,
  calculatedIsManagerModeAvailable,
  selectIsManagerModeAvailable,
  selectIsManagerModeActive,
} from '@/features/organization/organizationSlice';
import { selectSelf } from '@/features/selfSlice';

export default function ManagerModeBanner() {
  const dispatch = useAppDispatch();
  const self = useAppSelector((state) => selectSelf(state));
  const org = useAppSelector((state) => selectOrg(state));
  const isManagerModeAvailable =
    // TODO: Remove && false to release
    useAppSelector((state) => selectIsManagerModeAvailable(state)) && false;
  const isManagerModeActive = useAppSelector((state) =>
    selectIsManagerModeActive(state)
  );

  useEffect(() => {
    console.log('fired');
    if (org && self) {
      dispatch(calculatedIsManagerModeAvailable(self));
    }
  }, [org, self, dispatch]);

  return isManagerModeAvailable ? (
    <>
      <p
        onClick={() => {
          dispatch(toggledManagerModeActive());
        }}
      >
        Is manager mode active: {isManagerModeActive.toString()}
      </p>
    </>
  ) : null;
}
