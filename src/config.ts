export const config: { botId?: string; prefix: string; owner?: string; isActive: boolean } = {
  botId: undefined, // will be set in connection
  prefix: process.env['PREFIX'] || '!',
  owner: process.env['OWNER'],
  isActive: true,
};

export const env = {
  OPENAI_KEY: process.env['OPENAI_KEY'],
};
