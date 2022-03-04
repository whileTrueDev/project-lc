import { IsEnum } from 'class-validator';
import {
  PrivacyApproachHistoryActionType,
  PrivacyApproachHistoryInfoType,
} from '@prisma/client';

export class PrivacyApproachHistoryDto {
  @IsEnum(PrivacyApproachHistoryInfoType)
  infoType: PrivacyApproachHistoryInfoType;

  @IsEnum(PrivacyApproachHistoryActionType)
  actionType: PrivacyApproachHistoryActionType;
}
