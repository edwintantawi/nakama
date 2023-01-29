import { WASocket } from '@adiwajshing/baileys';

import { config } from '~/config';
import { Command } from '~/commands';
import { Context, Message } from '~/types';
import { graphene } from '~/libs/graphene';

export class SnapCommand implements Command {
  readonly title = 'Snap';
  readonly keywords: string[];
  readonly usage: string;
  readonly description: string;

  constructor(readonly conn: WASocket) {
    this.keywords = ['snap'];
    this.usage = `${config.prefix}snap`;
    this.description = 'Create screenshot of code snipped';
  }

  async execute(context: Context, message: Message) {
    try {
      this.conn.sendMessage(message.room, { text: '*Wait a moment...*' }, { quoted: context });

      const result = await graphene(message.conversation || message.quotedMessage?.conversation || '');

      this.conn.sendMessage(message.room, { image: result }, { quoted: context });
    } catch (error) {
      console.log(error);
      this.conn.sendMessage(message.room, { text: '*There is something wrong...*' }, { quoted: context });
    }
  }
}
