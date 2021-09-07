export interface SocketIdandDevice {
  socketId: string;
  device: string;
}

export interface PageUrlAndDevice {
  pageUrl: string;
  device: string;
}

export interface SocketInfo {
  [key: string]: SocketIdandDevice[];
}

export interface RoomAndText {
  roomName: string;
  text: string;
}

export interface RoomAndDate {
  roomName: string;
  date: string;
}

export interface RoomAndType {
  roomName: string;
  type: string;
}

export interface PurchaseMessage {
  roomName: string;
  text: string;
  icon: string;
  userId: string;
  productName: string;
  purchaseNum: string;
}

export interface NickNameAndPrice {
  nickname: string;
  _sum: { price: number };
}

export interface NickNameAndText {
  nickname: string;
  text: string;
}

export interface PriceSum {
  _sum: { price: number };
}

export interface AudioEncoding {
  speakingRate: number;
  audioEncoding: 'MP3' | undefined | null;
}

export interface Voice {
  languageCode: string;
  name: string;
  ssmlGender:
    | 'FEMALE'
    | 'SSML_VOICE_GENDER_UNSPECIFIED'
    | 'MALE'
    | 'NEUTRAL'
    | null
    | undefined;
}
