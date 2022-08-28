import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
interface Props {
  phoneNumber: string;
  onChange: (phoneNumber: string) => void;
}

const UpdatePhoneNumberInput = ({ phoneNumber, onChange }: Props) => {
  return (
    <div className="flex w-full flex-col text-start">
      <label>
        <span className="">Update Phone Number</span>
      </label>
      <PhoneInput
        className="w-full border-1px border-thirdLightGray bg-white py-2 pl-5 pr-4 text-primaryPurple focus:outline-0"
        placeholder="Enter phone number"
        defaultCountry="US"
        value={phoneNumber}
        onChange={(event) => {
          onChange(event as string);
        }}
        error={
          phoneNumber
            ? isValidPhoneNumber(phoneNumber)
              ? undefined
              : 'Invalid phone number'
            : 'Phone number required'
        }
      />
      <div className="flex flex-row">
        {phoneNumber && !isValidPhoneNumber(phoneNumber) && (
          <span className="ml-2">Please enter a valid phone number</span>
        )}
      </div>
    </div>
  );
};

export default UpdatePhoneNumberInput;
