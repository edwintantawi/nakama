import { openai } from '~/libs/openapi';

export function addHumanChat(message: string) {
  return `\n${message}\n`;
}

export async function chatAI(message: string, context = '') {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: context + message,
    temperature: 0.9,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0.6,
  });

  return response.data.choices[0].text?.trim();
}
