import { TtsSetting } from '@prisma/client';

/** client의 소켓 아이디와 device os */
export interface SocketIdandDevice {
  /** 소켓 아이디 */
  socketId: string;
  /** 접속 디바이스 OS */
  device: string;
}
/** 오버레이의 URL과 디바이스의 OS */
export interface PageUrlAndDevice {
  /** 오버레이 URL */
  pageUrl: string;
  /** 접속 디바이스 OS */
  device: string;
}
/** 서버와 연결된 모든 클라이언트들의 정보 */
export interface SocketInfo {
  /** 소켓 아이디와 접속 디바이스들이 담겨있다 */
  [key: string]: SocketIdandDevice[];
}
/** 소켓 룸이름과 하단 응원메세지 */
export interface RoomAndText {
  /** 룸 이름 */
  roomName: string;
  /** 응원 메세지 */
  message: string;
}
/** 소켓 룸이름과 dday가 담겨있다 */
export interface RoomAndDate {
  /** 룸 이름 */
  roomName: string;
  /** dday */
  date: string;
}
/** 소켓 룸이름과 비디오의 인트로/아웃트로 구분 */
export interface RoomAndVideoType {
  /** 룸이름 */
  roomName: string;
  /** 비디오 인트로 / 아웃트로 */
  type: 'intro' | 'outro';
}

/** 응원메시지 Text To Speech 타입 */

/** 응원 메세지를 위한 정보들 */
export interface PurchaseMessage {
  /** 룸이름 */
  roomName: string;
  /** 응원메세지 */
  message: string;
  /** 1/2단계 구분 */
  level: string;
  /** 구매자 닉네임 */
  nickname: string;
  /** 구매물품 이름 */
  productName: string;
  /** 구매물품 가격 또는 수량 */
  purchaseNum: number;
  /** tts 세팅 */
  ttsSetting: TtsSetting;
  /** 간략 메시지(닉네임을 알 수 없는 익명메시지) 여부 */
  simpleMessageFlag?: boolean;
  /** 선물 구매 여부 */
  giftFlag?: boolean;
  /** 라이브쇼핑 id */
  liveShoppingId: number;
}
/** 시청자 닉네임과 닉네임별 구매금액 총액 */
export interface NicknameAndPrice {
  /** 시청자 닉네임 */
  nickname: string;
  /** 구매총액 */
  _sum: { price: number };
}
/** 닉네임과 구매 메세지 */
export interface NicknameAndText {
  /** 닉네임 */
  nickname: string;
  /** 구매메세지 */
  text: string;
}
/** 구매 총액 */
export interface PriceSum {
  /** 구매 총액 */
  _sum: { price: number };
}
/** TTS 관련 설정 */
export interface AudioEncoding {
  /** 읽는 속도 */
  speakingRate: number;
  /** 리턴 받을 오디오 타입 */
  audioEncoding: 'MP3' | undefined | null;
}
/** TTS 목소리 설정 */
export interface Voice {
  /** 언어 코드 */
  languageCode: string;
  /** 사용할 보이스 이름 */
  name: string;
  /** 보이스 성별 설정 */
  ssmlGender:
    | 'FEMALE'
    | 'SSML_VOICE_GENDER_UNSPECIFIED'
    | 'MALE'
    | 'NEUTRAL'
    | null
    | undefined;
}

/** 구글 TTS credential */
export interface GoogleTTSCredentials {
  [keys: string]: { private_key: string; client_email: string };
}

/** 방송인 메일 */
export interface BroadcasterEmail {
  email: string;
}

/** 컨트롤러에서 시작 시간 전송시 상품이름과 함께 전송 */
export interface StreamerAndProduct {
  /** 스트리머 이름 */
  streamerNickname: string;
  /** 상품명 */
  productName: string;
}
/** 시작시간 전송시 초기 세팅 스트리머명, 상품명, 룸이름, 시간 */
export interface StartSetting extends RoomAndDate {
  /** 스트리머명과 상품명 */
  streamerAndProduct: StreamerAndProduct;
}

export interface ProductNameAndRoomName {
  roomName: string;
  streamerAndProduct: StreamerAndProduct;
}

/** 라이브쇼핑id 전송시 같이 전송될 값 : 룸이름, 라이브쇼핑id, 상품명, 스트리머 명 */
export interface LiveShoppingIdWithProductNameAndRoomName extends ProductNameAndRoomName {
  /** 라이브쇼핑 아이디 */
  liveShoppingId: string;
}

export type OverlayImageTypes =
  | 'vertical-banner'
  | 'donation-images-1'
  | 'donation-images-2'
  | 'overlay-logo'
  | 'horizontal-banner';

export interface ObjectiveMessage {
  roomName: string;
  objective: {
    price: number;
    nickname?: string;
  };
  liveShoppingId?: number;
}

export interface RoomNameAndBgmNumber {
  roomName: string;
  bgmNumber: number;
}

export interface RoomNameAndVolume {
  roomName: string;
  volume: 'up' | 'down';
}

export interface NewsMessage {
  roomName: string;
  message: string;
}
