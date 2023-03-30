import { WASocket } from '@adiwajshing/baileys';
import { ChatCompletionRequestMessage } from 'openai';

import { config } from '~/config';
import { Command } from '~/commands';
import { Context, Message } from '~/types';
import { chatAI } from '~/libs/open-ai';
import { logger } from '~/logger';
import { setReactionStatus, Status } from '~/utilities/reaction-status';

export class ChatAICommand implements Command {
  readonly title = 'Chat AI';
  readonly keywords: string[];
  readonly usage: string;
  readonly description: string;
  readonly trigger = '‎‎';

  conversationContexts: { [key: string]: ChatCompletionRequestMessage[] } = {};
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

      const isAlreadyExist = this.conversationContexts[message.room].find((m) => {
        return m.content === message.quotedMessage?.conversation.replace(this.trigger, '');
      });

      const ctx: ChatCompletionRequestMessage | null =
        !isAlreadyExist && message.quotedMessage?.conversation
          ? { role: 'system', content: message.quotedMessage?.conversation }
          : null;

      const me: ChatCompletionRequestMessage = {
        role: 'user',
        content: message.conversation,
        name: `${message.from.replace('@s.whatsapp.net', '')}`,
      };

      ctx && this.conversationContexts[message.room].push(ctx);
      this.conversationContexts[message.room].push(me);
      const response = await chatAI(this.conversationContexts[message.room]);
      response && this.conversationContexts[message.room].push(response);

      await this.conn.sendMessage(
        message.room,
        { text: `${this.trigger}${response?.content}` ?? '...' },
        { quoted: context }
      );
      setReactionStatus(this.conn, context, Status.Success);
    } catch (error) {
      logger.error(error);
      setReactionStatus(this.conn, context, Status.Error);
    }
  }
}
