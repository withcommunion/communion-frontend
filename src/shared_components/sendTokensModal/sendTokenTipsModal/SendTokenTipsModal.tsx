import BackToButton from '@/shared_components/backToButton/BackToButton';
import SendTokensModal from '@/shared_components/sendTokensModal/SendTokensModal';
import MemberSendList from '@/shared_components/sendTokensModal/sendTokenTipsModal/membersSend/MemberSendList';
import AssetSelectorInput from '@/shared_components/sendTokensModal/sendTokenTipsModal/assetInputs/AssetSelectorInput';
import AssetAmountInput from '@/shared_components/sendTokensModal/sendTokenTipsModal/assetInputs/AssetAmountInput';
import { ICommunityMembers } from '@/pages_components/org/[orgId]/send/sendMemberList/OrgMemberCard';

interface Props {
  onToggleModal: () => void;
  communityMembers: ICommunityMembers[];
}
const SendTokenTipsModal = ({ onToggleModal, communityMembers }: Props) => {
  return (
    <div className="absolute top-0 left-0 mx-auto w-full z-50 bg-secondaryLightGray pb-80">
      <div className="container w-full  px-6 pb-1 mx-auto bg-secondaryLightGray">
        <BackToButton text={'List'} onClick={onToggleModal} />
        <SendTokensModal
          title={'Send Token Tips to:'}
          functionExit={onToggleModal}
          functionContinue={() => {
            console.log('Test');
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
