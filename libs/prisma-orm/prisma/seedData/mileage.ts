import { CustomerMileage, CustomerMileageLog } from '@prisma/client';

export const dummyMileage: CustomerMileage = {
  id: 1,
  customerId: 1,
  mileage: 3000,
};

export const dummyMileageLog: CustomerMileageLog = {
  id: 1,
  customerId: 1,
  amount: 3000,
  actionType: 'earn',
  createDate: new Date(),
  reason: '신규가입',
  orderId: null,
  reviewId: null,
};
