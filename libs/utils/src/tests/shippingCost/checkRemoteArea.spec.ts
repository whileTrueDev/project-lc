import { checkRemoteArea } from '../../lib/calculateShippingCost';

describe('제주 및 도서산간 지역인지 확인', () => {
  test(' 우편번호 54000 true', () => {
    const postalCode = '54000';
    const isRemote = checkRemoteArea({ address: '', postalCode });
    expect(isRemote).toBe(true);
  });

  test(' 우편번호 23005 true', () => {
    const postalCode = '23005';
    const isRemote = checkRemoteArea({ address: '', postalCode });
    expect(isRemote).toBe(true);
  });
});
