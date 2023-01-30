import { WASocket } from '@adiwajshing/baileys';

import { Context } from '~/types';

export enum Status {
  Loading = '⏳',
  NotUnderstood = '❓',
  Error = '🚫',
  Success = '✅',
}

export async function setReactionStatus(conn: WASocket, context: Context, status: Status) {
  return conn.sendMessage(context.key.remoteJid ?? '', { react: { text: status, key: context.key } });
}
