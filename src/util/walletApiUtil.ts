import axios from 'axios';

export const DEV_API_URL =
  'https://p0rddetfk8.execute-api.us-east-1.amazonaws.com';

export interface BaseUserWallet {
  privateKeyWithLeadingHex: string;
  addressC: string;
  addressP: string;
  addressX: string;
}

export interface User {
  urn: string;
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  organization: string;
}

export interface Self extends User {
  wallet: BaseUserWallet;
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
