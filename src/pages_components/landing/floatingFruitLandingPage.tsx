import styles from '../../styles/index.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

const FloatingFruitLandingPage = () => {
  const router = useRouter();
  return (
    <div className={styles.app}>
      <div className={styles.loginLink}>
        <Link href={{ pathname: '/login', query: router.query }}>Log in</Link>
      </div>
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
          Modernizing worker training/development for blue-collar businesses
        </p>
        <div className={styles.mainButton}>
          <a
            href="https://ieo7xyuo672.typeform.com/to/dZ9eGcAH"
            target="_blank"
            rel="noreferrer"
          >
            Get Invite!
          </a>
        </div>
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
          quality={20}
          layout="fill"
          objectFit="contain"
          alt="Donut"
        />
      </div>
      <div className={styles.hotDogBlur}>
        <Image
          src={'/images/landing/HotDog.png'}
          quality={20}
          layout="fill"
          objectFit="contain"
          alt="hot dog blur"
        />
      </div>
    </div>
  );
};

export default FloatingFruitLandingPage;
