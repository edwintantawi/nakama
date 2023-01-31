import { WASocket } from '@adiwajshing/baileys';

import { config } from '~/config';
import { Command } from '~/commands';
import { Context, Message } from '~/types';
import { logger } from '~/logger';
import { setReactionStatus, Status } from '~/utilities/reaction-status';

export class SettingCommand implements Command {
  readonly title = 'Setting';
  readonly keywords: string[];
  readonly usage: string;
  readonly description: string;

  constructor(readonly conn: WASocket) {
    this.keywords = ['setting', 'st'];
    this.usage = `${config.prefix}setting`;
    this.description = 'Setting the bot configuration (owner only access)';
  }

  async execute(context: Context, message: Message) {
    try {
      if (!message.isOwner) {
        await this.conn.sendMessage(message.room, { text: '*Access denied!*' }, { quoted: context });
        setReactionStatus(this.conn, context, Status.Error);
        return;
      }

      await setReactionStatus(this.conn, context, Status.Loading);

      const [token] = message.conversation.split(' ');
      switch (token) {
        case 'on':
          if (config.isActive) {
            await this.conn.sendMessage(message.room, { text: '*Already ON!*' }, { quoted: context });
            setReactionStatus(this.conn, context, Status.Error);
            return;
          }
          config.isActive = true;
          break;
        case 'off':
          if (!config.isActive) {
            await this.conn.sendMessage(message.room, { text: '*Already OFF!*' }, { quoted: context });
            setReactionStatus(this.conn, context, Status.Error);
            return;
          }
          config.isActive = false;
          break;
      }

      setReactionStatus(this.conn, context, Status.Success);
    } catch (error) {
      logger.error(error);
      setReactionStatus(this.conn, context, Status.Error);
    }
  }
}
