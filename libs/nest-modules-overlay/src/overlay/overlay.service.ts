import * as textToSpeech from '@google-cloud/text-to-speech';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  AudioEncoding,
  GoogleTTSCredentials,
  NicknameAndPrice,
  NicknameAndText,
  PriceSum,
  PurchaseMessage,
  BroadcasterEmail,
  Voice,
  LiveShoppingBroadcastDate,
  liveShoppingPurchaseMessageNickname,
} from '@project-lc/shared-types';
import { throwError } from 'rxjs';
import { s3 } from '@project-lc/utils-s3';
import { Server } from 'socket.io';
import { TtsSetting } from '@prisma/client';

@Injectable()
export class OverlayService {
  privateKey: string;
  options: GoogleTTSCredentials;
  private logger = new Logger(OverlayService.name);

  private readonly ENABLE_TTS_TYPES: TtsSetting[] = [
    'full',
    'nick_purchase',
    'nick_purchase_price',
    'only_message',
  ];

  constructor(private readonly prisma: PrismaService) {
    this.privateKey =
      process.env.GOOGLE_CREDENTIALS_PRIVATE_KEY?.replace(/\\n/g, '\n') || '';

    this.options = {
      credentials: {
        private_key: this.privateKey,
        client_email: process.env.GOOGLE_CREDENTIALS_EMAIL,
      },
    };
  }

  // 응원메세지 tts 변환
  async googleTextToSpeech(
    purchaseData: PurchaseMessage,
  ): Promise<string | false | Uint8Array> {
    const client = new textToSpeech.TextToSpeechClient(this.options);
    const { nickname } = purchaseData;
    const { ttsSetting } = purchaseData;
    const price = purchaseData.purchaseNum;
    const { message } = purchaseData;
    let messageWithAppreciate: string;

    switch (ttsSetting) {
      // breaktime tag를 통해 문장 사이에 끊어 읽기
      case 'full':
        messageWithAppreciate = `
        <speak>
          ${nickname}님 ${price}원 구매 감사합니다 <break time='500ms'/> 
          ${message}
        </speak>
        `;
        break;
      case 'nick_purchase':
        messageWithAppreciate = `
        <speak>
          ${nickname}님 구매 감사합니다 <break time='500ms'/>
        </speak>
        `;
        break;
      case 'nick_purchase_price':
        messageWithAppreciate = `
        <speak>
          ${nickname}님 ${price}원 구매 감사합니다 <break time='500ms'/>
        </speak>
        `;
        break;
      case 'only_message':
        messageWithAppreciate = `
        <speak>
          ${message}
        </speak>
        `;
        break;
      default:
        messageWithAppreciate = `
        <speak>
          ${nickname}님 ${price}원 구매하셨습니다 <break time='500ms'/> ${message}
        </speak>
        `;
        break;
    }

    // speakingRate를 통해 읽는 속도 조절
    const audioConfig: AudioEncoding = { speakingRate: 1.3, audioEncoding: 'MP3' };

    // name과 ssmlGender 변경을 통해 다른 보이스 타입 사용 가능
    const voice: Voice = {
      languageCode: 'ko-KR',
      name: 'ko-KR-Standard-A',
      ssmlGender: 'FEMALE',
    };
    const params = {
      input: { ssml: messageWithAppreciate },
      voice,
      audioConfig,
    };

    const [response] = await client.synthesizeSpeech(params);
    if (response && response.audioContent) {
      return response.audioContent;
    }
    return false;
  }

  /** 구매 메시지 송출 핸들러 (overlay client 화면으로 송출 이벤트 전달) */
  public async handlePurchaseMessage(
    purchase: PurchaseMessage,
    socketServer: Server,
  ): Promise<void> {
    const {
      roomName: overlayUrl,
      ttsSetting,
      productName,
      message,
      nickname: _nickname,
      liveShoppingId,
    } = purchase;
    this.logger.debug(
      `Purchase Message - ${overlayUrl} (liveShoppingId : ${liveShoppingId}) - ${productName} ${_nickname}::${message}`,
    );
    // 하단 띠배너 응원메세지 띄울 때 사용
    // const bottomAreaTextAndNickname: string[] = [];
    const rankings = await this.getRanking({ overlayUrl, liveShoppingId });

    const nicknameAndPrice = rankings
      .map(({ nickname, _sum: { price } }) => ({ nickname, price }))
      .sort((a, b) => b.price - a.price);

    let audioBuffer: string | false | Uint8Array;
    if (this.ENABLE_TTS_TYPES.includes(ttsSetting)) {
      audioBuffer = await this.googleTextToSpeech(purchase);
    }

    /** 총 금액 오버레이에 띄울 때 필요 현재는 사용안함 
    const totalSold = await this.overlayService.getTotalSoldPrice();
    */

    /** 하단 띠배너 영역에 닉네임과 메세지 띄울 때 사용 현재는 사용안함
    const messageAndNickname = await this.overlayService.getMessageAndNickname(overlayUrl);
      messageAndNickname.forEach((d: { nickname: string; text: string }) => {
        bottomAreaTextAndNickname.push(`${d.text} - [${d.nickname}]`);
      });
     */

    if (ttsSetting === 'no_sound') {
      // 콤보모드 (콤보모드는 응원메세지 이미지 대신 콤보를 사용해서 기존과 다른 이벤트를 사용한다)
      // 콤보모드 구매 메시지 송출 이벤트 트리거
      socketServer
        .to(overlayUrl)
        .emit('get right-top pop purchase message', { purchase });
    } else {
      // TTS 구매 메시지 송출 이벤트 트리거
      socketServer
        .to(overlayUrl)
        .emit('get right-top purchase message', { purchase, audioBuffer });
    }

    // 랭킹화면 업데이트 이벤트 트리거
    socketServer.to(overlayUrl).emit('get top-left ranking', nicknameAndPrice);

    /** 총 판매금액 오버레이에 띄울 때 사용
      socketServer.to(overlayUrl).emit('get current quantity', totalSold);
     */
    /** 하단 띠배너 응원메세지 띄울 때 사용
    socketServer
      .to(overlayUrl)
      .emit('get bottom purchase message', bottomAreaTextAndNickname);
    */

    // 네쇼라 이벤트
    socketServer.to(overlayUrl).emit('get nsl donation message from server', {
      nickname: purchase.nickname,
      price: purchase.purchaseNum,
    });
  }

  /** 구매 메시지(비회원) 송출 핸들러 (overlay client 화면으로 송출 이벤트 전달) */
  public async handleSimplePurchaseMessage(
    purchase: PurchaseMessage,
    socketServer: Server,
  ): Promise<void> {
    const { roomName } = purchase;
    socketServer.to(roomName).emit('get non client purchase message', purchase);
    socketServer.to(roomName).emit('get nsl donation message from server', {
      nickname: purchase.nickname,
      price: purchase.purchaseNum,
    });
  }

  // 방송 시작 알림
  async streamNotification(text: string): Promise<string | false | Uint8Array> {
    const client = new textToSpeech.TextToSpeechClient(this.options);

    const message = `
    <speak>
      ${text}
    </speak>
    `;

    const audioConfig: AudioEncoding = { speakingRate: 1.1, audioEncoding: 'MP3' };
    const voice: Voice = {
      languageCode: 'ko-KR',
      name: 'ko-KR-Wavenet-A',
      ssmlGender: 'FEMALE',
    };

    const params = {
      input: { ssml: message },
      voice,
      audioConfig,
    };

    const [response] = await client.synthesizeSpeech(params);

    if (response && response.audioContent) {
      return response.audioContent;
    }
    return false;
  }

  // 중간금액 알림
  async streamObjectiveNotification(text: string): Promise<string | false | Uint8Array> {
    const client = new textToSpeech.TextToSpeechClient(this.options);

    const message = `

    <speak>
      <prosody pitch="+3st">
        ${text}
      </prosody>
    </speak>
    `;

    const audioConfig: AudioEncoding = { speakingRate: 1.1, audioEncoding: 'MP3' };
    const voice: Voice = {
      languageCode: 'ko-KR',
      name: 'ko-KR-Wavenet-D',
      ssmlGender: 'MALE',
    };

    const params = {
      input: { ssml: message },
      voice,
      audioConfig,
    };

    const [response] = await client.synthesizeSpeech(params);

    if (response && response.audioContent) {
      return response.audioContent;
    }
    return false;
  }

  // 랭킹 받아오기
  async getRanking({
    overlayUrl,
    liveShoppingId,
  }: {
    overlayUrl: string;
    liveShoppingId: number;
  }): Promise<NicknameAndPrice[]> {
    const topRanks = await this.prisma.liveShoppingPurchaseMessage.groupBy({
      by: ['nickname'],
      where: {
        broadcaster: {
          overlayUrl: { contains: overlayUrl },
        },
        liveShoppingId: Number(liveShoppingId),
        loginFlag: true,
      },
      _sum: {
        price: true,
      },
    });
    if (!topRanks) throwError('Cannot Get Data From Db');
    return topRanks;
  }

  // 총 판매금액 받아오기
  async getTotalSoldPrice(): Promise<PriceSum> {
    const totalSoldPrice = await this.prisma.liveShoppingPurchaseMessage.aggregate({
      _sum: {
        price: true,
      },
    });
    if (!totalSoldPrice) throwError('Cannot Get Data From Db');
    return totalSoldPrice;
  }

  // 닉네임과 메세지 (하단띠배너에 사용)
  async getMessageAndNickname({
    liveShoppingId,
    overlayUrl,
  }: {
    liveShoppingId: number;
    overlayUrl: string;
  }): Promise<NicknameAndText[]> {
    const messageAndNickname = await this.prisma.liveShoppingPurchaseMessage.findMany({
      select: {
        nickname: true,
        text: true,
      },
      where: {
        broadcaster: {
          overlayUrl: { contains: overlayUrl },
        },
        liveShoppingId,
        loginFlag: true,
      },
    });
    if (!messageAndNickname) throwError('Cannot Get Data From Db');
    return messageAndNickname;
  }

  // 세로배너 받아오기
  async getBannerImagesFromS3(
    email: BroadcasterEmail,
    liveShoppingId: number,
    bannerType: 'vertical-banner' | 'horizontal-banner',
  ): Promise<number> {
    const broadcasterEmail = email.email;
    let imagesUrls = 0;

    await s3
      .sendListObjectCommand({
        Prefix: `${bannerType}/${broadcasterEmail}/${liveShoppingId}`,
      })
      .then(async (data) => {
        await data.contents.forEach((object) => {
          const imageName = object.Key.split('/').slice(-1)[0];
          if (imageName.includes(bannerType)) {
            imagesUrls += 1;
          }
        });
      })
      .catch((error) => {
        console.error(error);
      });

    return imagesUrls;
  }

  // 방송 시작, 종료시간 받아오기
  async getRegisteredTime(liveShoppingId: number): Promise<LiveShoppingBroadcastDate> {
    return this.prisma.liveShopping.findFirst({
      where: {
        id: Number(liveShoppingId),
      },
      select: {
        broadcastStartDate: true,
        broadcastEndDate: true,
      },
    });
  }

  // 중간금액 알림시 하단 띠배너에 현재까지 구매한 모든 구매자의 목록
  async getCustomerIds(
    liveShoppingId: number,
  ): Promise<liveShoppingPurchaseMessageNickname[]> {
    return this.prisma.liveShoppingPurchaseMessage.findMany({
      select: {
        nickname: true,
      },
      where: {
        liveShoppingId: Number(liveShoppingId),
        loginFlag: true,
      },
    });
  }
}
