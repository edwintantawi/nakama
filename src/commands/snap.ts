import { WASocket } from '@adiwajshing/baileys';

import { config } from '~/config';
import { Command } from '~/commands';
import { Context, Message } from '~/types';
import { graphene } from '~/libs/graphene';
import { logger } from '~/logger';
import { setReactionStatus, Status } from '~/utilities/reaction-status';

export class SnapCommand implements Command {
  readonly title = 'Snap';
  readonly keywords: string[];
  readonly usage: string;
  readonly description: string;

  constructor(readonly conn: WASocket) {
    this.keywords = ['snap', 'sp', 'ss'];
    this.usage = `${config.prefix}snap <text (not required)>`;
    this.description = 'Create screenshot of code snipped, you can also can use in reply message';
  }

  async execute(context: Context, message: Message) {
    try {
      await setReactionStatus(this.conn, context, Status.Loading);

      const codeSnipped = message.conversation || message.quotedMessage?.conversation;
      if (!codeSnipped) {
        await setReactionStatus(this.conn, context, Status.NotUnderstood);
        this.conn.sendMessage(message.room, { text: '*Please provide text!*' }, { quoted: context });
        return;
      }

      const result = await graphene(codeSnipped.replace(/\t/g, '    '));

      await this.conn.sendMessage(message.room, { image: result }, { quoted: context });
      setReactionStatus(this.conn, context, Status.Success);
    } catch (error) {
      logger.error(error);
      setReactionStatus(this.conn, context, Status.Error);
    }
  }
}
