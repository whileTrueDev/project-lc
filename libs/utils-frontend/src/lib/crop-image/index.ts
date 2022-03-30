import { Crop } from 'react-image-crop';

export type DrawImageOnCanvasProp = {
  canvas: HTMLCanvasElement;
  image: HTMLImageElement;
  _crop: Crop;
};
// img 태그에 표시된 이미지를 canvas에 표시하고 crop 의 크기만큼 잘라냄
// 이미지 그린 캔버스 리턴
export const drawImageOnCanvas = ({
  canvas,
  image,
  _crop,
}: DrawImageOnCanvasProp): HTMLCanvasElement => {
  const _canvas = canvas;
  const pixelRatio = window.devicePixelRatio;
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const ctx = _canvas.getContext('2d');

  _canvas.width = _crop.width * pixelRatio * scaleX;
  _canvas.height = _crop.height * pixelRatio * scaleY;

  if (!ctx) {
    throw new Error('No 2d context');
  }

  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(
    image,
    _crop.x * scaleX,
    _crop.y * scaleY,
    _crop.width * scaleX,
    _crop.height * scaleY,
    0,
    0,
    _crop.width * scaleX,
    _crop.height * scaleY,
  );

  return _canvas;
};

/**
 * 이미지 잘라내어 "blob"으로 변환하는 함수
 * img 태그에 표시된 이미지를 blob으로 변환 -> blobcallback 적용
 * @param image HTMLImageElement 잘라낼 이미지
 * @param _crop x,y,height,width 값 가지고 있다
 * @param blobCallback 클롭된 이미지 처리할 함수, blob으로 변환된 이미지를 받아 원하는 작업을 하는 콜백함수
 */
export const getCroppedImage = (
  image: HTMLImageElement,
  _crop: Crop,
  blobCallback: BlobCallback,
): void => {
  const canvas = document.createElement('canvas');
  drawImageOnCanvas({ canvas, image, _crop }).toBlob(blobCallback, 'image/jpeg', 1);
};
