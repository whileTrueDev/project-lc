import { Manual } from '@prisma/client';

export type AdminManualListRes = Manual[];

export type ManualWithoutContents = Omit<
  Manual,
  'contents' | 'createDate' | 'updateDate' | 'linkPageRouterPath'
>;
export type ManualListRes = ManualWithoutContents[];
