import { IsJSON, IsString } from 'class-validator';

export class GoodsInformationSubjectDto {
  @IsString()
  subject: string;

  @IsJSON()
  items: string;
}
