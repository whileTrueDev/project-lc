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

  get memo(): string {
    return this.__memo;
  }

  get broadcaster(): string {
    return this.__broadcaster;
  }

  get buyer(): string {
    return this.__buyer;
  }

  get donationMessaage(): string {
    return this.__donationMessaage;
  }

  get phoneEventFlag(): boolean {
    return this.__phoneEventFlag;
  }

  get giftFlag(): boolean {
    return this.__giftFlag;
  }

  /**
   * 배송메모 전문을 파싱하여 JS 객체의 형태로 반환합니다.
   * @param s 배송메모 전문
   * @returns {FmOrderMemoItem}
   */
  public parse(s: string): FmOrderMemoItem {
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
    if (!s) return null;
    const [_, __, memo] = /(배송메모 : )(.*?)(,)/g.exec(s);
    if (!memo) return null;
    return memo;
  }

  private parseBroadcaster(s: string): string | null {
    if (!s) return null;
    const [_, __, broadcaster] = /(크리에이터 채널명 : )(.*?)(,)/g.exec(s);
    if (!broadcaster) return null;
    return broadcaster;
  }

  private parseBuyer(s: string): FmOrderMemoItem['buyer'] {
    if (!s) return null;
    const [_, __, buyer] = /(작성자 : )(.*?)(,)/g.exec(s);
    if (!buyer) return null;
    return buyer;
  }

  private parseDonationMessaage(s: string): FmOrderMemoItem['donationMessaage'] {
    if (!s) return null;
    const [_, __, donationMessage] = /(응원내용 : )(.*?)(,)/g.exec(s);
    if (!donationMessage) return null;
    return donationMessage;
  }

  private parsePhoneEventFlag(s: string): FmOrderMemoItem['phoneEventFlag'] {
    if (!s) return false;
    const [_, __, phoneEventFlag] = /(통화 이벤트 : )(.*?)(,)/g.exec(s);
    if (phoneEventFlag && phoneEventFlag === this.PHONE_EVENT_YES_TEXT) return true;
    return false;
  }

  private parseGiftFlag(s: string): FmOrderMemoItem['giftFlag'] {
    if (!s) return false;
    const [_, __, giftFlag] = /(선물하기 여부 : )(.*)/g.exec(s);
    if (giftFlag && giftFlag === this.GIFT_YES_TEXT) return true;
    return false;
  }
}
