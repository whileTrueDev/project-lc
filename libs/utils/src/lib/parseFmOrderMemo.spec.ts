import { FmOrderMemoParser } from './fmOrderMemoParser';

describe('FmOrderMemoParser', () => {
  test('통화이벤트O, 선물O', () => {
    const teststring = `1. 배송메모 : 집앞에 두세요.,
2. 크리에이터 채널명 : 크리에이터이름,
3. 작성자 : 시청자,
4. 응원내용 : 응원메시지내용,
5. 통화 이벤트 : 통화 이벤트 참여 합니다.,
6. 선물하기 여부 : 이 상품을 크리에이터에게 선물하고 싶습니다.`;

    const parser = new FmOrderMemoParser(teststring);
    expect(parser.memo).toEqual('집앞에 두세요.');
    expect(parser.broadcaster).toEqual('크리에이터이름');
    expect(parser.buyer).toEqual('시청자');
    expect(parser.donationMessaage).toEqual('응원메시지내용');
    expect(parser.phoneEventFlag).toEqual(true);
    expect(parser.giftFlag).toEqual(true);
  });

  test('통화이벤트X, 선물X', () => {
    const teststring = `1. 배송메모 : 집앞에 두세요.,
2. 크리에이터 채널명 : 크리에이터이름,
3. 작성자 : 시청자,
4. 응원내용 : 응원메시지내용,
5. 통화 이벤트 : 통화 이벤트 참여 하지 않습니다.,
6. 선물하기 여부 : 크리에이터에게 선물하지 않습니다.`;

    const parser = new FmOrderMemoParser(teststring);
    expect(parser.memo).toEqual('집앞에 두세요.');
    expect(parser.broadcaster).toEqual('크리에이터이름');
    expect(parser.buyer).toEqual('시청자');
    expect(parser.donationMessaage).toEqual('응원메시지내용');
    expect(parser.phoneEventFlag).toEqual(false);
    expect(parser.giftFlag).toEqual(false);
  });

  test('통화이벤트X, 선물입력X', () => {
    const teststring = `1. 배송메모 : 집앞에 두세요.,
2. 크리에이터 채널명 : 크리에이터이름,
3. 작성자 : 시청자,
4. 응원내용 : 응원메시지내용,
5. 통화 이벤트 : 통화 이벤트 참여 하지 않습니다.,
6. 선물하기 여부 : `;

    const parser = new FmOrderMemoParser(teststring);
    expect(parser.memo).toEqual('집앞에 두세요.');
    expect(parser.broadcaster).toEqual('크리에이터이름');
    expect(parser.buyer).toEqual('시청자');
    expect(parser.donationMessaage).toEqual('응원메시지내용');
    expect(parser.phoneEventFlag).toEqual(false);
    expect(parser.giftFlag).toEqual(false);
  });
});
