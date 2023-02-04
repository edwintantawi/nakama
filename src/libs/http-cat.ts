import axios from 'axios';

const ENDPOINT = 'https://http.cat';

export async function getHTTPCat(code: number | string): Promise<Buffer> {
  const result = await axios(`${ENDPOINT}/${code}`, {
    responseType: 'arraybuffer',
  });

  return Buffer.from(result.data, 'binary');
}
