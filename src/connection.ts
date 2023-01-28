import pino from 'pino';
import makeWASocket, { ConnectionState, DisconnectReason, useMultiFileAuthState } from '@adiwajshing/baileys';

import { config } from '~/config';
import { logger } from '~/logger';

type ConnectionUpdate = Partial<ConnectionState>;

export async function createConnection() {
  const { state: authState, saveCreds } = await useMultiFileAuthState('credentials');

  const conn = makeWASocket({
    auth: authState,
    printQRInTerminal: true,
    logger: pino({ level: 'error' }),
  });

  conn.ev.on('creds.update', saveCreds);
  conn.ev.on('connection.update', (update: ConnectionUpdate) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const lastDisconnectError = lastDisconnect?.error as { output?: { statusCode: number } };
      const shouldReconnect = lastDisconnectError?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) createConnection();
    } else if (connection === 'open') {
      config.botId = conn.authState.creds.me?.id.replace(/:[0-9]/g, '');
      logger.info('Connection ready to use');
    }
  });

  return conn;
}
