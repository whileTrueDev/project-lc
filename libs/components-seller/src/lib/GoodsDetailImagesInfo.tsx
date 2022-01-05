import { Stack, Text } from '@chakra-ui/react';
import { HorizontalImageGallery } from '@project-lc/components-core/HorizontalImageGallery';
import { TextViewerWithDetailModal } from '@project-lc/components-shared/TextViewerWithDetailModal';
import { GoodsByIdRes } from '@project-lc/shared-types';
import { useMemo } from 'react';

export interface GoodsDetailImagesInfoProps {
  goods: GoodsByIdRes;
}
export function GoodsDetailImagesInfo({
  goods,
}: GoodsDetailImagesInfoProps): JSX.Element {
  const contents = useMemo(() => goods.contents ?? '', [goods.contents]);
  const images = useMemo(
    () => goods.image.sort((a, b) => a.cut_number - b.cut_number).map((x) => x.image),
    [goods.image],
  );
  return (
    <Stack spacing={10}>
      {/* 상품이미지 */}
      <Stack spacing={2}>
        <Text fontWeight="bold">상품 사진</Text>
        {goods.image.length > 0 ? (
          <>
            <Text>총 {goods.image.length} 장</Text>

            {/* 임시 이미지. s3 업로드된 이미지 필요 */}
            <HorizontalImageGallery images={images} />
          </>
        ) : (
          <Text>사진이 없는 상품입니다.</Text>
        )}
      </Stack>

      {/* 상품상세설명 */}
      <Stack>
        <Text fontWeight="bold">상세설명</Text>
        {contents ? (
          <TextViewerWithDetailModal
            title={`${goods.goods_name} 상세설명`}
            contents={contents}
          />
        ) : (
          <Text>상세 설명이 입력되지 않은 상품입니다.</Text>
        )}
      </Stack>
    </Stack>
  );
}
