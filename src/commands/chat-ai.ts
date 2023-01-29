import { WASocket } from '@adiwajshing/baileys';

import { config } from '~/config';
import { Command } from '~/commands';
import { Context, Message } from '~/types';
import { chatAI } from '~/libs/chat';
import { logger } from '~/logger';

export class ChatAICommand implements Command {
  readonly title = 'Chat AI';
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
      if (message.conversation === '' && message.subConversation === '') {
        this.conn.sendMessage(message.room, { text: '*Can I help you?...*' }, { quoted: context });
        return;
      }

      if (message.conversation === 'clear') {
        this.messages = [];
        this.conn.sendMessage(message.room, { text: '*Chat context has been clear!*' }, { quoted: context });
        return;
      }

      const ctx = message.subConversation ? `Context: ${message.subConversation}\n` : '';
      const me = message.conversation ? `Me: ${message.conversation}\nYou: ` : 'You: ';

      ctx && this.messages.push(ctx);
      const response = await chatAI(me, this.messages.join('\n'));
      me && this.messages.push(me);
      response && this.messages.push(`${response}\n`);

      console.log({
        ctx,
        me,
        response,
        messages: this.messages.join(''),
      });

      this.conn.sendMessage(message.room, { text: response ?? '...' }, { quoted: context });
    } catch (error) {
      logger.error(error);
      this.conn.sendMessage(message.room, { text: '*There is something wrong...*' }, { quoted: context });
    }
  }
}
