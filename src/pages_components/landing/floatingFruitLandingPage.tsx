import { FC, useEffect, useState } from 'react';
import styles from '../../styles/Index.module.css';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  onPassword: (password: string) => void;
  viewPresentation: boolean;
};

const FloatingFruitLandingPage: FC<Props> = ({
  onPassword,
  viewPresentation,
}) => {
  const [password, setPassword] = useState<string>('');
  const [inputStyle, setInputStyle] = useState<{ outline: string } | {}>({});

  useEffect(() => {
    setInputStyle({});
  }, [password]);

  return (
    <div className={styles.app}>
      <div className={styles.loginLink}>
        <Link href="#">Log in</Link>
      </div>
      <div className={styles.content}>
        <div className={styles.logo}>
          <Image
            src={'/images/landing/Logo.svg'}
            layout="fill"
            objectFit="contain"
            alt="Communion Logo"
          />
        </div>
        <p className={styles.description}>
          Modernizing worker training/development for blue-collar businesses
        </p>
        <input
          className={styles.passwordInput}
          type="password"
          value={password}
          style={inputStyle}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button
          className={styles.mainButton}
          onClick={() => {
            if (!viewPresentation && password.length > 0) {
              setInputStyle({ outline: 'red solid' });
            }
            onPassword(password);
          }}
        >
          Enter
        </button>
      </div>
      <div className={styles.burger}>
        <Image
          src={'/images/landing/Burger.png'}
          layout="fill"
          objectFit="contain"
          alt="burger"
        />
      </div>
      <div className={styles.prize}>
        <Image
          src={'/images/landing/Prize.png'}
          layout="fill"
          objectFit="contain"
          alt="prize"
        />
      </div>
      <div className={styles.pizza}>
        <Image
          src={'/images/landing/Pizza.png'}
          layout="fill"
          objectFit="contain"
          alt="pizza"
        />
      </div>
      <div className={styles.hotDog}>
        <Image
          src={'/images/landing/HotDog.png'}
          layout="fill"
          objectFit="contain"
          alt="hot dog"
        />
      </div>
      <div className={styles.donut}>
        <Image
          src={'/images/landing/Donut.png'}
          layout="fill"
          objectFit="contain"
          alt="Donut"
        />
      </div>
      <div className={styles.hotDogBlur}>
        <Image
          src={'/images/landing/HotDog.png'}
          layout="fill"
          objectFit="contain"
          alt="hot dog blur"
        />
      </div>
    </div>
  );
};

export default FloatingFruitLandingPage;
