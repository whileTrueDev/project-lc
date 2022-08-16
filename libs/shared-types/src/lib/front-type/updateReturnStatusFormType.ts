import { Return } from '@prisma/client';

export interface OrderRetusnStatusForm {
  status: Return['status'];
  rejectReason?: Return['rejectReason'];
}
