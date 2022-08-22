import { memo } from 'react';
import cx from 'classnames';

interface Props {
  text: string;
  size: 'small' | 'big';
  disabled?: boolean;
  onClick: () => void;
}

const SecondaryButton = ({ onClick, text, size, disabled }: Props) => (
  <button
    disabled={disabled}
    className={cx(
      { 'w-155px': size === 'small' },
      { 'w-295px': size === 'big' },
      'mx-7.5px h-46px rounded-28px border-2 border-primaryBeige bg-white text-primaryGray'
    )}
    onClick={() => onClick()}
  >
    {text}
  </button>
);

export default memo(SecondaryButton);
