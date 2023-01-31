import { WASocket } from '@adiwajshing/baileys';

import { config } from '~/config';
import { Command } from '~/commands';
import { Context, Message } from '~/types';
import { logger } from '~/logger';
import { setReactionStatus, Status } from '~/utilities/reaction-status';

export class ManualCommand implements Command {
  readonly title = 'Manual';
  readonly keywords: string[];
  readonly usage: string;
  readonly description: string;

  constructor(readonly conn: WASocket, readonly commands: Command[]) {
    this.keywords = ['manual', 'man'];
    this.usage = `${config.prefix}manual <command keyword (not required)>`;
    this.description = 'Show the manual of the command, or show all list of command when no keyword is provided';
    this.commands.push(this);
  }

  async execute(context: Context, message: Message) {
    try {
      await setReactionStatus(this.conn, context, Status.Loading);
      const [token] = message.conversation.split(' ');

      if (token === '') {
        await this.conn.sendMessage(
          message.room,
          {
            text: `*Manual Page*\n\n${this.commands
              .map((command) => {
                return `- *${command.title}* => [ \`\`\`${command.keywords.join(', ')}\`\`\` ]`;
              })
              .join('\n')}`,
          },
          { quoted: context }
        );
        setReactionStatus(this.conn, context, Status.Success);
        return;
      }

      const command = this.commands.find((command) => command.keywords.includes(token));
      if (command === undefined) {
        await this.conn.sendMessage(message.room, { text: `*No manual entry for ${token}!*` }, { quoted: context });
        setReactionStatus(this.conn, context, Status.Error);
        return;
      }

      await this.conn.sendMessage(
        message.room,
        {
          text: `*${command.title} Manual* [ \`\`\`${command.keywords.join(', ')}\`\`\` ]\n_${
            command.description
          }_\n\nUsage: _${command.usage}_`,
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
