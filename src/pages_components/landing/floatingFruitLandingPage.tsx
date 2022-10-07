import styles from '../../styles/index.module.css';
import Image from 'next/image';
import Link from 'next/link';

const FloatingFruitLandingPage = () => {
  return (
    <div className={styles.app}>
      <div className={styles.loginLink}>
        <Link href="/login">Log in</Link>
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
        <button
          className={styles.mainButton}
          onClick={() => {
            return true;
          }}
        >
          Get Invite!
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
