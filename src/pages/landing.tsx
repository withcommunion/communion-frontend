import { FC, useState } from 'react';

import Presentation from '@/pages_components/landing/Presentation';
import FloatingFruitLandingPage from '@/pages_components/landing/floatingFruitLandingPage';

import s from '@/styles/Index.module.css';

const LandingPage: FC = () => {
  const [viewPresentation, setViewPresentation] = useState<boolean>(false);
  const PASSWORD = 'bettertogether';

  const onPassword = (password: string): void => {
    password === PASSWORD
      ? setViewPresentation(true)
      : setViewPresentation(false);
  };

  return (
    <div className={s.app}>
      {!viewPresentation ? (
        <FloatingFruitLandingPage
          onPassword={(password) => onPassword(password)}
          viewPresentation={viewPresentation}
        />
      ) : null}
      {viewPresentation ? <Presentation /> : null}
    </div>
  );
};

export default LandingPage;
