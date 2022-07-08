import { GoodsInformationSubject } from '@prisma/client';

export interface GoodsInformationSubjectRes extends GoodsInformationSubject {
  items: Record<string, string>;
}
