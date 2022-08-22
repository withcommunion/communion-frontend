import { useState, useEffect } from 'react';
import copy from 'copy-to-clipboard';

import { isProd, isDev, isLocal } from '@/util/envUtil';
import SecondaryButton from '@/shared_components/buttons/secondaryButton';

interface Props {
  orgJoinCode: string;
  orgId: string;
}

const InviteLink = ({ orgId, orgJoinCode }: Props) => {
  const [copyMessage, setCopyMessage] = useState('Copy');
  const [orgUrlWithJoinCode, setOrgUrlWithJoinCode] = useState('');

  useEffect(() => {
    if (orgId && orgJoinCode && !orgUrlWithJoinCode) {
      const prodUrl = 'https://withcommunion.com';
      const devUrl = 'https://dev.withcommunion.com';
      const localUrl = 'http://localhost:3000';
      const urlQueryParams = `?orgId=${orgId}&joinCode=${orgJoinCode}`;

      if (isProd) {
        setOrgUrlWithJoinCode(`${prodUrl}${urlQueryParams}`);
      } else if (isDev) {
        setOrgUrlWithJoinCode(`${devUrl}${urlQueryParams}`);
      } else if (isLocal) {
        setOrgUrlWithJoinCode(`${localUrl}${urlQueryParams}`);
      }
    }
  }, [orgId, orgJoinCode, orgUrlWithJoinCode]);

  return (
    <div className="my-8 flex w-full flex-col text-start">
      <label>
        <span className="text-xl">Invite code</span>
      </label>
      <div className="flex flex-row">
        <input
          readOnly
          className="w-full border-1px border-thirdLightGray bg-white py-2 pl-5 pr-4 text-primaryPurple focus:outline-0"
          value={orgUrlWithJoinCode}
        />
        <button
          className="w-2/6 rounded border-2 border-primaryOrange py-1 px-1 text-sm text-primaryOrange"
          onClick={() => {
            copy(orgUrlWithJoinCode);
            setCopyMessage('✅ Copied!');
            setTimeout(() => {
              setCopyMessage('Copy');
            }, 1000);
          }}
        >
          {copyMessage}
        </button>
      </div>
      {navigator.share && (
        <SecondaryButton
          text="Share"
          size="big"
          onClick={async () => {
            try {
              console.log(navigator.canShare());
              await navigator.share({
                title: `Join Communion Org ${orgId}`,
                url: orgUrlWithJoinCode,
              });
            } catch (err) {
              // @ts-expect-error it's okay
              console.error('Share failed:', err.message);
            }
          }}
        />
      )}
    </div>
  );
};

export default InviteLink;
