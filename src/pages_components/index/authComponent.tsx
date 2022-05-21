import { Authenticator } from '@aws-amplify/ui-react';
import { SelectField } from '@aws-amplify/ui-react';

const formFields = {
  signUp: {
    email: {
      order: 2,
      isRequired: true,
    },
    family_name: {
      order: 3,
      isRequired: true,
    },
    given_name: {
      order: 4,
      isRequired: true,
    },
    password: {
      order: 5,
      isRequired: true,
    },
    confirm_password: {
      order: 6,
      isRequired: true,
    },
  },
};

export const AuthComponent = () => {
  return (
    <Authenticator
      className="mt-5"
      initialState="signIn"
      signUpAttributes={['email', 'given_name', 'family_name']}
      formFields={formFields}
      loginMechanisms={['email']}
      components={{
        SignUp: {
          FormFields() {
            return (
              <>
                {/* Re-use default `Authenticator.SignUp.FormFields` */}
                <SelectField
                  label="Organization"
                  labelHidden={true}
                  id="organization"
                  name="custom:organization"
                  defaultValue="org-jacks-pizza-1"
                >
                  <option value="org-jacks-pizza-1">Jacks Pizza</option>
                </SelectField>
                <Authenticator.SignUp.FormFields />
              </>
            );
          },
        },
      }}
    />
  );
};
