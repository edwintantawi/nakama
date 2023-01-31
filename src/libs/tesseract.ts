import { createWorker } from 'tesseract.js';

export type Language = 'ind' | 'eng' | 'chi_sim' | 'chi_tra';

export async function tesseract(image: Buffer, lang: Language): Promise<string> {
  const worker = await createWorker();

  await worker.loadLanguage('eng+ind+chi_tra+chi_sim');
  await worker.initialize(lang);
  const {
    data: { text },
  } = await worker.recognize(image);
  await worker.terminate();

  return text;
}
