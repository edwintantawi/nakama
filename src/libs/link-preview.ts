import axios from 'axios';

import { env } from '~/config';

const ENDPOINT = `http://api.linkpreview.net/?key=${env.LINK_PREVIEW_KEY}`;

type Result = {
  title: string;
  description: string;
  image: string;
  url: string;
  error: number;
};

export async function getLinkPreview(url: string): Promise<Result> {
  const result = await axios<Result>(`${ENDPOINT}&q=${url}`);
  return result.data;
}
