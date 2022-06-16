import { IsIn, IsString } from 'class-validator';

export class ChangeReturnStatusDto {
  @IsString()
  return_code: string;

  @IsIn(['request', 'ing', 'complete'])
  status: 'request' | 'ing' | 'complete';
}
