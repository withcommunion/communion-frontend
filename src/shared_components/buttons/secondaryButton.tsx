import { memo } from 'react';
import cx from 'classnames';

interface Props {
  text: string;
  size: 'small' | 'big';
  onClick: () => void;
}

const SecondaryButton = ({ onClick, text, size }: Props) => (
  <button
    className={cx(
      { 'w-155px': size === 'small' },
      { 'w-295px': size === 'big' },
      'rounded-28px h-46px bg-white text-primaryGray border-2 border-primaryBeige mx-7.5px'
    )}
    onClick={() => onClick()}
  >
    {text}
  </button>
);

export default memo(SecondaryButton);
