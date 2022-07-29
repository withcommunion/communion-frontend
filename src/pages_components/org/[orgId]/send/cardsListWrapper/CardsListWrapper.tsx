import { useState } from 'react';
import OrgMemberCardList, {
  ICommunityMembers,
} from '@/pages_components/org/[orgId]/send/communityMembers/OrgMemberCardList';
import ButtonsWrapper from '@/pages_components/org/[orgId]/send/buttonsWrapper/ButtonsWrapper';
import SendTokenTipsModal from '@/shared_components/sendTokensModal/sendTokenTipsModal/SendTokenTipsModal';

const CardsListWrapper = () => {
  const [sendModalHide, setSendModalHide] = useState<boolean>(true);

  const [members, setMembers] = useState<ICommunityMembers[]>([
    {
      id: 1,
      avatar: '/images/send/avatar.svg',
      name: 'Abby Arman',
      isChecked: false,
    },
    {
      id: 2,
      avatar: '/images/send/avatar.svg',
      name: 'Margarita Stepankova',
      isChecked: false,
    },
    {
      id: 3,
      avatar: '/images/send/avatar.svg',
      name: 'Abby Arman',
      isChecked: false,
    },
    {
      id: 4,
      avatar: '/images/send/avatar.svg',
      name: 'Margarita Stepankova',
      isChecked: false,
    },
    {
      id: 5,
      avatar: '/images/send/avatar.svg',
      name: 'Margarita Stepankova',
      isChecked: false,
    },
    {
      id: 6,
      avatar: '/images/send/avatar.svg',
      name: 'Margarita Stepankova',
      isChecked: false,
    },
    {
      id: 7,
      avatar: '/images/send/avatar.svg',
      name: 'Margarita Stepankova',
      isChecked: false,
    },
    {
      id: 8,
      avatar: '/images/send/avatar.svg',
      name: 'Margarita Stepankova',
      isChecked: false,
    },
    {
      id: 9,
      avatar: '/images/send/avatar.svg',
      name: 'Margarita Stepankova',
      isChecked: false,
    },
    {
      id: 10,
      avatar: '/images/send/avatar.svg',
      name: 'Margarita Stepankova',
      isChecked: false,
    },
  ]);

  const setIsChecked = (id: number, isChecked: boolean) => {
    setMembers(
      members.map((member) =>
        member.id === id ? { ...member, isChecked: isChecked } : member
      )
    );
  };

  const onHideSendModal = () => {
    setSendModalHide(!sendModalHide);
  };

  const onCancelButton = () => {
    setMembers(
      members.map((member) => {
        return { ...member, isChecked: false };
      })
    );
  };

  return (
    <>
      <div
        className={`${
          members.some((item) => item.isChecked === true) ? 'pb-20' : ''
        }`}
      >
        <OrgMemberCardList
          communityMembers={members}
          setIsChecked={setIsChecked}
        />
      </div>
      {members.some((item) => item.isChecked === true) && (
        <ButtonsWrapper
          onCancelButton={onCancelButton}
          onHideSendModal={onHideSendModal}
        />
      )}
      {sendModalHide ? (
        <></>
      ) : (
        <SendTokenTipsModal
          onHideSendModal={onHideSendModal}
          communityMembers={members}
        />
      )}
    </>
  );
};

export default CardsListWrapper;
