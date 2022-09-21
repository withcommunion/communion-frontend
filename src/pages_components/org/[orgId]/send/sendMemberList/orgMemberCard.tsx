import { User } from '@/util/walletApiUtil';
import Image from 'next/image';
import NftTrophyDisplay from '@/shared_components/nftTrophyDisplay/nftTrophyDisplay';
import { isNftFeatureEnabled } from '@/util/envUtil';

interface Props {
  userInOrg: User;
  toggleChecked: () => void;
  isChecked: boolean;
}

const OrgMemberCard = ({ userInOrg, toggleChecked, isChecked }: Props) => {
  const { first_name, last_name, owned_nfts } = userInOrg;

  return (
    <li
      className={
        isChecked
          ? 'my-1 flex h-16 items-center justify-between gap-4 rounded border-4 border-primaryBeige bg-white'
          : 'my-1 flex h-16 items-center justify-between gap-4 rounded bg-white'
      }
      onClick={toggleChecked}
    >
      <div className="flex items-center">
        <span
          className={
            isChecked
              ? 'ml-1.5 mr-2.5 flex items-center'
              : 'mx-2.5 flex items-center'
          }
        >
          <Image
            src={'/images/send/avatar.svg'}
            width="30px"
            height="30px"
            alt="user avatar"
          />
        </span>
        <span className="ml-1 text-15px text-primaryGray">
          {first_name} {last_name}
        </span>
      </div>
      <div className="flex items-center">
        {isNftFeatureEnabled && (
          <div className="w-98px">
            <NftTrophyDisplay nftDetails={owned_nfts} showcaseNft={null} />
          </div>
        )}
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => undefined}
          className={`${isChecked ? 'mr-4 ml-5' : 'mx-5'} relative
          inline-flex
          h-4
          w-4
          cursor-pointer
          appearance-none items-center
          justify-center
          rounded
          border-1px border-secondaryPurple bg-secondaryLightGray text-center transition-all
          after:absolute
          after:h-2.5
          after:w-1.5
          checked:bg-secondaryLightGray
          checked:after:rotate-45
          checked:after:rounded-md
          checked:after:border-b-[3px] checked:after:border-r-[3px]
          checked:after:border-primaryPurple`}
        />
      </div>
    </li>
  );
};

export default OrgMemberCard;
