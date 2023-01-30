import { WASocket } from '@adiwajshing/baileys';

import { config } from '~/config';
import { Command } from '~/commands';
import { Context, Message } from '~/types';
import { getRandomJoke } from '~/libs/joke';
import { logger } from '~/logger';

export class JokeCommand implements Command {
  readonly title = 'Joke';
  readonly keywords: string[];
  readonly usage: string;
  readonly description: string;

  constructor(readonly conn: WASocket) {
    this.keywords = ['joke', 'jk'];
    this.usage = `${config.prefix}joke`;
    this.description = 'Generate a random joke';
  }

  async execute(context: Context, message: Message) {
    try {
      const result = await getRandomJoke();
      this.conn.sendMessage(
        message.room,
        { text: `*Joke*\nCategory: _${result.category}_\n\n${result.joke}` },
        { quoted: context }
      );
    } catch (error) {
      logger.error(error);
      this.conn.sendMessage(message.room, { text: '*There is something wrong...*' }, { quoted: context });
    }
  }
}
