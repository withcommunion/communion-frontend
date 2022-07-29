import BackToButton from '@/shared_components/backToButton/BackToButton';
import { FC } from 'react';
import SendTokensModal from '@/shared_components/sendTokensModal/SendTokensModal';
import MemberSendList from '@/shared_components/sendTokensModal/sendTokenTipsModal/membersSend/MemberSendList';
import AssetSelectorInput from '@/shared_components/sendTokensModal/sendTokenTipsModal/assetInputs/AssetSelectorInput';
import AssetAmountInput from '@/shared_components/sendTokensModal/sendTokenTipsModal/assetInputs/AssetAmountInput';
import { ICommunityMembers } from '@/pages_components/org/[orgId]/send/communityMembers/OrgMemberCardList';

const SendTokenTipsModal: FC<{
  onHideSendModal: () => void;
  communityMembers: ICommunityMembers[];
}> = ({ onHideSendModal, communityMembers }) => {
  return (
    <div className="absolute top-0 left-0 mx-auto w-full z-50 bg-secondaryLightGray pb-80">
      <div className="container w-full  px-6 pb-1 mx-auto bg-secondaryLightGray">
        <BackToButton text={'List'} functionButton={onHideSendModal} />
        <SendTokensModal
          title={'Send Token Tips to:'}
          functionExit={onHideSendModal}
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
