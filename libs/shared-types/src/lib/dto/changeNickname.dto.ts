import { IsString } from 'class-validator';

export class ChangeNicknameDto {
  @IsString() nickname: string;
}
