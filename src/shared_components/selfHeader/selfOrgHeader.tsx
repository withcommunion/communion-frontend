import Greeting from '@/shared_components/selfHeader/greeting/Greeting';
import TokenBalance from '@/shared_components/selfHeader/tokenBalance/TokenBalance';

interface Props {
  tokenAmount?: number | string | null;
  tokenSymbol?: string;
  name?: string;
}

const SelfOrgHeader = ({ tokenAmount, tokenSymbol, name }: Props) => {
  return (
    <>
      <Greeting name={name} />
      <TokenBalance tokenAmount={tokenAmount} tokenSymbol={tokenSymbol} />
    </>
  );
};

export default SelfOrgHeader;
