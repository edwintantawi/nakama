import { Configuration, OpenAIApi } from 'openai';

import { env } from '~/config';

const configuration = new Configuration({
  apiKey: env.OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);

export async function chatAI(message: string, context = '') {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: context + message,
    temperature: 0.9,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0.6,
    stop: [' Me:', ' You:', ' Context:'],
  });

  return response.data.choices[0].text?.trim();
}

export async function imageAI(message: string) {
  const response = await openai.createImage({
    prompt: message,
    n: 1,
    size: '512x512',
  });
  const image_url = response.data.data[0].url;
  return image_url;
}
