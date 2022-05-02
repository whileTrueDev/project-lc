import { Broadcaster, BroadcasterAddress, BroadcasterContacts } from '.prisma/client';

export type BroadcasterRes = Broadcaster & {
  broadcasterAddress: BroadcasterAddress;
  broadcasterContacts: BroadcasterContacts[];
};
