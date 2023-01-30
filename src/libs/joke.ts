import axios from 'axios';

const ENDPOINT = 'https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,racist,sexist,explicit';

type Type = 'twopart' | 'single';
type Result = {
  category: string;
  type: Type;
  // setup and delivery exist when type is 'twopart'
  setup?: string;
  delivery?: string;
  // joke exist when type is 'single'
  joke?: string;
};

export async function getRandomJoke() {
  const { data } = await axios<Result>(ENDPOINT);
  const joke = data.joke ?? `${data.setup}\n\n${data.delivery}`;
  return { joke, category: data.category };
}
