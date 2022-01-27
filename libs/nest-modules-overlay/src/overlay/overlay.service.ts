import * as textToSpeech from '@google-cloud/text-to-speech';
import { Injectable } from '@nestjs/common';
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
} from '@project-lc/shared-types';
import { S3 } from '@aws-sdk/client-s3';
import { throwError } from 'rxjs';

@Injectable()
export class OverlayService {
  privateKey: string;
  options: GoogleTTSCredentials;
  s3: S3;

  constructor(private readonly prisma: PrismaService) {
    this.privateKey =
      process.env.GOOGLE_CREDENTIALS_PRIVATE_KEY?.replace(/\\n/g, '\n') || '';

    this.options = {
      credentials: {
        private_key: this.privateKey,
        client_email: process.env.GOOGLE_CREDENTIALS_EMAIL,
      },
    };

    this.s3 = new S3({
      region: 'ap-northeast-2',
      credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_ACCESS_KEY_SECRET,
      },
    });
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
    const topRanks = await this.prisma.liveShoppingPurchaseMessage.groupBy({
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
    const totalSoldPrice = await this.prisma.liveShoppingPurchaseMessage.aggregate({
      _sum: {
        price: true,
      },
    });
    if (!totalSoldPrice) throwError('Cannot Get Data From Db');
    return totalSoldPrice;
  }

  async getMessageAndNickname(overlayUrl): Promise<NicknameAndText[]> {
    const messageAndNickname = await this.prisma.liveShoppingPurchaseMessage.findMany({
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

  async getBannerImagesFromS3(
    email: BroadcasterEmail,
    liveShoppingId: number,
    bannerType: 'vertical-banner' | 'horizontal-banner',
  ): Promise<number> {
    const { S3_BUCKET_NAME } = process.env;

    const broadcasterEmail = email.email;
    let imagesUrls = 0;

    const listingParams = {
      Bucket: S3_BUCKET_NAME,
      Prefix: `${bannerType}/${broadcasterEmail}/${liveShoppingId}`,
    };

    await this.s3
      .listObjects(listingParams)
      .then(async (data) => {
        await data.Contents.forEach((object) => {
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
}
