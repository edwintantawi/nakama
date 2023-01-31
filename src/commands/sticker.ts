import { DownloadableMessage, WASocket } from '@adiwajshing/baileys';
import { StickerTypes } from 'wa-sticker-formatter/dist';

import { config } from '~/config';
import { Command } from '~/commands';
import { Context, Message } from '~/types';
import { logger } from '~/logger';
import { setReactionStatus, Status } from '~/utilities/reaction-status';
import { createSticker } from '~/libs/sticker';

export class StickerCommand implements Command {
  readonly title = 'Sticker';
  readonly keywords: string[];
  readonly usage: string;
  readonly description: string;

  constructor(readonly conn: WASocket) {
    this.keywords = ['sticker'];
    this.usage = `${config.prefix}sticker <pack name (not required)> <author name (not required)>`;
    this.description = 'Create sticker an sticker';
  }

  async execute(context: Context, message: Message) {
    try {
      await setReactionStatus(this.conn, context, Status.Loading);
      const target = message.image;

      if (!target) {
        await this.conn.sendMessage(message.room, { text: '*Require an image!*' }, { quoted: context });
        setReactionStatus(this.conn, context, Status.NotUnderstood);
        return;
      }

      const [pack = '', author = ''] = message.conversation.split(' ');

      const buffer = await createSticker(target as DownloadableMessage, {
        pack, // The pack name
        author, // The author name
        type: StickerTypes.FULL, // The sticker type
        categories: [], // The sticker category
        id: message.id, // The sticker id
        quality: 40, // The quality of the output file
      });

      if (!buffer) {
        throw new Error('Failed to create sticker');
      }

      await this.conn.sendMessage(
        message.room,
        {
          sticker: buffer,
          mimetype: 'image/webp',
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
