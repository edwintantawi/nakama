import { DownloadableMessage, downloadContentFromMessage, WASocket } from '@adiwajshing/baileys';

import { config } from '~/config';
import { Command } from '~/commands';
import { Context, Message } from '~/types';
import { logger } from '~/logger';
import { setReactionStatus, Status } from '~/utilities/reaction-status';
import { Language, tesseract } from '~/libs/tesseract';

const languageMapping: { [key: string]: Language } = {
  id: 'ind',
  en: 'eng',
  'ch-s': 'chi_sim',
  'ch-t': 'chi_tra',
  jpn: 'jpn',
};

export class ImageToTextCommand implements Command {
  readonly title = 'Image To Text';
  readonly keywords: string[];
  readonly usage: string;
  readonly description: string;

  readonly supportedLanguages = ['en', 'id', 'ch-s', 'ch-t', 'jpn'];

  constructor(readonly conn: WASocket) {
    this.keywords = ['itot', 'image-to-text'];
    this.usage = `${config.prefix}itot <language (${this.supportedLanguages.join('|')}) (default to ${
      this.supportedLanguages[0]
    })>`;
    this.description = 'Extract text from an image';
  }

  async execute(context: Context, message: Message) {
    try {
      await setReactionStatus(this.conn, context, Status.Loading);

      if (!message.hasImage) {
        await this.conn.sendMessage(message.room, { text: '*Require an image!*' }, { quoted: context });
        setReactionStatus(this.conn, context, Status.NotUnderstood);
        return;
      }

      let [token] = message.conversation.split(' ');
      if (token === '') token = this.supportedLanguages[0];

      let buffer = Buffer.from([]);
      const stream = await downloadContentFromMessage(message.image as DownloadableMessage, 'image');
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }

      const lang = languageMapping[token];
      if (lang === undefined) {
        await this.conn.sendMessage(
          message.room,
          { text: `*Language not supported!*\n\nAvailable Language: _${this.supportedLanguages.join(', ')}_` },
          { quoted: context }
        );
        setReactionStatus(this.conn, context, Status.NotUnderstood);
        return;
      }

      const text = await tesseract(buffer, lang);
      await this.conn.sendMessage(message.room, { text: `*Result:*\n\n${text}` }, { quoted: context });
      setReactionStatus(this.conn, context, Status.Success);
    } catch (error) {
      logger.error(error);
      setReactionStatus(this.conn, context, Status.Error);
    }
  }
}
