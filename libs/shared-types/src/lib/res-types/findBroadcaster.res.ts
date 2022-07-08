import { Exclude } from 'class-transformer';
import { Broadcaster, BroadcasterAddress, BroadcasterContacts } from '.prisma/client';

export class BroadcasterRes implements Broadcaster {
  id: number;
  email: string;
  userName: string;
  userNickname: string;
  overlayUrl: string;
  createDate: Date;
  deleteFlag: boolean;
  @Exclude() password: string;
  avatar: string;
  agreementFlag: boolean;
  inactiveFlag: boolean;
  broadcasterAddress: BroadcasterAddress;
  broadcasterContacts: BroadcasterContacts[];

  constructor(partial: Partial<BroadcasterRes>) {
    return Object.assign(this, partial);
  }
}
