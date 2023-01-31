import { WASocket } from '@adiwajshing/baileys';

import { config } from '~/config';
import { Command } from '~/commands';
import { Context, Message } from '~/types';
import { logger } from '~/logger';
import { setReactionStatus, Status } from '~/utilities/reaction-status';
import { getLinkPreview } from '~/libs/link-preview';

export class LinkPreviewCommand implements Command {
  readonly title = 'Link Preview';
  readonly keywords: string[];
  readonly usage: string;
  readonly description: string;

  constructor(readonly conn: WASocket) {
    this.keywords = ['link-preview', 'preview', 'pv'];
    this.usage = `${config.prefix}preview <url (not required)>`;
    this.description = 'Fetch url preview from url, also can with reply message';
  }

  async execute(context: Context, message: Message) {
    try {
      await setReactionStatus(this.conn, context, Status.Loading);
      const token = message.conversation || message.quotedMessage?.conversation || '';
      const urlRegex = /(http|https|ftp):\/\/(\S*)/;
      const url = token.match(urlRegex)?.[0];

      if (!url) {
        await this.conn.sendMessage(message.room, { text: '*Please provide a url!*' }, { quoted: context });
        setReactionStatus(this.conn, context, Status.NotUnderstood);
        return;
      }
      const result = await getLinkPreview(url);
      if (result.error !== undefined) {
        await this.conn.sendMessage(message.room, { text: '*Invalid url!*' }, { quoted: context });
        setReactionStatus(this.conn, context, Status.NotUnderstood);
        return;
      }

      await this.conn.sendMessage(
        message.room,
        {
          caption: `*Link Preview!*\n\n*Title:* _${result.title}_\n\n*URL:* _${result.url}_\n\n*Description:* _${result.description}_`,
          image: { url: result.image },
        },
        { quoted: context }
      );
      setReactionStatus(this.conn, context, Status.Success);
    } catch (error) {
      logger.error(error);
      setReactionStatus(this.conn, context, Status.Error);
    }
  }
}
