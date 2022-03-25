import { Manual, UserType } from '@prisma/client';

export type AdminManualListRes = Record<UserType, Manual[]>;
