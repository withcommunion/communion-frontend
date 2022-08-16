import Image from 'next/image';

const Welcome = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative flex flex-col items-center justify-center pt-3">
        <Image
          src="/images/orgLogos/jacksPizzaLogo.png"
          alt="jacks pizza logo"
          width="84px"
          height="84px"
        />
        <span className="z-10 font-paytoneOne text-6xl text-fifthOrange">
          Welcome
        </span>
        <span className="z-10 mb-8 pt-3 text-xl font-semibold text-primaryGray">
          Please sign in or create an account
        </span>

        <div className="absolute -right-10 top-9">
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
