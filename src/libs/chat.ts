import { openai } from '~/libs/openapi';

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
