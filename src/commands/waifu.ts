import { WASocket } from '@adiwajshing/baileys';

import { config } from '~/config';
import { Command } from '~/commands';
import { Context, Message } from '~/types';
import { waifu, waifuTags } from '~/libs/waifu';
import { logger } from '~/logger';
import { setReactionStatus, Status } from '~/utilities/reaction-status';

export class WaifuCommand implements Command {
  readonly title = 'Waifu';
  readonly keywords: string[];
  readonly usage: string;
  readonly description: string;

  constructor(readonly conn: WASocket) {
    this.keywords = ['w', 'wf', 'waifu'];
    this.usage = `${config.prefix}waifu`;
    this.description = 'Get waifu image';
  }

  async execute(context: Context, message: Message) {
    try {
      await setReactionStatus(this.conn, context, Status.Loading);

      const tokens = message.conversation.split(' ');
      let keyword = tokens[0];
      const option = tokens[1];
      const isViewOne = option === 'once' || keyword == 'once';
      if (keyword === 'once') keyword = '';

      const tags = await waifuTags();
      let isPrivate = false;

      if (keyword === 'tags') {
        await this.conn.sendMessage(
          message.room,
          {
            text: `*Available tags*:\n[ _default is waifu_ ]\n\n- ${tags.versatile.join('\n- ')}`,
          },
          { quoted: context }
        );
        setReactionStatus(this.conn, context, Status.Success);
        return;
      }

      const isValidTag = tags.versatile.includes(keyword) || tags.nsfw.includes(keyword);
      if (keyword && !isValidTag) {
        await setReactionStatus(this.conn, context, Status.NotUnderstood);
        this.conn.sendMessage(
          message.room,
          {
            text: `*Tag is not valid*.\n\n_Check available tags with_: *tags*`,
          },
          { quoted: context }
        );
        return;
      }

      if (tags.nsfw.includes(keyword)) {
        isPrivate = true;
      }

      const result = await waifu(keyword);
      await this.conn.sendMessage(
        isPrivate ? message.from : message.room,
        {
          image: { url: result.url },
          caption: `Tags: _${result.tags.map((tag) => tag.name).join(', ')}_`,
          viewOnce: isViewOne,
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
