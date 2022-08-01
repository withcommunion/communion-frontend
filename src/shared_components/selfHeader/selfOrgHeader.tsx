import Greeting from '@/shared_components/selfHeader/greeting/Greeting';
import TokenBalance from '@/shared_components/selfHeader/tokenBalance/TokenBalance';
import Image from 'next/image';

interface Props {
  tokenAmount?: number | string | null;
  tokenSymbol?: string;
  name?: string;
  orgId?: string;
}

const SelfOrgHeader = ({ tokenAmount, tokenSymbol, name, orgId }: Props) => {
  return (
    <>
      <div className="relative">
        <Greeting name={name} />
        {orgId === 'jacks-pizza-pittsfield' && (
          <div className="absolute right-0 top-0">
            <Image
              src="/images/orgLogos/jacksPizzaLogo.png"
              height="100px"
              width="100px"
              alt="jacks pizza logo"
            />
          </div>
        )}
      </div>
      <TokenBalance tokenAmount={tokenAmount} tokenSymbol={tokenSymbol} />
    </>
  );
};

export default SelfOrgHeader;
