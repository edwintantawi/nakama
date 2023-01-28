import 'dotenv/config';

import { createConnection } from '~/connection';
import { PingCommand, ChatAICommand, ImageAICommand } from '~/commands';
import { Router } from '~/router';

async function start() {
  const conn = await createConnection();
  const router = new Router();

  const pingCommand = new PingCommand(conn);
  const aiCommand = new ChatAICommand(conn);
  const imageCommand = new ImageAICommand(conn);

  router.register(pingCommand);
  router.register(aiCommand);
  router.register(imageCommand);

  conn.ev.on('messages.upsert', ({ messages }) => {
    const context = messages[0];
    router.observe(context);
  });
}

start();
