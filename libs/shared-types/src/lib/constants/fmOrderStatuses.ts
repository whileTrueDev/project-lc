export type FmOrderStatusNumString =
  | '15'
  | '25'
  | '35'
  | '40'
  | '45'
  | '50'
  | '55'
  | '60'
  | '65'
  | '70'
  | '75'
  | '85'
  | '95'
  | '99';

export interface FmOrderStatus {
  name:
    | '주문접수'
    | '결제확인'
    | '상품준비'
    | '부분출고준비'
    | '출고준비'
    | '부분출고완료'
    | '출고완료'
    | '부분배송중'
    | '배송중'
    | '부분배송완료'
    | '배송완료'
    | '결제취소'
    | '주문무효'
    | '결제실패';
  chakraColor: string;
}

export const fmOrderStatusNames = [
  '주문접수',
  '결제확인',
  '상품준비',
  '부분출고준비',
  '출고준비',
  '부분출고완료',
  '출고완료',
  '부분배송중',
  '배송중',
  '부분배송완료',
  '배송완료',
  '결제취소',
  '주문무효',
  '결제실패',
];

export const fmOrderStatuses: Record<FmOrderStatusNumString, FmOrderStatus> = {
  '15': { name: '주문접수', chakraColor: 'yellow' },
  '25': { name: '결제확인', chakraColor: 'green' },
  '35': { name: '상품준비', chakraColor: 'cyan' },
  '40': { name: '부분출고준비', chakraColor: 'teal' },
  '45': { name: '출고준비', chakraColor: 'teal' },
  '50': { name: '부분출고완료', chakraColor: 'blue' },
  '55': { name: '출고완료', chakraColor: 'blue' },
  '60': { name: '부분배송중', chakraColor: 'purple' },
  '65': { name: '배송중', chakraColor: 'purple' },
  '70': { name: '부분배송완료', chakraColor: 'messenger' },
  '75': { name: '배송완료', chakraColor: 'messenger' },
  '85': { name: '결제취소', chakraColor: 'gray' },
  '95': { name: '주문무효', chakraColor: 'gray' },
  '99': { name: '결제실패', chakraColor: 'gray' },
};

export function convertFmOrderStatusToString(key: keyof typeof fmOrderStatuses) {
  return fmOrderStatuses[key].name;
}

export function convertFmStatusStringToStatus(
  statusString: typeof fmOrderStatuses[keyof typeof fmOrderStatuses]['name'],
) {
  const entries = Object.entries(fmOrderStatuses);
  return entries.find(
    ([_, value]) => value.name === statusString,
  )[0] as FmOrderStatusNumString;
}

export function getFmOrderStatusColor(key: keyof typeof fmOrderStatuses) {
  return fmOrderStatuses[key].chakraColor;
}

export function getFmOrderStatusByNames(
  targetStatusNames: Array<typeof fmOrderStatuses[keyof typeof fmOrderStatuses]['name']>,
) {
  const entries = Object.entries(fmOrderStatuses);
  const filtered = entries.filter(([_, value]) => targetStatusNames.includes(value.name));
  return filtered.map(([key, v]) => key) as FmOrderStatusNumString[];
}
