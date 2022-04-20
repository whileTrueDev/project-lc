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
  liveShoppingPurchaseMessageNickname,
} from '@project-lc/shared-types';
import { throwError } from 'rxjs';
import { s3 } from '@project-lc/utils-s3';

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
    const { ttsSetting } = purchaseData;
    const price = purchaseData.purchaseNum;
    const { message } = purchaseData;
    let messageWithAppreciate: string;

    switch (ttsSetting) {
      case 'full':
        messageWithAppreciate = `
        <speak>
          ${nickname}님 ${price}원 구매 감사합니다 <break time='500ms'/> 
          ${message}
        </speak>
        `;
        break;
      case 'nick-purchase':
        messageWithAppreciate = `
        <speak>
          ${nickname}님 구매 감사합니다 <break time='500ms'/>
        </speak>
        `;
        break;
      case 'nick-purchase-price':
        messageWithAppreciate = `
        <speak>
          ${nickname}님 ${price}원 구매 감사합니다 <break time='500ms'/>
        </speak>
        `;
        break;
      case 'only-message':
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
      voice,
      audioConfig,
    };

    const [response] = await client.synthesizeSpeech(params);

    if (response && response.audioContent) {
      return response.audioContent;
    }
    return false;
  }

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
