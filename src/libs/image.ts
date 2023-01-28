import { openai } from '~/libs/openapi';

export async function imageAI(message: string) {
  const response = await openai.createImage({
    prompt: message,
    n: 1,
    size: '512x512',
  });
  const image_url = response.data.data[0].url;
  return image_url;
}
