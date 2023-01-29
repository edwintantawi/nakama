import axios from 'axios';

const ENDPOINT = 'https://graphene.teknologiumum.com/api';

export async function graphene(code: string) {
  const result = await axios(ENDPOINT, {
    method: 'POST',
    responseType: 'arraybuffer',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      code: code,
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
