import axios from 'axios';

import { env } from '~/config';

const ENDPOINT = 'https://tldrthis.p.rapidapi.com/v1/model/abstractive';

type Result = {
  summary: string[];
  article_title: string;
  article_authors: string[];
  article_image: string;
  article_pub_date: string;
  article_url: string;
};

type TLDRArticle = {
  title: string;
  url: string;
  summary: string;
  image: string;
  date: string;
  authors: string[];
};

type TLDRText = {
  summary: string;
};

export async function getTLDRFromURL(url: string): Promise<TLDRArticle> {
  const result = await axios<Result>(`${ENDPOINT}/summarize-url/`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Host': 'tldrthis.p.rapidapi.com',
      'X-RapidAPI-Key': env.RAPID_API_KEY,
    },
    data: {
      url,
      min_length: 100,
      max_length: 200,
      is_detailed: false,
    },
  });

  return {
    title: result.data.article_title,
    url: result.data.article_url,
    summary: result.data.summary[0],
    image: result.data.article_image,
    date: result.data.article_pub_date,
    authors: result.data.article_authors,
  };
}

export async function getTLDRFromText(text: string): Promise<TLDRText> {
  const result = await axios<{ summary: string }>(`${ENDPOINT}/summarize-text/`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Host': 'tldrthis.p.rapidapi.com',
      'X-RapidAPI-Key': env.RAPID_API_KEY,
    },
    data: {
      text,
      min_length: 100,
      max_length: 200,
      is_detailed: false,
    },
  });

  return {
    summary: result.data.summary,
  };
}
