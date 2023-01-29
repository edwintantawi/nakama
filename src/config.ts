export const config: { botId: string | undefined; prefix: string } = {
  botId: undefined, // will be set in connection
  prefix: process.env['PREFIX'] || '!',
};

export const env = {
  OPENAI_KEY: process.env['OPENAI_KEY'],
};
