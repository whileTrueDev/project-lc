import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, scrypt } from 'crypto';
import { promisify } from 'util';
import base64url from 'base64url';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CipherService {
  private iv: Buffer;
  private key: Buffer;

  constructor(private configService: ConfigService) {
    this.initializer();
  }

  // 필요한 초기 데이터
  private async initializer() {
    const hash = this.configService.get<string>('CIPHER_HASH');
    const password = this.configService.get<string>('CIPHER_PASSWORD');
    const salt = this.configService.get<string>('CIPHER_SALT');
    this.iv = Buffer.from(hash);
    this.key = (await promisify(scrypt)(password, salt, 32)) as Buffer;
  }

  // urlsafe 디코딩 -> 복호화
  getRefreshToken(cookieRefreshToken: string): string {
    const decodedTokenBuffer = this.decodeBase64URLSafe(cookieRefreshToken);
    const refreshToken = this.decryptToken(decodedTokenBuffer);
    return refreshToken;
  }

  // 암호화 -> urlsafe 인코딩
  createCookieRefreshToken(refreshToken: string): string {
    const encryptedBuffer = this.encryptToken(refreshToken);
    const encodedTokenString = this.encodeBase64URLSafe(encryptedBuffer);
    return encodedTokenString;
  }

  // base64-urlsafe한 인코딩 실시.
  private encodeBase64URLSafe(encryptedBuffer: Buffer) {
    return base64url(encryptedBuffer);
  }

  // base64-urlsafe의 디코딩 실시.
  private decodeBase64URLSafe(encondedTokenString: string): Buffer {
    return base64url.toBuffer(encondedTokenString);
  }

  // 암호화된 토큰 버퍼 제공
  private encryptToken(refreshToken: string): Buffer {
    const cipher = createCipheriv('aes-256-ctr', this.key, this.iv);
    const encryptedBuffer = Buffer.concat([cipher.update(refreshToken), cipher.final()]);

    return encryptedBuffer;
  }

  //  복호화된 토큰 제공
  private decryptToken(encryptedText: Buffer): string {
    const decipher = createDecipheriv('aes-256-ctr', this.key, this.iv);
    const decryptedBuffer = Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ]);
    return decryptedBuffer.toString('utf-8');
  }
}
