import { WASocket } from '@adiwajshing/baileys';

import { Context, Message } from '~/types';

export interface Command {
  readonly conn: WASocket;
  readonly title: string;
  readonly usage: string;
  readonly description: string;
  readonly keywords: string[];
  readonly execute: (context: Context, message: Message) => void;
}
