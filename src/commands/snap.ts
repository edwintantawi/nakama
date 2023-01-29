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
    this.keywords = ['snap', 'sp', 'ss'];
    this.usage = `${config.prefix}snap`;
    this.description = 'Create screenshot of code snipped';
  }

  async execute(context: Context, message: Message) {
    try {
      const codeSnipped = message.conversation || message.quotedMessage?.conversation;
      if (!codeSnipped) {
        this.conn.sendMessage(message.room, { text: '*Invalid text...*' }, { quoted: context });
        return;
      }

      this.conn.sendMessage(message.room, { text: '*Wait a moment...*' }, { quoted: context });
      const result = await graphene(codeSnipped.replace(/\t/g, '    '));

      this.conn.sendMessage(message.room, { image: result }, { quoted: context });
    } catch (error) {
      this.conn.sendMessage(message.room, { text: '*There is something wrong...*' }, { quoted: context });
    }
  }
}
