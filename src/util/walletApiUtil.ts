import axios from 'axios';

export const DEV_API_URL =
  'https://p0rddetfk8.execute-api.us-east-1.amazonaws.com';

interface GetWalletByUserIdResponse {
  privateKeyWithLeadingHex: string;
}
export async function fetchWalletByUserId(): Promise<string> {
  try {
    const rawWallet = await axios.get<GetWalletByUserIdResponse>(
      `${DEV_API_URL}/wallet/1`
    );
    return rawWallet.data.privateKeyWithLeadingHex;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
