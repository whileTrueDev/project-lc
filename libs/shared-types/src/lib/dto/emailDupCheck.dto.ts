import { IsEmail } from 'class-validator';

export class EmailDupCheckDto {
  @IsEmail()
  email: string;
}
