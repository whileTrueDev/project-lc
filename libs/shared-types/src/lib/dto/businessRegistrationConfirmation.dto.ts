import { IsString, IsNumber } from 'class-validator';

// 검수 상태 TYPE
export enum BusinessRegistrationStatus {
  WAITING = 'waiting',
  CONFIRMED = 'confirmed',
  REJECTED = 'rejected',
}

// 승인 DTO
export class BusinessRegistrationConfirmationDto {
  @IsNumber()
  id: number;
}

// 반려 DTO
export class BusinessRegistrationRejectionDto {
  @IsNumber()
  id: number;

  @IsString()
  rejectionReason: string;
}
