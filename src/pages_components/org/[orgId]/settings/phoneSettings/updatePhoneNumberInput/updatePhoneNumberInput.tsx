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
      <input
        className="w-full border-1px border-thirdLightGray bg-white py-2 pl-5 pr-4 text-primaryPurple focus:outline-0"
        onChange={(event) => {
          onChange(event.target.value);
        }}
        value={phoneNumber}
      />
      <div className="flex flex-row"></div>
    </div>
  );
};

export default UpdatePhoneNumberInput;
