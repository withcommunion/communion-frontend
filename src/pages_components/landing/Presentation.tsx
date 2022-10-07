import { FC } from 'react';
import styles from '../../styles/Index.module.css';
import Link from 'next/link';

const Presentation: FC = () => {
  return (
    <div className={styles.presentationContainer}>
      <div className={styles.loginLink}>
        <Link href="#">Log in</Link>
      </div>
      <div className="min-h-80vh pb-2">
        <div className="container my-0 mx-auto flex w-full justify-center px-6 md:max-w-50vw"></div>
        <div className="h-0 w-100vw">
          <div className={styles.presentationIframeWrap}>
            <iframe
              allowTransparency={true}
              allowFullScreen
              className="h-75vh w-75vw"
              src="https://www.beautiful.ai/embed/-NDEC9_cwOc82ysWvrNe?utm_source=beautiful_player&utm_medium=embed&utm_campaign=-NC0yRqzCjtieL2CA_e1"
            ></iframe>
          </div>
        </div>
      </div>
      <div className={styles.mainButtonWrap}>
        <Link href="https://www.beautiful.ai/embed/-NDEC9_cwOc82ysWvrNe?utm_source=beautiful_player&utm_medium=embed&utm_campaign=-NC0yRqzCjtieL2CA_e1">
          Get Invite
        </Link>
      </div>
    </div>
  );
};

export default Presentation;
