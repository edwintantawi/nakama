import { WASocket } from '@adiwajshing/baileys';

import { config } from '~/config';
import { Command } from '~/commands';
import { Context, Message } from '~/types';
import { logger } from '~/logger';

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
      this.conn.sendMessage(
        message.room,
        { text: '*Message has been saved!*\n\n_The saved messages are in your private messages._' },
        { quoted: context }
      );

      this.conn.sendMessage(
        message.from,
        {
          text: `*Note:*\n${message.conversation || '-'}\n\n*Saved Message:*\n${
            message.quotedMessage?.conversation || '<< no text >>'
          }`,
          forward: context,
        },
        { quoted: context }
      );
    } catch (error) {
      logger.error(error);
      this.conn.sendMessage(message.room, { text: '*There is something wrong...*' }, { quoted: context });
    }
  }
}
