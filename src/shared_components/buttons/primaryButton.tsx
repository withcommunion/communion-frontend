import cx from 'classnames';

interface Props {
  onClick: () => void;
  text: string;
  size: 'tiny' | 'small' | 'middle' | 'big';
  disabled?: boolean;
  loading?: boolean;
}

const PrimaryButton = ({ text, onClick, size, disabled, loading }: Props) => {
  return (
    <button
      disabled={disabled}
      className={cx(
        { 'w-100px bg-primaryOrange': size === 'tiny' },
        { 'w-155px': size === 'small' },
        { 'w-275px': size === 'middle' },
        { 'w-295px': size === 'big' },
        { 'cursor-progress': loading },
        { 'bg-gray-200 text-black': disabled },
        {
          'bg-secondaryOrange text-white shadow-primaryButtonShadow': !disabled,
        },
        'mx-7.5px h-46px  rounded-28px'
      )}
      onClick={() => onClick()}
    >
      {text} {loading && <span className="cursor-progress">♻️</span>}
    </button>
  );
};

export default PrimaryButton;
