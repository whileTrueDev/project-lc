import { Prisma } from '@prisma/client';
import { IsJSON } from 'class-validator';

export class KkshowMainDto {
  @IsJSON()
  carousel: Prisma.JsonArray;

  @IsJSON()
  trailer: Prisma.JsonObject;

  @IsJSON()
  bestLive: Prisma.JsonArray;

  @IsJSON()
  bestBroadcaster: Prisma.JsonArray;
}
