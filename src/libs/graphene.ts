import axios from 'axios';

const ENDPOINT = 'https://teknologi-umum-graphene.fly.dev/api';

export async function graphene(code: string) {
  const result = await axios(ENDPOINT, {
    method: 'POST',
    responseType: 'arraybuffer',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      code,
      theme: 'dracula',
      format: 'jpeg',
      upscale: 5,
      font: 'jetbrains mono',
      lineNumber: false,
      border: {
        thickness: 0,
      },
    },
  });

  return Buffer.from(result.data, 'binary');
}
