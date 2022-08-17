import { Authenticator } from '@aws-amplify/ui-react';

const formFields = {
  signUp: {
    email: {
      order: 3,
      isRequired: true,
    },
    phone_number: {
      order: 4,
      isRequired: false,
    },
    given_name: {
      order: 5,
      isRequired: true,
      placeholder: 'First Name',
    },
    family_name: {
      order: 6,
      isRequired: true,
      placeholder: 'Last Name',
    },
    password: {
      order: 7,
      isRequired: true,
    },
    confirm_password: {
      order: 8,
      isRequired: true,
    },
  },
};

const AuthComponent = () => {
  return (
    <Authenticator
      className="mt-5"
      initialState="signIn"
      signUpAttributes={['email', 'given_name', 'family_name', 'phone_number']}
      formFields={formFields}
      loginMechanisms={['email']}
      components={{
        SignUp: {
          FormFields() {
            return (
              <>
                {/* Re-use default `Authenticator.SignUp.FormFields` */}
                <Authenticator.SignUp.FormFields />
              </>
            );
          },
        },
      }}
    />
  );
};

export default AuthComponent;
