import pino from 'pino';
import makeWASocket, { ConnectionState, DisconnectReason, useMultiFileAuthState } from '@adiwajshing/baileys';

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
  conn.ev.on('connection.update', handleConnectionUpdate);

  return conn;
}

function handleConnectionUpdate(update: ConnectionUpdate) {
  const { connection, lastDisconnect } = update;
  if (connection === 'close') {
    const lastDisconnectError = lastDisconnect?.error as { output?: { statusCode: number } };
    const shouldReconnect = lastDisconnectError?.output?.statusCode !== DisconnectReason.loggedOut;
    if (shouldReconnect) createConnection();
  } else if (connection === 'open') {
    logger.info('Connection ready to use');
  }
}
