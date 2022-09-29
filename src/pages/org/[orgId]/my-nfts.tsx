import { GetServerSideProps } from 'next';
import { Amplify } from 'aws-amplify';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { AMPLIFY_CONFIG } from '@/util/cognitoAuthUtil';
import { getUserJwtTokenOnServer } from '@/util/cognitoAuthUtil';
import { useAppSelector } from '@/reduxHooks';
import { useFetchSelf, useFetchOrg } from '@/shared_hooks/sharedHooks';

import { selectOwnedNftsInCurrentOrg } from '@/features/selfSlice';

import NavBar, { AvailablePages } from '@/shared_components/navBar/NavBar';
import BackToButton from '@/shared_components/backToButton/BackToButton';
import NftGridDisplayList from '@/pages_components/org/[orgId]/send/nft/nftGridDisplayList/nftGridDisplayList';
import SelectedNftComponent from '@/pages_components/org/[orgId]/send/nft/selectedNftComponent/selectedNftComponent';

import { CommunionNft } from '@/util/walletApiUtil';
import { selectAvailableNfts } from '@/features/organization/organizationSlice';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/#general-configuration
Amplify.configure({ ...AMPLIFY_CONFIG, ssr: true });

interface Props {
  userJwt: string;
}

const MyNftPage = ({ userJwt }: Props) => {
  const router = useRouter();

  useFetchSelf(userJwt);
  useFetchOrg(userJwt);
  const { orgId } = router.query;
  const ownedCommunionNfts = useAppSelector((state) =>
    selectOwnedNftsInCurrentOrg(state)
  );
  const availableNfts = useAppSelector((state) => selectAvailableNfts(state));

  const [selectedNft, setSelectedNft] = useState<CommunionNft>(
    ownedCommunionNfts[0]
  );

  useEffect(() => {
    if (ownedCommunionNfts.length > 0 && !selectedNft) {
      setSelectedNft(ownedCommunionNfts[0]);
    }
  }, [setSelectedNft, selectedNft, ownedCommunionNfts]);

  return (
    <div>
      <NavBar
        activePage={AvailablePages.orgHome}
        activeOrgId={(orgId || '').toString()}
      />
      <div className="h-full min-h-100vh bg-secondaryLightGray pb-6">
        <div className="container my-0 mx-auto mb-10 w-full px-6 md:max-w-50vw">
          <Link href={`/org/${(orgId || '').toString()}/`}>
            <a>
              <div className="w-fit">
                <BackToButton
                  onClick={() => true}
                  backToDestinationText={'Home'}
                />
              </div>
            </a>
          </Link>
          {Boolean(ownedCommunionNfts.length) && (
            <>
              <SelectedNftComponent selectedItem={selectedNft} />
              <NftGridDisplayList
                availableNfts={ownedCommunionNfts}
                onNftClick={(nft) => {
                  setSelectedNft(nft);
                }}
                activeNft={selectedNft}
              />
            </>
          )}
          {!ownedCommunionNfts.length && availableNfts && (
            <div className="mx-auto w-full md:w-full lg:w-70% xl:w-60% 2xl:w-50%">
              <div className="mb-14px rounded-xl border-4 border-twelfthLightGray bg-white sm:h-full sm:w-full">
                <div className="relative mb-5">
                  <Image
                    className="grayscale"
                    src={availableNfts[0]?.erc721Meta.properties.image}
                    alt="nft image"
                    priority
                    width="100%"
                    height="100%"
                    layout="responsive"
                    objectFit="fill"
                  />
                </div>
                <div className="text-primaryGray">
                  <h2 className="mb-2 px-7 text-lg font-semibold uppercase">
                    You don&apos;t have any NFTs
                  </h2>
                  <p className="mb-2 break-words px-7 text-sm">
                    NFT Badges are gifts from your employer.
                  </p>
                  <p className="mb-2 break-words px-7 text-sm">
                    They are credentials that will follow you from job to job.
                    They are a way to show your skills and experience to future
                    employers.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const userJwt = await getUserJwtTokenOnServer(context);
    return {
      props: { userJwt },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {},
      redirect: {
        destination: '/',
      },
    };
  }
};

export default MyNftPage;
