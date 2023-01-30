import { WASocket } from '@adiwajshing/baileys';

import { config } from '~/config';
import { Command } from '~/commands';
import { Context, Message } from '~/types';
import { logger } from '~/logger';
import { setReactionStatus, Status } from '~/utilities/reaction-status';

export class SaveCommand implements Command {
  readonly title = 'Save';
  readonly keywords: string[];
  readonly usage: string;
  readonly description: string;

  constructor(readonly conn: WASocket) {
    this.keywords = ['s', 'save'];
    this.usage = `${config.prefix}save`;
    this.description = 'Save saves the message';
  }

  async execute(context: Context, message: Message) {
    try {
      await setReactionStatus(this.conn, context, Status.Loading);

      await this.conn.sendMessage(
        message.from,
        {
          text: `*Note:*\n${message.conversation || '-'}\n\n*Saved Message:*\n${
            message.quotedMessage?.conversation || '<< no text >>'
          }`,
          forward: context,
        },
        { quoted: context }
      );
      setReactionStatus(this.conn, context, Status.Success);
    } catch (error) {
      logger.error(error);
      setReactionStatus(this.conn, context, Status.Error);
    }
  }
}
