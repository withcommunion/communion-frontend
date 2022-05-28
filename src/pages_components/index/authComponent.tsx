import { Authenticator } from '@aws-amplify/ui-react';
import { SelectField } from '@aws-amplify/ui-react';

const formFields = {
  signUp: {
    email: {
      order: 3,
      isRequired: true,
    },
    given_name: {
      order: 4,
      isRequired: true,
      placeholder: 'First Name',
    },
    family_name: {
      order: 5,
      isRequired: true,
      placeholder: 'Last Name',
    },
    password: {
      order: 6,
      isRequired: true,
    },
    confirm_password: {
      order: 7,
      isRequired: true,
    },
  },
};

const AuthComponent = () => {
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

                <SelectField
                  label="Role"
                  labelHidden={true}
                  id="role"
                  name="custom:role"
                  defaultValue="worker"
                >
                  <option value="worker">Worker</option>
                  <option value="manager">Manager</option>
                  <option value="owner">Owner</option>
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

export default AuthComponent;
