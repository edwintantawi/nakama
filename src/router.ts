import { proto } from '@adiwajshing/baileys';

import { config } from '~/config';
import { ChatAICommand, Command } from '~/commands';
import { pasrseMessage } from '~/utilities';
import { logger } from '~/logger';

export class Router {
  commands: Command[] = [];

  register(command: Command) {
    this.commands.push(command);
  }

  observe(context: proto.IWebMessageInfo) {
    const message = pasrseMessage(context);
    if (message.isFromMe) return;

    for (const command of this.commands) {
      const allowChatAI =
        !message.command &&
        message.quotedMessage?.isFromMe &&
        message.quotedMessage.conversation !== '' &&
        command instanceof ChatAICommand;

      if (command.keywords.includes(message.command ?? '') || allowChatAI) {
        logger.info(
          `[${command.title}]-[${config.prefix}${message.command}]: From "${message.from}", in room: "${message.room}"`
        );
        command.execute(context, message);
        break;
      }
    }
  }
}
