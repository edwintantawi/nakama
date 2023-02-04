import { WASocket } from '@adiwajshing/baileys';

import { config } from '~/config';
import { Command } from '~/commands';
import { Context, Message } from '~/types';
import { logger } from '~/logger';
import { setReactionStatus, Status } from '~/utilities/reaction-status';
import { getHTTPCat } from '~/libs/http-cat';

export class HTTPStatusCodeCommand implements Command {
  readonly title = 'HTTP Status Code';
  readonly keywords: string[];
  readonly usage: string;
  readonly description: string;

  constructor(readonly conn: WASocket) {
    this.keywords = ['http', 'status-code'];
    this.usage = `${config.prefix}http <http status code (200,201,...)>`;
    this.description = 'Get HTTP status code image';
  }

  async execute(context: Context, message: Message) {
    try {
      await setReactionStatus(this.conn, context, Status.Loading);
      const [token] = message.conversation.split(' ');
      const result = await getHTTPCat(token);
      await this.conn.sendMessage(message.room, { image: result }, { quoted: context });
      setReactionStatus(this.conn, context, Status.Success);
    } catch (error) {
      logger.error(error);
      setReactionStatus(this.conn, context, Status.Error);
    }
  }
}
