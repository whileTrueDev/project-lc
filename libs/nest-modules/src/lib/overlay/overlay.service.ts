import { Injectable } from '@nestjs/common';
import * as textToSpeech from '@google-cloud/text-to-speech';
import { Voice, AudioEncoding } from '@project-lc/shared-types';

@Injectable()
export class OverlayService {
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
