import { useEffect, useState } from 'react';
import cx from 'classnames';
import Image from 'next/image';
import { isValidPhoneNumber } from 'react-phone-number-input';

import { useAppSelector, useAppDispatch } from '@/reduxHooks';
import {
  fetchPatchSelf,
  phoneNumberUpdated,
  allowSmsUpdated,
  selectPhoneNumber,
  selectAllowSms,
  selectfetchPatchSelfStatus,
} from '@/features/selfSettings/selfSettingsSlice';

import { selectSelf } from '@/features/selfSlice';

import UpdatePhoneNumberInput from './updatePhoneNumberInput/updatePhoneNumberInput';
import SecondaryButton from '@/shared_components/buttons/secondaryButton';

const PhoneSettingsContainer = ({ userJwt }: { userJwt: string }) => {
  const dispatch = useAppDispatch();
  const phoneNumber = useAppSelector((state) => selectPhoneNumber(state));
  const allowSms = useAppSelector((state) => selectAllowSms(state));
  const fetchPatchSelfStatus = useAppSelector((state) =>
    selectfetchPatchSelfStatus(state)
  );
  const self = useAppSelector((state) => selectSelf(state));

  useEffect(() => {
    if (self && self.phone_number) {
      dispatch(phoneNumberUpdated(self.phone_number));
    }

    if (self && self.allow_sms) {
      dispatch(allowSmsUpdated(self.allow_sms));
    }
  }, [self, dispatch]);

  const [isExpanded, setIsExpanded] = useState(false);

  const formSubmit = () => {
    const isLoading = fetchPatchSelfStatus === 'loading';
    const isValid =
      !phoneNumber || (phoneNumber && isValidPhoneNumber(phoneNumber));

    if (isValid && !isLoading) {
      console.log('fired');
      dispatch(fetchPatchSelf({ phoneNumber, allowSms, jwtToken: userJwt }));
    }
  };
  return (
    <li
      className={cx('my-5 flex w-full flex-col bg-white text-start', {
        'border-4 border-primaryBeige ': isExpanded,
      })}
    >
      <div
        className={'my-1 flex h-16 items-center rounded bg-white'}
        onClick={() => {
          setIsExpanded(!isExpanded);
        }}
      >
        <div className="relative flex grow items-center">
          <div className={`absolute h-30px w-1 bg-primaryYellow `}></div>
          <span
            className={cx(`ml-30px text-15px text-primaryGray`, {
              'ml-26px': isExpanded,
            })}
          >
            Update Notification Settings
          </span>
        </div>

        <div className="flex items-center">
          <div
            className={cx(
              `px-5 text-15px font-semibold text-primaryPurple transition-all`,
              {
                'rotate-90': isExpanded,
                'rotate-0': !isExpanded,
              }
            )}
          >
            <Image
              src="/images/home/Arrow.svg"
              alt="arrow"
              width="9px"
              height="16px"
            />
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="px-5">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              formSubmit();
            }}
          >
            <UpdatePhoneNumberInput
              phoneNumber={phoneNumber}
              onChange={(phoneNumber) => {
                dispatch(phoneNumberUpdated(phoneNumber));
              }}
            />

            <div>
              <label>Allow us to send SMS notifications</label>
              <input
                className="mx-3"
                checked={allowSms}
                onChange={() => dispatch(allowSmsUpdated(!allowSms))}
                type="checkbox"
              />
            </div>

            <div className="py-5 text-center">
              <SecondaryButton
                disabled={fetchPatchSelfStatus === 'loading'}
                type="submit"
                onClick={() => formSubmit()}
                size="big"
                text={
                  fetchPatchSelfStatus === 'loading' ? '♻️ Submit' : 'Submit'
                }
              />
            </div>
          </form>
        </div>
      )}
    </li>
  );
};

export default PhoneSettingsContainer;
