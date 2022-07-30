import cx from 'classnames';

interface Props {
  onClick: () => void;
  text: string;
  size: 'small' | 'big';
}

const PrimaryButton = ({ text, onClick, size }: Props) => {
  return (
    <button
      className={cx(
        { 'w-155px': size === 'small' },
        { 'w-295px': size === 'big' },
        'rounded-28px h-46px bg-secondaryOrange text-white  shadow-primaryButtonShadow mx-7.5px'
      )}
      onClick={() => onClick()}
    >
      {text}
    </button>
  );
};

export default PrimaryButton;
