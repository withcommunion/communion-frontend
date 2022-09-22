import Image from 'next/image';
import PrimaryButton from '@/shared_components/buttons/primaryButton';
import { CommunionNft } from '@/util/walletApiUtil';

interface Props {
  selectedItem: CommunionNft;
  onSendClick: () => void;
}

const SelectedNftComponent = ({ selectedItem, onSendClick }: Props) => {
  const nftAttributes = selectedItem.erc721Meta.properties.attributes;
  const characteristics = nftAttributes.filter(
    (attribute) => attribute.trait_type === 'characteristic'
  );

  const modifiers = nftAttributes.filter(
    (attribute) => attribute.trait_type === 'modifier'
  );
  return (
    <div className="mx-auto w-full md:w-full lg:w-70% xl:w-60% 2xl:w-50%">
      <div className="mb-14px rounded-xl border-4 border-twelfthLightGray bg-white sm:h-full sm:w-full">
        <div className="relative mb-5 h-255px w-full ">
          <Image
            src={selectedItem.erc721Meta.properties.image}
            alt="nft image"
            width="100%"
            height="100%"
            layout="fill"
            objectFit="fill"
          />
          <div className="absolute -bottom-4 right-2 flex w-full justify-end">
            {modifiers.map((attributes, num) => (
              <div
                key={num}
                className="mx-1 flex flex-col items-center justify-center
                              rounded
                              border-2 border-seventhBeige bg-eighthOrange py-1.5 px-2 text-10px font-semibold uppercase text-white"
              >
                <span className="text-center">{attributes.value}</span>
                <span className="text-center">{attributes.trait_type}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="text-primaryGray">
          <h2 className="mb-2 px-7 text-lg font-semibold uppercase">
            {selectedItem.erc721Meta.properties.name}
          </h2>
          <p className="break-words px-7 text-sm">
            {selectedItem.erc721Meta.properties.description}
          </p>
          <div className="px-7">
            <h3 className="mt-2 font-medium">Characteristics</h3>
            <ul className="ml-4 list-disc">
              {characteristics.map((characteristic) => (
                <li
                  className="my-1 break-words text-sm"
                  key={characteristic.value}
                >
                  {characteristic.value}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-3 mb-4 flex justify-center">
            <PrimaryButton
              text={'Send'}
              onClick={() => {
                onSendClick();
              }}
              size={'middle'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedNftComponent;
