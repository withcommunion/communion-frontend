import Greeting from '@/shared_components/selfHeader/greeting/Greeting';
import TokenBalance from '@/shared_components/selfHeader/tokenBalance/TokenBalance';
import { FC } from 'react';

interface Props {
  tokenAmount: number;
  tokenSymbol: string;
  name: string;
}

const SelfHeaderOrg: FC<{ selfHeader: Props[] }> = ({ selfHeader }) => {
  return (
    <>
      <Greeting selfHeader={selfHeader} />
      <TokenBalance selfHeader={selfHeader} />
    </>
  );
};

export default SelfHeaderOrg;
