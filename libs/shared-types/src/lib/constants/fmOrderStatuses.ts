export const fmOrderStatuses = {
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

export function getFmOrderStatusColor(key: keyof typeof fmOrderStatuses) {
  return fmOrderStatuses[key].chakraColor;
}
