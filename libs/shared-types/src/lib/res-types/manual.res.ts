import { Manual } from '@prisma/client';

export type AdminManualListRes = Manual[];

export type ManualListRes = Omit<Manual, 'contents' | 'createDate' | 'updateDate'>[];
