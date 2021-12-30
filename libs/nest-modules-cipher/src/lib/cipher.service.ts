import { Injectable } from '@nestjs/common';
import base64url from 'base64url';
import { createCipheriv, createDecipheriv, scrypt } from 'crypto';
import { promisify } from 'util';

@Injectable()
export class CipherService {
  private iv: Buffer;
  private key: Buffer;

  constructor() {
    this.initializer();
  }

  // 필요한 초기 데이터
  private async initializer(): Promise<void> {
    const hash = process.env.CIPHER_HASH;
    const password = process.env.CIPHER_PASSWORD;
    const salt = process.env.CIPHER_SALT;
    this.iv = Buffer.from(hash);
    this.key = (await promisify(scrypt)(password, salt, 32)) as Buffer;
  }

  // urlsafe 디코딩 -> 복호화
  decrypt(encryptedStr: string): string {
    const decodedTokenBuffer = this.decodeBase64URLSafe(encryptedStr);
    const refreshToken = this.decryptToken(decodedTokenBuffer);
    return refreshToken;
  }

  // 암호화 -> urlsafe 인코딩
  encrypt(str: string): string {
    const encryptedBuffer = this.encryptToken(str);
    const encodedTokenString = this.encodeBase64URLSafe(encryptedBuffer);
    return encodedTokenString;
  }

  // base64-urlsafe한 인코딩 실시.
  private encodeBase64URLSafe(encryptedBuffer: Buffer): string {
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

  // 개인정보 관련 암호화
  getEncryptedText(text?: string): string | undefined {
    if (!text) return undefined;
    return this.encrypt(text);
  }

  // 개인정보 관련 복호화
  getDecryptedText(text?: string): string | undefined {
    if (!text) return undefined;
    return this.decrypt(text);
  }
}
