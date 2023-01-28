import { proto } from '@adiwajshing/baileys';
import Long from 'long';

export type Context = proto.IWebMessageInfo;

export type Message = {
  command: string | null;
  hasCommand: boolean;
  id: string;
  room: string;
  isFromMe: boolean;
  from: string;
  name: string;
  timestamp: number | Long;
  conversation: string;
  subConversation: string;
  hasImage: boolean;
  image: proto.Message.IImageMessage | null | undefined;
  quotedMessage?: QuotedMessage;
};

export type QuotedMessage = {
  conversation: string;
  isFromMe: boolean;
};
