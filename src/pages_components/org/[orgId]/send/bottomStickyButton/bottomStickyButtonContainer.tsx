import CancelButton from './cancelButton/cancelButton';
import PrimarySmallButton from '@/shared_components/primaryButton/primaryButton';

interface Props {
  onCancelClick: () => void;
  onPrimaryClick: () => void;
}
const BottomStickyButtonContainer = ({
  onCancelClick,
  onPrimaryClick,
}: Props) => {
  return (
    <div className="fixed w-full left-0 bottom-14 ">
      <div className="flex justify-center items-center bg-white p-5">
        <CancelButton onClick={onCancelClick} />
        <PrimarySmallButton
          size="small"
          text="Continue"
          onClick={() => {
            onPrimaryClick();
          }}
        />
      </div>
    </div>
  );
};

export default BottomStickyButtonContainer;
