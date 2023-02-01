import axios from 'axios';

import { env } from '~/config';

const ENDPOINT = 'https://text-translator2.p.rapidapi.com';

type TranslateResult = {
  data: {
    translatedText: string;
    detectedSourceLanguage: {
      code: string; // language code
      name: string;
    };
  };
};

export async function translate(text: string, { target, source }: { target: string; source?: string }) {
  const encodedParams = new URLSearchParams();
  encodedParams.append('source_language', source || 'auto');
  encodedParams.append('target_language', target);
  encodedParams.append('text', text);

  const result = await axios<TranslateResult>(`${ENDPOINT}/translate`, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'X-RapidAPI-Host': 'text-translator2.p.rapidapi.com',
      'X-RapidAPI-Key': env.RAPID_API_KEY,
    },
    data: encodedParams,
  });

  return result.data.data;
}

export type Language = { code: string; name: string };

type LanguageResult = {
  data: {
    languages: Language[];
  };
};

export async function getLanguages() {
  const result = await axios<LanguageResult>(`${ENDPOINT}/getLanguages`, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Host': 'text-translator2.p.rapidapi.com',
      'X-RapidAPI-Key': env.RAPID_API_KEY,
    },
  });
  return result.data.data.languages;
}
