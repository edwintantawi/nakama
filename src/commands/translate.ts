import { WASocket } from '@adiwajshing/baileys';

import { config } from '~/config';
import { Command } from '~/commands';
import { Context, Message } from '~/types';
import { logger } from '~/logger';
import { setReactionStatus, Status } from '~/utilities/reaction-status';
import { translate, getLanguages, Language } from '~/libs/translator';

export class TranslateCommand implements Command {
  readonly title = 'Translate';
  readonly keywords: string[];
  readonly usage: string;
  readonly description: string;

  languages: Language[] = [];

  constructor(readonly conn: WASocket) {
    this.keywords = ['translate', 't'];
    this.usage = `${config.prefix}translate <target language (id|en|...)> <text (not required)>`;
    this.description =
      'Translate text to other languages, also supports auto-detecting language, and can be use as a reply to a message.';

    getLanguages().then((languages) => {
      this.languages = languages;
    });
  }

  async execute(context: Context, message: Message) {
    try {
      await setReactionStatus(this.conn, context, Status.Loading);
      const [target, ...tokens] = message.conversation.split(' ');
      let text = tokens.join(' ');
      if (!text.length) {
        text = message.subConversation;
      }

      const targetLanguage = this.languages.find((language) => language.code === target);
      if (targetLanguage === undefined) {
        await this.conn.sendMessage(message.room, { text: '*Target language is not valid!*' }, { quoted: context });
        setReactionStatus(this.conn, context, Status.NotUnderstood);
        return;
      }

      if (!text) {
        await this.conn.sendMessage(
          message.room,
          { text: '*Please provide a text to translate!*' },
          { quoted: context }
        );
        setReactionStatus(this.conn, context, Status.NotUnderstood);
        return;
      }

      const result = await translate(text, { target });

      await this.conn.sendMessage(
        message.room,
        {
          text: `*Result:*\n\n*From ( _${result.detectedSourceLanguage.name}_ ):*\n${text}\n\n*To ( _${targetLanguage.name}_ ):*\n${result.translatedText}`,
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
