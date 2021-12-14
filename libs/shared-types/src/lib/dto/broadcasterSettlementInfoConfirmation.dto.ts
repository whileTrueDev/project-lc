import { IsString, IsNumber, IsOptional, IsIn } from 'class-validator';
import { BusinessRegistrationStatus } from '@prisma/client';

// 방송인 정산정보 검수 변경 DTO
export class BroadcasterSettlementInfoConfirmationDto {
  @IsNumber()
  id: number;

  @IsIn([
    BusinessRegistrationStatus.waiting,
    BusinessRegistrationStatus.confirmed,
    BusinessRegistrationStatus.rejected,
  ])
  status: BusinessRegistrationStatus;

  @IsString()
  @IsOptional()
  rejectionReason?: string;
}
