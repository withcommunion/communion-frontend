import SecondaryButton from '@/shared_components/buttons/secondaryButton';
import PrimarySmallButton from '@/shared_components/buttons/primaryButton';

interface Props {
  onCancelClick: () => void;
  onPrimaryClick: () => void;
}
const BottomStickyButtonContainer = ({
  onCancelClick,
  onPrimaryClick,
}: Props) => {
  return (
    <div className="fixed left-0 bottom-14 z-30 w-full">
      <div className="flex items-center justify-center bg-white p-5">
        <SecondaryButton onClick={onCancelClick} text={'Cancel'} size="small" />
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
