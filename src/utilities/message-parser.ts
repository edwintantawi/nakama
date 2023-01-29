import { proto } from '@adiwajshing/baileys';

import { parseCommand } from '~/utilities';
import { Message } from '~/types';
import { config } from '~/config';

export function pasrseMessage(message: proto.IWebMessageInfo): Message {
  const text = message.message?.conversation;
  const replyText = message.message?.extendedTextMessage?.text;
  const quotedText = message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation;
  const quotedImageCaption = message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage?.caption;
  const imageCaption = message.message?.imageMessage?.caption;

  const textMessage = text || replyText || imageCaption || '';
  const textContext = quotedText || quotedImageCaption || '';

  const imageMessage = message.message?.imageMessage;
  const quotedImage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;

  const image = imageMessage || quotedImage;

  const quotedMessageImageCaption =
    message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage?.caption;
  const quotedMessageConversation =
    message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation || quotedMessageImageCaption || '';

  const { command, content: conversation } = parseCommand(textMessage);
  const { content: subConversation } = parseCommand(textContext);

  return {
    command,
    hasCommand: Boolean(command),
    id: message.key.id ?? '',
    room: message.key.remoteJid ?? '',
    isFromMe: message.key.fromMe ?? false,
    from: message.key.participant ?? '',
    name: message.pushName ?? 'unknown',
    timestamp: message.messageTimestamp ?? +new Date(),
    conversation,
    subConversation,
    hasImage: Boolean(image),
    image: image,
    quotedMessage: {
      conversation: quotedMessageConversation,
      isFromMe: message.message?.extendedTextMessage?.contextInfo?.participant === config.botId,
    },
  };
}
