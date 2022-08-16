import Image from 'next/image';

const SendPageMemberSearch = () => {
  return (
    <div className="flex">
      <input
        className="w-full border-0 bg-secondaryLightGray focus:outline-0"
        placeholder="List of community members:"
      />
      <button className="flex items-center justify-center">
        <Image
          src="/images/send/search.svg"
          width="22px"
          height="22px"
          alt="SearchIcon"
        />
      </button>
    </div>
  );
};

export default SendPageMemberSearch;
