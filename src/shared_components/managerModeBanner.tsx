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
  const isManagerModeAvailable =
    // TODO: Remove && false to release
    useAppSelector((state) => selectIsManagerModeAvailable(state));
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
      className={cx('py-2 relative top-0 z-100', {
        'bg-primaryOrange': isManagerModeActive,
        'bg-primaryLightGray': !isManagerModeActive,
      })}
    >
      <div className="container w-full px-6 place-content-between my-0 mx-auto md:max-w-50vw items-center flex flex-row">
        <p
          className={cx('font-medium', {
            'text-white': isManagerModeActive,
            'text-primaryGray ': !isManagerModeActive,
          })}
        >
          Manager Mode
        </p>
        <label className="inline-flex relative items-center cursor-pointer">
          <input
            onClick={() => {
              dispatch(toggledManagerModeActive());
            }}
            type="checkbox"
            value={isManagerModeActive.toString()}
            className="sr-only peer"
          />
          <div
            className={cx(
              'w-16 h-6 focus:outline-none rounded-full',
              "after:content-[''] after:absolute after:top-[2px]  after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all",
              {
                'bg-thirdOrange after:translate-x-full after:left-[20px] after:border-white':
                  isManagerModeActive,
              },
              { 'after:left-[5px] bg-thirdGray': !isManagerModeActive }
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
