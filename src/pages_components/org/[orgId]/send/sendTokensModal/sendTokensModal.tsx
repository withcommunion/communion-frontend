import BackToButton from '@/shared_components/backToButton/BackToButton';
import SendTokensModal from '@/shared_components/basicModal';
import AssetSelectorInput from '@/pages_components/org/[orgId]/send/sendTokensModal/assetInputs/AssetSelectorInput';
import AssetAmountInput from '@/pages_components/org/[orgId]/send/sendTokensModal/assetInputs/AssetAmountInput';
import { ICommunityMembers } from '@/pages_components/org/[orgId]/send/sendMemberList/orgMemberCard';
import MemberSendList from './membersSend/memberSendList';

interface Props {
  onToggleModal: () => void;
  communityMembers: ICommunityMembers[];
}
const SendTokenTipsModal = ({ onToggleModal, communityMembers }: Props) => {
  return (
    <div className="absolute top-0 left-0 mx-auto w-full z-50 bg-secondaryLightGray pb-80">
      <div className="container w-full  px-6 pb-1 mx-auto bg-secondaryLightGray">
        <BackToButton backToDestinationText={'List'} onClick={onToggleModal} />

        <SendTokensModal
          title={'Send Token Tips to:'}
          onModalClose={onToggleModal}
          onContinueClick={() => {
            console.log('Continue Clicked');
          }}
          buttonText={'Next'}
        >
          <MemberSendList communityMembers={communityMembers} />
          <AssetSelectorInput />
          <AssetAmountInput />
        </SendTokensModal>
      </div>
    </div>
  );
};

export default SendTokenTipsModal;
