import { IsJSON, IsString } from 'class-validator';

export class CreateOverlayThemeDto {
  @IsString()
  name: string;

  @IsString()
  key: string;

  @IsString()
  category: string;

  @IsJSON()
  data: string;
}
