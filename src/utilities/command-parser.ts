import { config } from '~/config';

export function parseCommand(message: string) {
  const tokens = message.split(' ');
  const rawCommand = tokens[0].trim();
  const isValidCommand = rawCommand.startsWith(config.prefix) && rawCommand.length > config.prefix.length;
  const command = isValidCommand ? rawCommand.slice(1) : null;
  const content = isValidCommand ? tokens.splice(1).join(' ').trim() : message;
  return { command, content };
}
