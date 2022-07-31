import cx from 'classnames';

interface Props {
  onClick: () => void;
  text: string;
  size: 'small' | 'big';
  disabled: boolean;
  loading: boolean;
}

const PrimaryButton = ({ text, onClick, size, disabled, loading }: Props) => {
  return (
    <button
      disabled={disabled}
      className={cx(
        { 'w-155px': size === 'small' },
        { 'w-295px': size === 'big' },
        { 'cursor-progress': loading },
        { 'bg-gray-200 text-black': disabled },
        {
          'bg-secondaryOrange text-white shadow-primaryButtonShadow': !disabled,
        },
        'rounded-28px h-46px  mx-7.5px'
      )}
      onClick={() => onClick()}
    >
      {text} {loading && <span className="cursor-progress">♻️</span>}
    </button>
  );
};

export default PrimaryButton;
