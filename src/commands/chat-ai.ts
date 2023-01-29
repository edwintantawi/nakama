import { WASocket } from '@adiwajshing/baileys';

import { config } from '~/config';
import { Command } from '~/commands';
import { Context, Message } from '~/types';
import { chatAI } from '~/libs/openapi';
import { logger } from '~/logger';

export class ChatAICommand implements Command {
  readonly title = 'Chat AI';
  readonly keywords: string[];
  readonly usage: string;
  readonly description: string;

  conversationContexts: { [key: string]: string[] } = {};
  readonly maxContext = 10;

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

      if (!this.conversationContexts[message.room]) {
        this.conversationContexts[message.room] = [];
      }

      if (message.conversation === 'clear') {
        this.conversationContexts[message.room] = [];
        this.conn.sendMessage(message.room, { text: '*Chat context has been clear!*' }, { quoted: context });
        return;
      }

      if (this.conversationContexts[message.room].length > this.maxContext) {
        this.conversationContexts[message.room].shift();
      }

      const ctx = message.subConversation ? `Context: ${message.subConversation}\n` : '';
      const me = message.conversation ? `Me: ${message.conversation}\nYou: ` : 'You: ';

      ctx && this.conversationContexts[message.room].push(ctx);
      const response = await chatAI(me, this.conversationContexts[message.room].join('\n'));
      me && this.conversationContexts[message.room].push(me);
      response && this.conversationContexts[message.room].push(`${response}\n`);

      console.log({
        ctx,
        me,
        response,
        messages: this.conversationContexts[message.room].join(''),
      });

      this.conn.sendMessage(message.room, { text: response ?? '...' }, { quoted: context });
    } catch (error) {
      logger.error(error);
      this.conn.sendMessage(message.room, { text: '*There is something wrong...*' }, { quoted: context });
    }
  }
}
