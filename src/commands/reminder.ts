import { WASocket } from '@adiwajshing/baileys';
import schedule from 'node-schedule';

import { config } from '~/config';
import { Command } from '~/commands';
import { Context, Message } from '~/types';

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

  execute(context: Context, message: Message) {
    try {
      const [target, ...note] = message.conversation.split(' ');
      // '2023-01-28T14:47:23'
      const date = new Date(target);

      if (+date < +new Date()) {
        this.conn.sendMessage(message.room, { text: 'The time given is invalid...' }, { quoted: context });
        return;
      }

      schedule.scheduleJob(date, () => {
        this.conn.sendMessage(
          message.room,
          { text: `*REMINDER!!!*\n\nNote:\n"_${note.join(' ')}_"` },
          { quoted: context }
        );
      });

      this.conn.sendMessage(message.room, { text: 'Reminder set!' }, { quoted: context });
    } catch (error) {
      this.conn.sendMessage(message.room, { text: 'There is something wrong...' }, { quoted: context });
    }
  }
}
