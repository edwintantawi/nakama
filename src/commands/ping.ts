import { WASocket } from '@adiwajshing/baileys';

import { config } from '~/config';
import { Command } from '~/commands';
import { Context, Message } from '~/types';

export class PingCommand implements Command {
  readonly title = 'Ping';
  readonly keywords: string[];
  readonly usage: string;
  readonly description: string;

  constructor(readonly conn: WASocket) {
    this.keywords = ['p', 'ping'];
    this.usage = `${config.prefix}ping`;
    this.description = 'Ping the bot and get a pong response';
  }

  execute(context: Context, message: Message) {
    this.conn.sendMessage(message.room, { text: 'Pong!' }, { quoted: context });
  }
}
