import { PrismaClient } from '@prisma/client';

// https://github.com/prisma/prisma/issues/11940
type IgnorePrismaBuiltins<S extends string> = string extends S
  ? string
  : S extends ''
  ? S
  : S extends `$${infer T}`
  ? never
  : S;

export type PrismaModelName = IgnorePrismaBuiltins<keyof PrismaClient>;

// 백엔드에서  { key : count, key1: count, ... } 이런식으로 넘기고싶다

// {adminSidebarMenuList.href : 새로운 데이터 개수} 형태
export type AdminNotiCountRes = Record<string, number>;
