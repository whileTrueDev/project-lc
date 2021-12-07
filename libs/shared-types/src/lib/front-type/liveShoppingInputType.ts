export interface LiveShoppingInput {
  contactId: number;
  email: string;
  firstNumber: string;
  goods_id: number | null;
  phoneNumber: string;
  requests: string;
  secondNumber: string;
  setDefault: boolean;
  thirdNumber: string;
  useContact: string;

  // 희망 진행 기간
  desiredPeriod: string;
  // 희망 판매 수수료
  desiredCommission: string;
}
