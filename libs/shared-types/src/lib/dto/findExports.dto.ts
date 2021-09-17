import { IsString, Matches } from 'class-validator';

export class FindExportDto {
  @IsString()
  @Matches(/D([0-9])+/g)
  exportCode: string;
}
