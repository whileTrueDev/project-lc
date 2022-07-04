export interface Bank {
  bankName: string;
  bankCode: string;
  bankCodeKr: string;
  bankCodeEn: string;
}

export const banks: Bank[] = [
  {
    bankCodeKr: '경남',
    bankCodeEn: 'KYONGNAMBANK',
    bankCode: '39',
    bankName: '경남은행',
  },
  { bankCodeKr: '광주', bankCodeEn: 'GWANGJUBANK', bankCode: '34', bankName: '광주은행' },
  { bankCodeKr: '국민', bankCodeEn: 'KOOKMIN', bankCode: '06', bankName: 'KB국민은행' },
  { bankCodeKr: '기업', bankCodeEn: 'IBK', bankCode: '03', bankName: 'IBK기업은행' },
  { bankCodeKr: '농협', bankCodeEn: 'NONGHYEOP', bankCode: '11', bankName: 'NH농협은행' },
  {
    bankCodeKr: '단위농협',
    bankCodeEn: 'LOCALNONGHYEOP',
    bankCode: '12',
    bankName: '단위농협',
  },
  {
    bankCodeKr: '대구',
    bankCodeEn: 'DAEGUBANK',
    bankCode: '31',
    bankName: 'DGB대구은행',
  },
  { bankCodeKr: '부산', bankCodeEn: 'BUSANBANK', bankCode: '32', bankName: '부산은행' },
  { bankCodeKr: '산업', bankCodeEn: 'KDBBANK', bankCode: '02', bankName: 'KDB산업은행' },
  { bankCodeKr: '새마을', bankCodeEn: 'SAEMAUL', bankCode: '45', bankName: '새마을금고' },
  { bankCodeKr: '산림', bankCodeEn: 'SANLIM', bankCode: '64', bankName: '산림조합' },
  { bankCodeKr: '수협', bankCodeEn: 'SUHYEOP', bankCode: '07', bankName: 'Sh수협은행' },
  { bankCodeKr: '신한', bankCodeEn: 'SHINHAN', bankCode: '88', bankName: '신한은행' },
  { bankCodeKr: '신협', bankCodeEn: 'SHINHYEOP', bankCode: '48', bankName: '신협' },
  { bankCodeKr: '씨티', bankCodeEn: 'CITI', bankCode: '27', bankName: '씨티은행' },
  { bankCodeKr: '우리', bankCodeEn: 'WOORI', bankCode: '20', bankName: '우리은행' },
  {
    bankCodeKr: '우체국',
    bankCodeEn: 'POST',
    bankCode: '71',
    bankName: '우체국예금보험',
  },
  {
    bankCodeKr: '저축',
    bankCodeEn: 'SAVINGBANK',
    bankCode: '50',
    bankName: '저축은행중앙회',
  },
  { bankCodeKr: '전북', bankCodeEn: 'JEONBUKBANK', bankCode: '37', bankName: '전북은행' },
  { bankCodeKr: '제주', bankCodeEn: 'JEJUBANK', bankCode: '35', bankName: '제주은행' },
  {
    bankCodeKr: '카카오',
    bankCodeEn: 'KAKAOBANK',
    bankCode: '90',
    bankName: '카카오뱅크',
  },
  { bankCodeKr: '케이', bankCodeEn: 'KBANK', bankCode: '89', bankName: '케이뱅크' },
  { bankCodeKr: '토스', bankCodeEn: 'TOSSBANK', bankCode: '92', bankName: '토스뱅크' },
  { bankCodeKr: '하나', bankCodeEn: 'HANA', bankCode: '81', bankName: '하나은행' },
  { bankCodeKr: 'SC제일', bankCodeEn: 'SC', bankCode: '23', bankName: 'SC제일은행' },
  { bankCodeKr: '-', bankCodeEn: 'HSBC', bankCode: '54', bankName: '홍콩상하이은행' },
];
