import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class BroadcasterContactDto {
  @IsInt() broadcasterId: number;
  @IsString() name: string;
  @IsString() email: string;
  @IsString() phoneNumber: string;
  @IsOptional() @IsBoolean() isDefault: boolean;
}
