import { useEffect } from 'react';
import cx from 'classnames';
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
  const isManagerModeAvailable = useAppSelector((state) =>
    selectIsManagerModeAvailable(state)
  );
  const isManagerModeActive = useAppSelector((state) =>
    selectIsManagerModeActive(state)
  );

  useEffect(() => {
    if (org && self) {
      dispatch(calculatedIsManagerModeAvailable(self));
    }
  }, [org, self, dispatch]);

  return isManagerModeAvailable ? (
    <div
      className={cx('z-100 relative top-0 py-2', {
        'bg-primaryOrange': isManagerModeActive,
        'bg-primaryLightGray': !isManagerModeActive,
      })}
    >
      <div className="container my-0 mx-auto flex w-full flex-row place-content-between items-center px-6 md:max-w-50vw">
        <p
          className={cx('font-medium', {
            'text-white': isManagerModeActive,
            'text-primaryGray ': !isManagerModeActive,
          })}
        >
          Manager Mode
        </p>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            onClick={() => {
              dispatch(toggledManagerModeActive());
            }}
            type="checkbox"
            value={isManagerModeActive.toString()}
            className="peer sr-only"
          />
          <div
            className={cx(
              'h-6 w-16 rounded-full focus:outline-none',
              "after:absolute after:top-[2px] after:h-5  after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-['']",
              {
                'bg-thirdOrange after:left-[20px] after:translate-x-full after:border-white':
                  isManagerModeActive,
              },
              { 'bg-thirdGray after:left-[5px]': !isManagerModeActive }
            )}
          >
            <span
              className={cx('text-white transition-all selection:bg-none', {
                'pl-2': isManagerModeActive,
                'pl-8 ': !isManagerModeActive,
              })}
            >
              {isManagerModeActive ? 'On' : 'Off'}
            </span>
          </div>
        </label>
      </div>
    </div>
  ) : null;
}
