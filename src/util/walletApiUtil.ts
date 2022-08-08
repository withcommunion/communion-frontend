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
  role: 'worker' | 'manager' | 'owner' | 'seeder' | string;
  walletPrivateKeyWithLeadingHex?: string;
  walletAddressC: string;
  walletAddressP: string;
  walletAddressX: string;
}

export interface Self extends User {
  walletPrivateKeyWithLeadingHex: string;
}

export interface UserInTxn {
  first_name: string;
  last_name: string;
  id: string;
}
export interface HistoricalTxn {
  fromUser: UserInTxn;
  toUser: UserInTxn;
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  from: string;
  to: string;
  contractAddress: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  input: string;
  confirmations: string;
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
  member_ids: string[];
  members: User[];
  avax_contract: {
    address: string;
    token_name: string;
    token_symbol: string;
  };
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
