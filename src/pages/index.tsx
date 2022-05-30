import type { NextPage } from 'next';
import Head from 'next/head';
import { IndexHeader } from '../pages_components/indexPageComponents';

const Index: NextPage = () => {
  return (
    <div className="h-screen">
      <Head>
        <title>Communion</title>
        <meta name="description" content="Communion" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen py-4 flex flex-col justify-center items-center">
        <IndexHeader />
      </main>
    </div>
  );
};

export default Index;
