import { s3 } from '@project-lc/utils-s3';
import { useMemo, useState } from 'react';

type UseResizedImageResult = {
  src?: string;
  onError: () => void;
};
export const useResizedImage = (imageSrc?: string | null): UseResizedImageResult => {
  const resizedSrc = useMemo(() => {
    if (!imageSrc || (imageSrc && !imageSrc.startsWith(s3.bucketDomain))) return imageSrc;
    const splited = imageSrc?.split(s3.bucketDomain)[1];
    return `${s3.bucketDomain}resized-${splited}`;
  }, [imageSrc]);

  const [src, setSrc] = useState<string | undefined>(resizedSrc || '');
  const onError = (): void => {
    setSrc(imageSrc || '');
  };
  return { src, onError };
};
export default useResizedImage;
