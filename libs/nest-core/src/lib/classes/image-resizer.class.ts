import { Injectable } from '@nestjs/common';
import sharp from 'sharp';

export type SizeParam = Record<'x' | 'y', number> | number;

@Injectable()
export class ImageResizer {
  /**
   * 이미지 사이즈를 수정합니다.
   * @param imageBuffer 변환할 이미지 버퍼
   * @param sizes x,y 축의 크기를 지정합니다. 정방형 형태로 지정됩니다. x와 y값을 다르게 지정하고자 하는 경우 2번쨰 오버로딩 함수를 사용할 수 있습니다.
   * @returns Sharp객체
   */
  public async resize(imageBuffer: Buffer, sizes: number): Promise<Buffer>;
  /**
   * 이미지 사이즈를 수정합니다.
   * @param imageBuffer 변환할 이미지 버퍼
   * @param sizes x축과 y축 사이즈 객체, 각 필드는 number 값을 가짐
   * @returns Sharp객체
   */
  public async resize(imageBuffer: Buffer, sizes: SizeParam): Promise<Buffer>;
  public async resize(imageBuffer: Buffer, sizes: number | SizeParam): Promise<Buffer> {
    if (typeof sizes === 'number') {
      return sharp(imageBuffer).resize(sizes, sizes).toBuffer();
    }
    return sharp(imageBuffer).resize(sizes.x, sizes.y).toBuffer();
  }
}
