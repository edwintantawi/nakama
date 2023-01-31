import 'dotenv/config';

import { createConnection } from '~/connection';
import {
  PingCommand,
  ChatAICommand,
  ImageAICommand,
  ReminderCommand,
  WaifuCommand,
  SaveCommand,
  SnapCommand,
  JokeCommand,
  SettingCommand,
  ManualCommand,
} from '~/commands';
import { Router } from '~/router';

async function start() {
  const conn = await createConnection();
  const router = new Router();

  const pingCommand = new PingCommand(conn);
  const aiCommand = new ChatAICommand(conn);
  const imageCommand = new ImageAICommand(conn);
  const reminderCommand = new ReminderCommand(conn);
  const waifuCommand = new WaifuCommand(conn);
  const saveCommand = new SaveCommand(conn);
  const snapCommand = new SnapCommand(conn);
  const jokeCommand = new JokeCommand(conn);
  const settingCommand = new SettingCommand(conn);
  const manualCommand = new ManualCommand(conn, [
    pingCommand,
    aiCommand,
    imageCommand,
    reminderCommand,
    waifuCommand,
    saveCommand,
    snapCommand,
    jokeCommand,
    settingCommand,
  ]);

  router.register(pingCommand);
  router.register(aiCommand);
  router.register(imageCommand);
  router.register(reminderCommand);
  router.register(waifuCommand);
  router.register(saveCommand);
  router.register(snapCommand);
  router.register(jokeCommand);
  router.register(settingCommand);
  router.register(manualCommand);

  conn.ev.on('messages.upsert', ({ messages }) => {
    const context = messages[0];
    router.observe(context);
  });
}

start().catch(() => start());
