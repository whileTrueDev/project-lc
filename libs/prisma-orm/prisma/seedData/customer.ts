import { Customer } from '@prisma/client';
import { COMMON_DUMMY_PASSWORD } from './dummyData';

export const dummyCustomer: Customer = {
  id: 1,
  name: '테스트소비자',
  password: COMMON_DUMMY_PASSWORD,
  email: 'testcustomer@gmail.com',
  nickname: '테스트소비자nick',
  phone: '010-1234-5678',
  createDate: new Date('2022-04-18T02:49:51.674Z'),
  gender: 'unknown',
  birthDate: null,
  agreementFlag: false,
  inactiveFlag: false,
};
