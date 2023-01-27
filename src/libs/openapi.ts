import { Configuration, OpenAIApi } from 'openai';

import { env } from '~/config';

const configuration = new Configuration({
  apiKey: env.OPENAI_KEY,
});

export const openai = new OpenAIApi(configuration);
