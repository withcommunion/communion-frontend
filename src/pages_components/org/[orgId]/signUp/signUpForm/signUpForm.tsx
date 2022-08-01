import { useState } from 'react';
import PrimaryMiddleButton from '@/shared_components/buttons/primaryButton';
import Image from 'next/image';

const SignUpForm = () => {
  const [passwordHide, setPasswordHide] = useState<boolean>(false);

  return (
    <div className="flex items-center justify-center">
      <form
        onSubmit={() => {
          console.log('form');
        }}
        className="flex flex-col justify-center items-center relative"
      >
        <div className="flex flex-col border-b-1px border-fourthLightGray mt-7 w-275px">
          <label className="pb-2 text-15px text-primaryPurple">
            First name:
            <input type="text" name="firstName" />
          </label>
        </div>
        <div className="flex flex-col border-b-1px border-fourthLightGray mt-7 w-275px">
          <label className="pb-2 text-15px text-primaryPurple">
            Last name:
            <input type="text" name="lastName" />
          </label>
        </div>
        <div className="flex flex-col border-b-1px border-fourthLightGray mt-7 w-275px">
          <label className="pb-2 text-15px text-primaryPurple">
            Username:
            <input type="text" name="username" />
          </label>
        </div>
        <div className="flex flex-col border-b-1px border-fourthLightGray mt-7 w-275px">
          <label className="pb-2 text-15px text-primaryPurple">
            Email:
            <input type="email" name="email" />
          </label>
        </div>
        <div className="flex flex-col border-b-1px border-fourthLightGray z-10 mt-7 w-275px">
          <label className="pb-2 text-15px text-primaryPurple">
            Password:
            <input type={passwordHide ? 'password' : 'text'} name="password" />
            <button
              onClick={() => {
                setPasswordHide(!passwordHide);
              }}
            >
              <Image
                src={
                  passwordHide
                    ? '/images/signUp/eye-close.svg'
                    : '/images/signUp/eye-open.svg'
                }
                width="23px"
                height="20px"
                alt="hidden password"
              />
            </button>
          </label>
        </div>
        <div className="mb-10 mt-11 z-10">
          <PrimaryMiddleButton
            onClick={() => {
              console.log('req');
            }}
            text={'Sign Up'}
            size="middle"
          />
        </div>
        <div className="absolute -bottom-2 -left-8">
          <Image
            src="/images/signUp/secondBackDecoration.svg"
            alt="background decoration image"
            width="102px"
            height="132px"
          />
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
