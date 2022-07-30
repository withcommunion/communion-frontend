import BackToButton from '@/shared_components/backToButton/BackToButton';
import BasicModal from '@/shared_components/basicModal';
import AssetAmountInput from '@/pages_components/org/[orgId]/send/sendTokensModal/assetInputs/assetAmountInput';
import { ICommunityMembers } from '@/pages_components/org/[orgId]/send/sendMemberList/orgMemberCard';
import SelectedOrgMemberCard from './selectedOrgMemberCard/selectedOrgMemberCard';

interface Props {
  onToggleModal: () => void;
  usersInOrg: ICommunityMembers[];
}
const SendTokenTipsModal = ({ onToggleModal, usersInOrg }: Props) => {
  return (
    <div className="absolute top-0 left-0 mx-auto w-full z-50 bg-secondaryLightGray pb-80">
      <div className="container w-full  px-6 pb-1 mx-auto bg-secondaryLightGray">
        <BackToButton backToDestinationText={'List'} onClick={onToggleModal} />

        <BasicModal
          title={'Send Token Tips to:'}
          toggleModal={onToggleModal}
          onPrimaryActionButtonClick={() => {
            console.log('Continue Clicked');
          }}
          primaryActionButtonText={'Next'}
        >
          <ul>
            {usersInOrg.map(
              (user) =>
                user.isChecked && <SelectedOrgMemberCard userInOrg={user} />
            )}
          </ul>
          {/* <AssetSelectorInput /> */}
          <AssetAmountInput />
        </BasicModal>
      </div>
    </div>
  );
};

export default SendTokenTipsModal;
