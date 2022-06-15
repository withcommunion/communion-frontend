import axios from 'axios';
import { ethers } from 'ethers';

export const DEV_API_URL =
  'https://p0rddetfk8.execute-api.us-east-1.amazonaws.com';

export interface User {
  id: string;
  email?: string;
  first_name: string;
  last_name: string;
  organization: string;
  role: 'worker' | 'manager' | 'owner' | 'seeder' | string;
  walletPrivateKeyWithLeadingHex?: string;
  walletAddressC: string;
  walletAddressP: string;
  walletAddressX: string;
}

export interface Self extends User {
  walletPrivateKeyWithLeadingHex: string;
}

export async function fetchSelf(jwtToken: string): Promise<Self> {
  try {
    const rawWallet = await axios.get<Self>(`${DEV_API_URL}/user/self`, {
      headers: {
        Authorization: jwtToken,
      },
    });
    const self = rawWallet.data;
    return self;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export interface HistoricalTxn {
  fromUser: User;
  toUser: User;
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
}
export async function fetchSelfTxs(jwtToken: string): Promise<HistoricalTxn[]> {
  try {
    const rawWallet = await axios.get<{ txs: HistoricalTxn[] }>(
      `${DEV_API_URL}/user/self/tx`,
      {
        headers: {
          Authorization: jwtToken,
        },
      }
    );
    const selfTxs = rawWallet.data;
    return selfTxs.txs;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export interface Organization {
  name: string;
  users: User[];
}
export async function fetchOrganization(
  orgName: string,
  jwtToken: string
): Promise<Organization> {
  try {
    const rawOrg = await axios.get<Organization>(
      `${DEV_API_URL}/organization/${orgName}`,
      {
        headers: {
          Authorization: jwtToken,
        },
      }
    );
    const organization = rawOrg.data;
    return organization;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function postSeedSelf(jwtToken: string) {
  const rawSeedResp = await axios.post<ethers.Transaction>(
    `${DEV_API_URL}/user/self/seed`,
    {},
    {
      headers: {
        Authorization: jwtToken,
      },
    }
  );

  const seedTxn = rawSeedResp.data;

  return seedTxn;
}
