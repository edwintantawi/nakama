import { WASocket } from '@adiwajshing/baileys';

import { config } from '~/config';
import { Command } from '~/commands';
import { Context, Message } from '~/types';
import { logger } from '~/logger';
import { imageAI } from '~/libs/open-ai';
import { setReactionStatus, Status } from '~/utilities/reaction-status';

export class ImageAICommand implements Command {
  readonly title = 'Image AI';
  readonly keywords: string[];
  readonly usage: string;
  readonly description: string;

  messages: string[] = [];

  constructor(readonly conn: WASocket) {
    this.keywords = ['image', 'img'];
    this.usage = `${config.prefix}image <keywords>`;
    this.description = 'Generate images with AI based on keywords';
  }

  async execute(context: Context, message: Message) {
    try {
      await setReactionStatus(this.conn, context, Status.Loading);

      if (message.conversation === '' && message.subConversation === '') {
        await setReactionStatus(this.conn, context, Status.NotUnderstood);
        this.conn.sendMessage(message.room, { text: '*Please provide text!*' }, { quoted: context });
        return;
      }

      const response = await imageAI(message.conversation || message.subConversation);
      if (!response) {
        setReactionStatus(this.conn, context, Status.Error);
        return;
      }

      await this.conn.sendMessage(message.room, { image: { url: response } }, { quoted: context });
      setReactionStatus(this.conn, context, Status.Success);
    } catch (error) {
      logger.error(error);
      setReactionStatus(this.conn, context, Status.Error);
    }
  }
}
