import { WASocket } from '@adiwajshing/baileys';
import schedule from 'node-schedule';

import { config } from '~/config';
import { Command } from '~/commands';
import { Context, Message } from '~/types';
import { logger } from '~/logger';
import { setReactionStatus, Status } from '~/utilities/reaction-status';

export class ReminderCommand implements Command {
  readonly title = 'Reminder';
  readonly keywords: string[];
  readonly usage: string;
  readonly description: string;

  constructor(readonly conn: WASocket) {
    this.keywords = ['r', 'remind'];
    this.usage = `${config.prefix}remind`;
    this.description = 'Remind you later';
  }

  async execute(context: Context, message: Message) {
    try {
      await setReactionStatus(this.conn, context, Status.Loading);

      const [target, ...note] = message.conversation.split(' ');
      // '2023-01-28T14:47:23'
      const date = new Date(target);

      if (+date < +new Date()) {
        await this.conn.sendMessage(
          message.room,
          { text: '*The time given must be the future time!*' },
          { quoted: context }
        );
        setReactionStatus(this.conn, context, Status.Error);
        return;
      }

      schedule.scheduleJob(date, () => {
        this.conn.sendMessage(
          message.room,
          { text: `*REMINDER!!!*\n\nNote:\n" _${note.join(' ')}_ "` },
          { quoted: context }
        );
      });

      setReactionStatus(this.conn, context, Status.Success);
    } catch (error) {
      logger.error(error);
      setReactionStatus(this.conn, context, Status.Error);
    }
  }
}
