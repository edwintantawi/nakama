import { WASocket } from '@adiwajshing/baileys';

import { config } from '~/config';
import { Command } from '~/commands';
import { Context, Message } from '~/types';
import { getRandomJoke } from '~/libs/joke';
import { logger } from '~/logger';
import { setReactionStatus, Status } from '~/utilities/reaction-status';

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
      await setReactionStatus(this.conn, context, Status.Loading);

      const result = await getRandomJoke();
      await this.conn.sendMessage(
        message.room,
        { text: `*Joke*\nCategory: _${result.category}_\n\n${result.joke}` },
        { quoted: context }
      );
      setReactionStatus(this.conn, context, Status.Success);
    } catch (error) {
      logger.error(error);
      setReactionStatus(this.conn, context, Status.Error);
    }
  }
}
