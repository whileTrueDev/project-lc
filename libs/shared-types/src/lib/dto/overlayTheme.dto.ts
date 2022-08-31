import { IsJSON, IsOptional, IsString } from 'class-validator';

export class CreateOverlayThemeDto {
  @IsString()
  name: string;

  @IsString()
  key: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsJSON()
  data: string;
}
