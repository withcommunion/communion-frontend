import Image from 'next/image';
import { FC } from 'react';
import { ICommunityMembers } from '@/pages_components/org/[orgId]/send/communityMembers/OrgMemberCardList';

const MemberSend: FC<{ communityMember: ICommunityMembers }> = ({
  communityMember,
}) => {
  const { avatar, name } = communityMember;

  return (
    <li className="flex items-center justify-between my-6">
      <div className="flex items-center">
        <Image src={avatar} width="30px" height="30px" />
        <span className="text-primaryGray text-5 font-semibold pl-2">
          {name}
        </span>
      </div>
      <Image src="/images/delete.svg" width="16px" height="18px" />
    </li>
  );
};

export default MemberSend;
