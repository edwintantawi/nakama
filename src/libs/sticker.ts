import { DownloadableMessage, downloadContentFromMessage } from '@adiwajshing/baileys';
import WAStickerFormatter, { Categories, StickerTypes } from 'wa-sticker-formatter';

interface stickerOptions {
  id?: string;
  pack?: string;
  author?: string;
  type?: StickerTypes;
  categories: Categories[];
  quality?: number;
}

export async function createSticker(target: DownloadableMessage, options: stickerOptions) {
  let buffer = Buffer.from([]);
  const stream = await downloadContentFromMessage(target, 'image');

  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);
  }

  const result = new WAStickerFormatter(buffer, options);

  return await result.toBuffer();
}
