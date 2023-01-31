import { WASocket } from '@adiwajshing/baileys';

import { config } from '~/config';
import { Command } from '~/commands';
import { Context, Message } from '~/types';
import { chatAI } from '~/libs/openapi';
import { logger } from '~/logger';
import { setReactionStatus, Status } from '~/utilities/reaction-status';

export class ChatAICommand implements Command {
  readonly title = 'Chat AI';
  readonly keywords: string[];
  readonly usage: string;
  readonly description: string;

  conversationContexts: { [key: string]: string[] } = {};
  readonly maxContext = 10;

  constructor(readonly conn: WASocket) {
    this.keywords = ['ai'];
    this.usage = `${config.prefix}ai <message>`;
    this.description =
      'Start a conversation with AI, you can also reply to bots without prompts to start a conversation too';
  }

  async execute(context: Context, message: Message) {
    try {
      await setReactionStatus(this.conn, context, Status.Loading);

      if (message.conversation === '' && message.subConversation === '') {
        message.conversation = 'hi';
      }

      if (!this.conversationContexts[message.room]) {
        this.conversationContexts[message.room] = [];
      }

      if (message.conversation === 'clear') {
        this.conversationContexts[message.room] = [];
        setReactionStatus(this.conn, context, Status.Success);
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

      await this.conn.sendMessage(message.room, { text: response ?? '...' }, { quoted: context });
      setReactionStatus(this.conn, context, Status.Success);
    } catch (error) {
      logger.error(error);
      setReactionStatus(this.conn, context, Status.Error);
    }
  }
}
