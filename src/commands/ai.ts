import { WASocket } from '@adiwajshing/baileys';

import { config } from '~/config';
import { Command } from '~/commands';
import { Context, Message } from '~/types';
import { chatAI } from '~/libs/chat';
import { logger } from '~/logger';

export class AICommand implements Command {
  readonly title = 'AI';
  readonly keywords: string[];
  readonly usage: string;
  readonly description: string;

  messages: string[] = [];

  constructor(readonly conn: WASocket) {
    this.keywords = ['ai'];
    this.usage = `${config.prefix}ai`;
    this.description = 'Chat with AI';
  }

  async execute(context: Context, message: Message) {
    try {
      if (message.conversation === 'clear') {
        this.messages = [];
        this.conn.sendMessage(message.room, { text: 'Chat context has been cleaned' }, { quoted: context });
        return;
      }

      message.subConversation && this.messages.push(message.subConversation);
      this.messages.push(message.conversation);
      const response = await chatAI(message.conversation, this.messages.join('\n'));
      response && this.messages.push(response);

      this.conn.sendMessage(message.room, { text: response ?? '...' }, { quoted: context });
    } catch (error) {
      logger.error(error);
      this.conn.sendMessage(message.room, { text: 'There is something wrong...' }, { quoted: context });
    }
  }
}
