// 1. 배송메모 : ,
// 2. 크리에이터 채널명 : 크리에이터,
// 3. 작성자 : 시청자,
// 4. 응원내용 : 시청자의응원,
// 5. 통화 이벤트 : 통화 이벤트 참여 하지 않습니다.,
// 6. 선물하기 여부 : 이 상품을 크리에이터에게 선물하고 싶습니다.

export interface FmOrderMemoItem {
  memo: string | null;
  broadcaster: string | null;
  buyer: string | null;
  donationMessaage: string | null;
  phoneEventFlag: boolean;
  giftFlag: boolean;
}

/** project-lc 주문의 수령자 배송메모 파서 */
export class FmOrderMemoParser {
  private readonly PHONE_EVENT_YES_TEXT = '통화 이벤트 참여 합니다.';
  private readonly GIFT_YES_TEXT = '이 상품을 크리에이터에게 선물하고 싶습니다.';
  private __parsed: FmOrderMemoItem;
  private __memo: string;
  private __broadcaster: string;
  private __buyer: string;
  private __donationMessaage: string;
  private __phoneEventFlag: boolean;
  private __giftFlag: boolean;

  constructor(memoInput: string) {
    const parsed = this.parse(memoInput);
    this.__parsed = parsed;

    this.__memo = parsed.memo;
    this.__broadcaster = parsed.broadcaster;
    this.__buyer = parsed.buyer;
    this.__donationMessaage = parsed.donationMessaage;
    this.__phoneEventFlag = parsed.phoneEventFlag;
    this.__giftFlag = parsed.giftFlag;
  }

  get parsed(): FmOrderMemoItem {
    return this.__parsed;
  }

  /** 배송메모 */
  get memo(): string {
    return this.__memo;
  }

  /** 방송인 */
  get broadcaster(): string {
    return this.__broadcaster;
  }

  /** 구매자명(닉네임) */
  get buyer(): string {
    return this.__buyer;
  }

  /** 구매 메시지 */
  get donationMessaage(): string {
    return this.__donationMessaage;
  }

  /** 통화 이벤트 참여 여부 */
  get phoneEventFlag(): boolean {
    return this.__phoneEventFlag;
  }

  /** 선물하기 여부 */
  get giftFlag(): boolean {
    return this.__giftFlag;
  }

  /**
   * 배송메모 전문을 파싱하여 JS 객체의 형태로 반환합니다.
   * @param s 배송메모 전문
   * @returns {FmOrderMemoItem}
   */
  public parse(s: string): FmOrderMemoItem {
    const parsableStringRegexp =
      /(1. 배송메모 : )(.*?)(,)\n(2. 크리에이터 채널명 : )(.*)(,)\n(3. 작성자 : )(.*?)(,)\n(4. 응원내용 : )(.*)(,)\n(5. 통화 이벤트 : )(.*?)(,)\n(6. 선물하기 여부 : )(.*)/g;
    const isParsable = parsableStringRegexp.test(s);
    if (!isParsable)
      return {
        memo: s,
        broadcaster: null,
        buyer: null,
        donationMessaage: null,
        phoneEventFlag: false,
        giftFlag: false,
      };
    return {
      memo: this.parseMemo(s),
      broadcaster: this.parseBroadcaster(s),
      buyer: this.parseBuyer(s),
      donationMessaage: this.parseDonationMessaage(s),
      phoneEventFlag: this.parsePhoneEventFlag(s),
      giftFlag: this.parseGiftFlag(s),
    };
  }

  private parseMemo(s: string): FmOrderMemoItem['memo'] {
    return this.__parse({ s, regexp: /(배송메모 : )(.*?)(,)/g, targetGroupNum: 2 });
  }

  private parseBroadcaster(s: string): string | null {
    return this.__parse({
      s,
      regexp: /(크리에이터 채널명 : )(.*?)(,)/g,
      targetGroupNum: 2,
    });
  }

  private parseBuyer(s: string): FmOrderMemoItem['buyer'] {
    return this.__parse({ s, regexp: /(작성자 : )(.*?)(,)/g, targetGroupNum: 2 });
  }

  private parseDonationMessaage(s: string): FmOrderMemoItem['donationMessaage'] {
    return this.__parse({ s, regexp: /(응원내용 : )(.*?)(,)/g, targetGroupNum: 2 });
  }

  private parsePhoneEventFlag(s: string): FmOrderMemoItem['phoneEventFlag'] {
    const phoneEventFlag = this.__parse({
      s,
      regexp: /(통화 이벤트 : )(.*?)(,)/g,
      targetGroupNum: 2,
    });
    if (phoneEventFlag && phoneEventFlag === this.PHONE_EVENT_YES_TEXT) return true;
    return false;
  }

  private parseGiftFlag(s: string): FmOrderMemoItem['giftFlag'] {
    const giftFlag = this.__parse({
      s,
      regexp: /(선물하기 여부 : )(.*)/g,
      targetGroupNum: 2,
    });
    if (giftFlag && giftFlag === this.GIFT_YES_TEXT) return true;
    return false;
  }

  private __parse({ s, regexp, targetGroupNum }: FmOrderMemoParseOptions): string | null {
    if (!s) return null;
    const processed = regexp.exec(s);
    if (!processed) return null;
    const target = processed[targetGroupNum];
    if (!target) return null;
    return target;
  }
}

interface FmOrderMemoParseOptions {
  /** 파싱 대상 문자열 */
  s: string;
  /** 정규표현식 그룹을 필수적으로 포함하기를 권장 */
  regexp: RegExp;
  /** 정규표현식으로 그룹화된 배열 중 선택될 그룹인덱스 */
  targetGroupNum: number;
}
