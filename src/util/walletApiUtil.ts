import axios from 'axios';
import { isProd } from '@/util/envUtil';

const DEV_API_URL = 'https://p0rddetfk8.execute-api.us-east-1.amazonaws.com';
const PROD_API_URL = 'https://jxsq272682.execute-api.us-east-1.amazonaws.com';
export const API_URL = isProd ? PROD_API_URL : DEV_API_URL;

export interface User {
  id: string;
  email?: string;
  first_name: string;
  last_name: string;
  organization: string;
  organizations: { orgId: string; role: string }[];
  owned_nfts?: MintedNftDetails[];
  role: 'worker' | 'manager' | 'owner' | 'seeder' | string;
  walletPrivateKeyWithLeadingHex?: string;
  walletAddressC: string;
  walletAddressP: string;
  walletAddressX: string;
}

export interface Self extends User {
  walletPrivateKeyWithLeadingHex: string;
  phone_number: string;
  allow_sms: boolean;
}

export interface UserInTxn {
  first_name: string;
  last_name: string;
  id: string;
}
export interface CommunionTx {
  timeStampSeconds: number;
  tokenName: string;
  tokenSymbol: string;
  value: number;
  txHash: string;
  txHashUrl: string;
  txStatus: 'succeeded' | 'failed';
  txType: 'received' | 'sent' | 'redemption';
  message?: string;
  fromUser: {
    id: string;
    walletAddressC: string;
    firstName: string;
    lastName: string;
  };
  toUser: {
    id: string;
    walletAddressC: string;
    firstName: string;
    lastName: string;
  };
  modifier?: 'bankHeist';
}

export interface OrgAction {
  name: string;
  amount: string;
  allowed_roles: string[];
}
export enum Roles {
  worker = 'worker',
  manager = 'manager',
  owner = 'owner',
  seeder = 'seeder',
}
export interface OrgRedeemable {
  name: string;
  amount: string;
  allowed_roles: Roles[];
}
export interface OrgWithPublicData {
  id: string;
  actions: OrgAction[];
  roles: Roles[];
  redeemables: OrgRedeemable[];
  available_nfts?: CommunionNft[];
  minted_nfts?: MintedNftDetails[];
  member_ids: string[];
  members: User[];
  join_code?: string;
  avax_contract: {
    address: string;
    token_name: string;
    token_symbol: string;
  };
}

export interface CommunionNft {
  id: string;
  contractAddress?: string;
  mintedTokenId?: string;
  erc721Meta: {
    title: string;
    id: string;
    properties: {
      name: string;
      description: string;
      image: string;
      attributes: {
        display_type: number;
        trait_type: string;
        value: number;
      }[];
    };
  };
}

export interface Erc721Nft {
  name: string;
  description: string;
  image: string;
  attributes: {
    display_type: number;
    trait_type: string;
    value: number;
  }[];
}

export interface MintedNftDetails {
  communionNftId: string;
  ownerUserId: string;
  mintedNftId: number;
  mintedNftUri: string;
  orgId: string;
  txnHash: string;
  contractAddress: string;
  createdAt: number;
}

export async function postToLogTxnError(
  action: string,
  message: string,
  jwtToken: string
) {
  return axios.post<{
    action: string;
    message: string;
  }>(
    `${API_URL}/log`,
    {
      action,
      message,
    },
    {
      headers: {
        Authorization: jwtToken,
      },
    }
  );
}
