import styles from '../../styles/index.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

const FloatingFruitLandingPage = () => {
  const router = useRouter();
  return (
    <div className={styles.app}>
      <Link href={{ pathname: '/login', query: router.query }}>
        <a className={styles.loginLink}>Log in</a>
      </Link>
      <div className={styles.content}>
        <div className={styles.logo}>
          <Image
            src={'/images/landing/Logo.svg'}
            priority
            layout="fill"
            objectFit="contain"
            alt="Communion Logo"
          />
        </div>
        <p className={styles.description}>
          Be a part of an owner, operator and worker-owned staffing network for
          businesses like yours.
        </p>
        <p>Solve understaffing together as a community.</p>
        <a
          className={styles.mainButton}
          href="https://ieo7xyuo672.typeform.com/to/dZ9eGcAH"
          target="_blank"
          rel="noreferrer"
        >
          Get Invite
        </a>
      </div>
      <div className={styles.burger}>
        <Image
          src={'/images/landing/Burger.png'}
          layout="fill"
          priority
          objectFit="contain"
          alt="burger"
        />
      </div>
      <div className={styles.prize}>
        <Image
          src={'/images/landing/Prize.png'}
          layout="fill"
          priority
          objectFit="contain"
          alt="prize"
        />
      </div>
      <div className={styles.pizza}>
        <Image
          src={'/images/landing/Pizza.png'}
          layout="fill"
          priority
          objectFit="contain"
          alt="pizza"
        />
      </div>
      <div className={styles.hotDog}>
        <Image
          src={'/images/landing/HotDog.png'}
          layout="fill"
          priority
          objectFit="contain"
          alt="hot dog"
        />
      </div>
      <div className={styles.donut}>
        <Image
          src={'/images/landing/Donut.png'}
          quality={20}
          priority
          layout="fill"
          objectFit="contain"
          alt="Donut"
        />
      </div>
      <div className={styles.hotDogBlur}>
        <Image
          src={'/images/landing/HotDog.png'}
          quality={20}
          priority
          layout="fill"
          objectFit="contain"
          alt="hot dog blur"
        />
      </div>
    </div>
  );
};

export default FloatingFruitLandingPage;
