import { AxiosError } from 'axios';
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
      this.conn.sendMessage(message.room, { text: 'Wait a moment...' }, { quoted: context });

      const result = await waifu(message.conversation);
      this.conn.sendMessage(
        message.room,
        { image: { url: result.url }, caption: `Tags: _${result.tags.map((tag) => tag.name).join(', ')}_` },
        { quoted: context }
      );
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        const tags = await waifuTags();
        this.conn.sendMessage(
          message.room,
          { text: `*Tag not valid*.\n\n_Available tags_:\n- ${tags.join('\n- ')}` },
          { quoted: context }
        );
        return;
      }

      console.log(error);
      this.conn.sendMessage(message.room, { text: 'There is something wrong...' }, { quoted: context });
    }
  }
}
