import Image from 'next/image';

const Welcome = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative pt-3 flex items-center justify-center flex-col">
        <Image
          src="/images/orgLogos/jacksPizzaLogo.png"
          alt="jacks pizza logo"
          width="84px"
          height="84px"
        />
        <span className="font-paytoneOne text-fifthOrange text-6xl z-10">
          Welcome
        </span>
        <span className="text-primaryGray font-semibold text-xl pt-3 z-10">
          Create an account
        </span>
        <span className="font-light text-13px text-fifthGray z-10">
          Sign up with your name, email and (optional)
        </span>
        <span className="font-light text-13px text-fifthGray z-10">
          username/Alias
        </span>
        <div className="absolute -right-16 top-9">
          <Image
            src="/images/signUp/firstBackDecoration.svg"
            alt="background decoration image"
            width="149px"
            height="199px"
          />
        </div>
      </div>
    </div>
  );
};

export default Welcome;
