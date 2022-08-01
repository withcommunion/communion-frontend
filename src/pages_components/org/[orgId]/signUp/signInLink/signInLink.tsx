import Link from 'next/link';

const SignInLink = () => {
  return (
    <div className="flex items-center justify-center">
      <span className="text-14px pr-2 text-sixthGray">
        Already have an account
      </span>
      <Link href="#">
        <a className="font-semibold text-4 text-secondaryOrange">Sign In</a>
      </Link>
    </div>
  );
};

export default SignInLink;
