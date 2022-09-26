import { StreamingService } from '@prisma/client';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class CreateKkshowLiveEmbedDto {
  @IsEnum(StreamingService) streamingService: StreamingService;
  @IsString() UID: string;
  @IsNumber() liveShoppingId: number;
}
