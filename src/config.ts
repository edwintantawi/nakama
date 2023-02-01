export const config: {
  botId?: string;
  prefix: string;
  owner?: string;
  isActive: boolean;
  dumpId: string;
  dumpInterval: number;
} = {
  botId: undefined, // will be set in connection
  isActive: true,
  prefix: process.env['PREFIX'] || '!',
  owner: process.env['OWNER'],
  dumpId: process.env['DUMP_ID'] || '',
  dumpInterval: parseInt(process.env['DUMP_INTERVAL'] || '5'),
};

export const env = {
  OPENAI_KEY: process.env['OPENAI_KEY'],
  LINK_PREVIEW_KEY: process.env['LINK_PREVIEW_KEY'],
  RAPID_API_KEY: process.env['RAPID_API_KEY'],
};
