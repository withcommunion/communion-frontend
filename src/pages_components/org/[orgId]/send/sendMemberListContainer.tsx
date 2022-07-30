import { useState } from 'react';

import OrgMemberCard from './sendMemberList/orgMemberCard';
import ButtonsWrapper from '@/pages_components/org/[orgId]/send/buttonsWrapper/ButtonsWrapper';
import SendTokenTipsModal from '@/pages_components/org/[orgId]/send/sendTokensModal/sendTokensModal';

const MemberListContainer = () => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const [members, setMembers] = useState([
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

  const onCancelButton = () => {
    setMembers(
      members.map((member) => {
        return { ...member, isChecked: false };
      })
    );
  };

  const isMemberSelected = members.some((item) => item.isChecked === true);
  return (
    <>
      <div className={`${isMemberSelected ? 'pb-20' : ''}`}>
        <ul className="my-4">
          {members.map((communityMember, num: number) => (
            <OrgMemberCard
              key={num}
              communityMember={communityMember}
              setIsChecked={setIsChecked}
            />
          ))}
        </ul>
      </div>
      {isMemberSelected && (
        <ButtonsWrapper
          onCancelButton={onCancelButton}
          onHideSendModal={() => setShowModal(!showModal)}
        />
      )}
      {/* TODO: Move to page container */}
      {showModal && (
        <SendTokenTipsModal
          onToggleModal={() => setShowModal(!showModal)}
          usersInOrg={members}
        />
      )}
    </>
  );
};

export default MemberListContainer;
