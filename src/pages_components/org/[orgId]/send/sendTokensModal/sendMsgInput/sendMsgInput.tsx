import cx from 'classnames';
import { useAppSelector } from '@/reduxHooks';
import { selectIsManagerModeActive } from '@/features/organization/organizationSlice';

interface Props {
  isCompact?: boolean;
  isToAll?: boolean;
  msg?: string;
  onChange: (value: string) => void;
}
const SendMsgInput = ({ msg, onChange, isToAll }: Props) => {
  const isManagerModeActive = useAppSelector((state) =>
    selectIsManagerModeActive(state)
  );
  return (
    <div
      className={cx(
        'my-15px rounded-4px  bg-secondaryLightGray p-15px',
        { 'border-1px border-thirdLightGray': !isManagerModeActive },
        { 'border-1px border-primaryOrange': isManagerModeActive }
      )}
    >
      <div className="flex items-center justify-between pb-15px">
        <span className="text-15px text-primaryGray ">
          {isToAll ? 'Message to all' : 'Message'}
        </span>
        <span className="text-sm text-secondaryGray">
          Chars: {160 - (msg || '').length}
        </span>
      </div>
      <div className="flex items-center justify-between border-1px border-thirdLightGray">
        <input
          className="w-full border-1px border-thirdLightGray bg-white py-2 pl-5 pr-4 text-primaryPurple"
          type="text"
          maxLength={160}
          onFocus={() => {
            if (msg === undefined) {
              onChange('');
            }
          }}
          onChange={(event) => {
            onChange(event.target.value);
          }}
          value={msg}
        />
      </div>
    </div>
  );
};

export default SendMsgInput;
