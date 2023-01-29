import axios from 'axios';

const WAIFU_RANDOM_ENDPOINT = 'https://api.waifu.im/search';
const WAIFU_TAGS_ENDPOINT = 'https://api.waifu.im/tags';

type Waifu = {
  url: string;
  tags: {
    name: string;
  }[];
};

export async function waifuTags() {
  const result = await axios<{ versatile: string[]; nsfw: string[] }>(WAIFU_TAGS_ENDPOINT);
  return result.data;
}

export async function waifu(query?: string) {
  const result = await axios<{ images: Waifu[] }>(WAIFU_RANDOM_ENDPOINT + `?included_tags=${query || 'waifu'}`);
  return result.data.images[0] ?? null;
}
