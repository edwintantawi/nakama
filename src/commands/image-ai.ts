import { WASocket } from '@adiwajshing/baileys';

import { config } from '~/config';
import { Command } from '~/commands';
import { Context, Message } from '~/types';
import { logger } from '~/logger';
import { imageAI } from '~/libs/image';

export class ImageAICommand implements Command {
  readonly title = 'Image AI';
  readonly keywords: string[];
  readonly usage: string;
  readonly description: string;

  messages: string[] = [];

  constructor(readonly conn: WASocket) {
    this.keywords = ['image', 'img'];
    this.usage = `${config.prefix}image`;
    this.description = 'Generate image with AI';
  }

  async execute(context: Context, message: Message) {
    try {
      if (message.conversation === '' && message.subConversation === '') {
        this.conn.sendMessage(message.room, { text: '*Can I help you?...*' }, { quoted: context });
        return;
      }

      this.conn.sendMessage(message.room, { text: '*Wait a moment...*' }, { quoted: context });

      const response = await imageAI(message.conversation || message.subConversation);
      if (!response) {
        this.conn.sendMessage(message.room, { text: "*I can't process it...*" }, { quoted: context });
        return;
      }

      this.conn.sendMessage(message.room, { image: { url: response } }, { quoted: context });
    } catch (error) {
      logger.error(error);
      this.conn.sendMessage(message.room, { text: '*There is something wrong...*' }, { quoted: context });
    }
  }
}
