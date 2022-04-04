import { IsString } from 'class-validator';

export class SearchKeyword {
  @IsString()
  keyword: string;
}
