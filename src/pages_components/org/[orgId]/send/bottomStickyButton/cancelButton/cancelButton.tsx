import { memo } from 'react';

interface Props {
  onClick: () => void;
}

const CancelButton = ({ onClick }: Props) => (
  <button
    className="rounded-28px h-46px bg-white text-primaryGray border-2 border-secondaryBeige mx-7.5px w-155px"
    onClick={() => onClick()}
  >
    Cancel
  </button>
);

export default memo(CancelButton);
