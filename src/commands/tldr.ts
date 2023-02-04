import { WASocket } from '@adiwajshing/baileys';

import { config } from '~/config';
import { Command } from '~/commands';
import { Context, Message } from '~/types';
import { logger } from '~/logger';
import { setReactionStatus, Status } from '~/utilities/reaction-status';
import { getTLDRFromText, getTLDRFromURL } from '~/libs/tldr-this';
import { extractLink } from '~/utilities/extract-link';

export class TLDRCommand implements Command {
  readonly title = 'TLDR';
  readonly keywords: string[];
  readonly usage: string;
  readonly description: string;

  constructor(readonly conn: WASocket) {
    this.keywords = ['tldr'];
    this.usage = `${config.prefix}tldr <url (not required)>`;
    this.description = 'TLDR an text or an article link, also can use with reply';
  }

  async execute(context: Context, message: Message) {
    try {
      await setReactionStatus(this.conn, context, Status.Loading);
      const content = message.conversation || message.quotedMessage?.conversation;

      if (!content) {
        await this.conn.sendMessage(message.room, { text: '*Please provide a content/text!*' }, { quoted: context });
        setReactionStatus(this.conn, context, Status.NotUnderstood);
        return;
      }

      const url = extractLink(content)[0];

      if (url === undefined) {
        const result = await getTLDRFromText(content);

        await this.conn.sendMessage(
          message.room,
          { text: `*TLDR;*\n\n*Summary:*\n${result.summary}` },
          { quoted: context }
        );
        setReactionStatus(this.conn, context, Status.Success);

        return;
      }

      const result = await getTLDRFromURL(url);
      await this.conn.sendMessage(
        message.room,
        {
          text: `*TLDR;*\n\n*Title:*\n${result.title}\n\n*Authors:*\n${result.authors.join(', ')}\n\n*Date:*\n${
            result.date
          }\n\n*URL:*\n${result.url}\n\n*Summary:*\n${result.summary}`,
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
