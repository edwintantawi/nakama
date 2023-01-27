import 'dotenv/config';

import { createConnection } from '~/connection';
import { PingCommand, AICommand } from '~/commands';
import { Router } from '~/router';

async function start() {
  const conn = await createConnection();
  const router = new Router();

  const pingCommand = new PingCommand(conn);
  const aiCommand = new AICommand(conn);

  router.register(pingCommand);
  router.register(aiCommand);

  conn.ev.on('messages.upsert', ({ messages }) => {
    const context = messages[0];
    router.observe(context);
  });
}

start();
