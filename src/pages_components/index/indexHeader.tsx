interface Props {
  userName?: string;
}
const IndexHeader = ({ userName }: Props) => {
  return (
    <>
      <h1 className="text-2xl">
        {userName && `👋 Hey ${userName}`}
        {!userName && '👋 Hey friend'}
      </h1>
      <h1 className="text-3xl">Welcome to Communion</h1>
      <h1 className="text-2xl">Good stuff coming soon!</h1>
    </>
  );
};

export default IndexHeader;