import { Broadcaster, BroadcasterAddress } from '.prisma/client';

export type BroadcasterRes = Broadcaster & {
  broadcasterAddress: BroadcasterAddress;
};
