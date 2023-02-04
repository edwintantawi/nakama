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
  ImageToTextCommand,
  LinkPreviewCommand,
  StickerCommand,
  TranslateCommand,
  HTTPStatusCodeCommand,
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
  const imageToTextCommand = new ImageToTextCommand(conn);
  const linkPreviewCommand = new LinkPreviewCommand(conn);
  const stickerCommand = new StickerCommand(conn);
  const translateCommand = new TranslateCommand(conn);
  const httpStatusCodeCommand = new HTTPStatusCodeCommand(conn);
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
    imageToTextCommand,
    linkPreviewCommand,
    stickerCommand,
    translateCommand,
    httpStatusCodeCommand,
  ]);

  router.register(manualCommand);
  router.register(pingCommand);
  router.register(aiCommand);
  router.register(imageCommand);
  router.register(reminderCommand);
  router.register(waifuCommand);
  router.register(saveCommand);
  router.register(snapCommand);
  router.register(jokeCommand);
  router.register(settingCommand);
  router.register(imageToTextCommand);
  router.register(linkPreviewCommand);
  router.register(stickerCommand);
  router.register(translateCommand);
  router.register(httpStatusCodeCommand);

  conn.ev.on('messages.upsert', ({ messages }) => {
    const context = messages[0];
    router.observe(context);
  });
}

start().catch(() => start());
