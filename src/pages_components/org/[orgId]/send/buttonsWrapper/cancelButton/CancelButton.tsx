import { FC, memo } from 'react';

const CancelButton: FC<{ onCancelButton: () => void }> = ({
  onCancelButton,
}) => {
  return (
    <button
      className="rounded-28px h-46px bg-white text-primaryGray border-2 border-secondaryBeige mx-7.5px w-155px"
      onClick={() => onCancelButton()}
    >
      Cancel
    </button>
  );
};

export default memo(CancelButton);
