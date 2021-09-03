import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import * as textToSpeech from '@google-cloud/text-to-speech';
import { throwError } from 'rxjs';

interface AudioEncoding {
  speakingRate: number;
  audioEncoding: 'MP3' | undefined | null;
}

interface Voice {
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

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  // * prisma 데이터베이스 접근 호출 예시 by Dan -> 예시 확인 이후 삭제해도 됩니다.

  async getRanking(): Promise<any> {
    const topRanks = await this.prisma.liveCommerceRanking.groupBy({
      by: ['nickname'],
      where: {
        loginFlag: {
          not: '0',
        },
      },
      _sum: {
        price: true,
      },
    });
    if (!topRanks) throwError('Cannot Get Data From Db');
    return topRanks;
  }

  async getTotalSoldPrice(): Promise<any> {
    const totalSoldPrice = await this.prisma.liveCommerceRanking.aggregate({
      _sum: {
        price: true,
      },
    });
    if (!totalSoldPrice) throwError('Cannot Get Data From Db');
    return totalSoldPrice;
  }

  async getMessageAndNickname(): Promise<any> {
    const messageAndNickname = await this.prisma.liveCommerceRanking.findMany({
      select: {
        nickname: true,
        text: true,
      },
    });
    if (!messageAndNickname) throwError('Cannot Get Data From Db');
    return messageAndNickname;
  }

  async googleTextToSpeech(purchaseData) {
    const privateKey =
      process.env.GOOGLE_CREDENTIALS_PRIVATE_KEY?.replace(/\\n/g, '\n') || '';
    const options = {
      credentials: {
        private_key: privateKey,
        client_email: process.env.GOOGLE_CREDENTIALS_EMAIL,
      },
    };
    const client = new textToSpeech.TextToSpeechClient(options);

    // The text to synthesize

    const { userId } = purchaseData;
    const { productName } = purchaseData;
    const quantity = purchaseData.purchaseNum;
    const { text } = purchaseData;

    // 추후 선택기능 넣을 예정
    const messageWithAppreciate = `
    <speak>
      ${userId}님 ${productName} ${quantity}원 구매 감사합니다 <break time="0.4s"/> ${text}
    </speak>
    `;

    // const messageOnlyMessage = `
    //   <speak>
    //     ${text}
    //   </speak>
    // `

    const audioConfig: AudioEncoding = { speakingRate: 1.3, audioEncoding: 'MP3' };
    const voice: Voice = {
      languageCode: 'ko-KR',
      name: 'ko-KR-Standard-A',
      ssmlGender: 'FEMALE',
    };
    // Construct the request
    const params = {
      input: { ssml: messageWithAppreciate },
      // Select the language and SSML voice gender (optional)
      voice, // , ssmlGender: 'NEUTRAL'
      // select the type of audio encoding
      audioConfig,
    };

    // Performs the text-to-speech request
    const [response] = await client.synthesizeSpeech(params);
    // Write the binary audio content to a local file
    if (response && response.audioContent) {
      return response.audioContent;
    }
    return false;
  }
}
