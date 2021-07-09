import { nanoid } from 'nanoid';
import DatabaseModel, { DatabaseModelData } from './DatabaseModel';

export const CHATS_STORENAME = 'chats';
export const CHATS_MESSAGES_STORENAME = 'messages';

export interface ChatMessageData extends DatabaseModelData {
  created_by: string;
  message: string;
  chat_id: string;
}

export interface ChatData extends DatabaseModelData {
  members: string[];
  workspace_id: string;
  created_by: string;
  title: string;
}

export class Chat extends DatabaseModel implements ChatData {
  members: string[];
  workspace_id: string;
  id: string;
  last_modified: number;
  created_at: number;
  created_by: string;
  title: string;

  constructor(
    workspaceId: string,
    members: { label: string; value: string }[] | null,
    userId: string,
    data?: ChatData
  ) {
    super();
    this.id = nanoid();
    this.workspace_id = workspaceId;
    this.members = data?.members || members?.map((m) => m.value) || [];
    this.title = data?.title || members?.map((m) => m.label).join(', ') || '';
    this.last_modified = data?.last_modified || Date.now();
    this.created_at = data?.created_at || Date.now();
    this.created_by = userId;
    if (!this.members) throw 'error no chat members found';
  }

  static deserialize(chat: ChatData): Chat {
    return new Chat(chat.workspace_id, null, chat.created_by, chat);
  }

  serialize(): ChatData {
    return {
      id: this.id,
      last_modified: this.last_modified,
      created_at: this.created_at,
      workspace_id: this.workspace_id,
      members: this.members,
      title: this.title,
      created_by: this.created_by,
    };
  }
}

export default class ChatMessage
  extends DatabaseModel
  implements ChatMessageData
{
  id: string;
  last_modified: number;
  created_at: number;
  created_by: string;
  message: string;
  chat_id: string;

  constructor(message: string, chatId: string, userId: string) {
    super();
    this.id = nanoid();
    this.created_at = Date.now();
    this.last_modified = Date.now();
    this.created_by = userId;
    this.message = message;
    this.chat_id = chatId;
  }

  serialize(): ChatMessageData {
    return {
      id: this.id,
      last_modified: this.last_modified,
      created_at: this.created_at,
      created_by: this.created_by,
      message: this.message,
      chat_id: this.chat_id,
    };
  }
}
