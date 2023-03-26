import { proto } from '@adiwajshing/baileys';

import { config } from '~/config';
import { Command } from '~/commands';
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
    if (!message.isOwner && !config.isActive) return;

    for (const command of this.commands) {
      const triggered = !message.command && command.trigger && message.subConversation.startsWith(command.trigger);
      if (command.keywords.includes(message.command ?? '') || triggered) {
        logger.info(
          `[${command.title}]-[${config.prefix}${message.command}]: From "${message.from}", in room: "${message.room}"`
        );
        command.execute(context, message);
        break;
      }
    }
  }
}
