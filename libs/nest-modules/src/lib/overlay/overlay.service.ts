import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import * as textToSpeech from '@google-cloud/text-to-speech';
import {
  Voice,
  AudioEncoding,
  NicknameAndPrice,
  PriceSum,
  NicknameAndText,
  GoogleTTSCredentials,
  PurchaseMessage,
} from '@project-lc/shared-types';
import { throwError } from 'rxjs';

@Injectable()
export class OverlayService {
  privateKey: string;
  options: GoogleTTSCredentials;

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

  async googleTextToSpeech(
    purchaseData: PurchaseMessage,
  ): Promise<string | false | Uint8Array> {
    const client = new textToSpeech.TextToSpeechClient(this.options);
    const { nickname } = purchaseData;
    const { productName } = purchaseData;
    const quantity = purchaseData.purchaseNum;
    const { message } = purchaseData;

    // 추후 선택기능 넣을 예정
    const messageWithAppreciate = `
    <speak>
      ${nickname}님 ${productName} ${quantity}원 구매 감사합니다 <break time="0.4s"/> ${message}
    </speak>
    `;

    const audioConfig: AudioEncoding = { speakingRate: 1.3, audioEncoding: 'MP3' };
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

  async streamStartNotification(): Promise<string | false | Uint8Array> {
    const client = new textToSpeech.TextToSpeechClient(this.options);

    const message = `
    <speak>
      잠시 후, 수련수련님의 싸움의고수 라이브 커머스가 시작됩니다.
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
      voice, // ssmlGender: 'NEUTRAL'
      audioConfig,
    };

    const [response] = await client.synthesizeSpeech(params);

    if (response && response.audioContent) {
      return response.audioContent;
    }
    return false;
  }

  async getRanking(overlayUrl): Promise<NicknameAndPrice[]> {
    const topRanks = await this.prisma.liveCommerceRanking.groupBy({
      by: ['nickname'],
      where: {
        broadcaster: {
          overlayUrl: { contains: overlayUrl },
        },
        loginFlag: true,
      },
      _sum: {
        price: true,
      },
    });
    if (!topRanks) throwError('Cannot Get Data From Db');
    return topRanks;
  }

  async getTotalSoldPrice(): Promise<PriceSum> {
    const totalSoldPrice = await this.prisma.liveCommerceRanking.aggregate({
      _sum: {
        price: true,
      },
    });
    if (!totalSoldPrice) throwError('Cannot Get Data From Db');
    return totalSoldPrice;
  }

  async getMessageAndNickname(overlayUrl): Promise<NicknameAndText[]> {
    const messageAndNickname = await this.prisma.liveCommerceRanking.findMany({
      select: {
        nickname: true,
        text: true,
      },
      where: {
        broadcaster: {
          overlayUrl: { contains: overlayUrl },
        },
        loginFlag: true,
      },
    });
    if (!messageAndNickname) throwError('Cannot Get Data From Db');
    return messageAndNickname;
  }
}
