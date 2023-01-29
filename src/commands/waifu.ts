import { WASocket } from '@adiwajshing/baileys';

import { config } from '~/config';
import { Command } from '~/commands';
import { Context, Message } from '~/types';
import { waifu, waifuTags } from '~/libs/waifu';

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
      const tokens = message.conversation.split(' ');
      let keyword = tokens[0];
      const option = tokens[1];
      const isViewOne = option === 'once' || keyword == 'once';
      if (keyword === 'once') keyword = '';

      const tags = await waifuTags();
      let isPrivate = false;

      if (keyword === 'tags') {
        this.conn.sendMessage(
          message.room,
          {
            text: `*Available tags*:\n[ _default is waifu_ ]\n\n- ${tags.versatile.join('\n- ')}`,
          },
          { quoted: context }
        );
        return;
      }

      const isValidTag = tags.versatile.includes(keyword) || tags.nsfw.includes(keyword);
      if (keyword && !isValidTag) {
        this.conn.sendMessage(
          message.room,
          {
            text: `*Tag not valid*.\n\n_Check available tags with_: *tags*`,
          },
          { quoted: context }
        );
        return;
      }

      if (tags.nsfw.includes(keyword)) {
        isPrivate = true;
      }

      this.conn.sendMessage(
        message.room,
        { text: isPrivate ? 'Wait a moment...\n_I will send with you in personal chat._' : 'Wait a moment...' },
        { quoted: context }
      );
      const result = await waifu(keyword);
      this.conn.sendMessage(
        isPrivate ? message.from : message.room,
        {
          image: { url: result.url },
          caption: `Tags: _${result.tags.map((tag) => tag.name).join(', ')}_`,
          viewOnce: isViewOne,
        },
        { quoted: context }
      );
    } catch (error) {
      this.conn.sendMessage(message.room, { text: 'There is something wrong...' }, { quoted: context });
    }
  }
}
