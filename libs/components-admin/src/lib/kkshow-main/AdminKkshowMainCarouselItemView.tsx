import { Box, HStack, Input, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react';
import { KkshowMainCarouselItem } from '@project-lc/shared-types';
import { getAdminHost } from '@project-lc/utils';
import React from 'react';
import { useFormContext } from 'react-hook-form';

export function AdminKkshowMainCarouselItemView({
  item,
  index,
}: {
  item: KkshowMainCarouselItem;
  index: number;
}): JSX.Element {
  const { type } = item;
  const { register, watch } = useFormContext();

  switch (type) {
    case 'simpleBanner':
      return (
        <>
          <Text fontWeight="bold">이미지배너</Text>
          <ImageBanner imageUrl={item.imageUrl} />
          <Box>
            <Text>배너 링크 주소</Text>
            <Input
              {...register(`carousel.${index}.linkUrl` as const, {
                required: true,
              })}
              size="sm"
            />
          </Box>
        </>
      );
    case 'upcoming':
      return (
        <>
          <Text fontWeight="bold">라이브예고</Text>
          <ImageBanner imageUrl={item.imageUrl} />
          <Stack direction="row">
            <BroadcasterProfile profileImageUrl={item.profileImageUrl} />

            {item.productImageUrl && (
              <ProductImage productImageUrl={item.productImageUrl} />
            )}
            <Box>
              <Text>상품링크</Text>
              <Input
                {...register(`carousel.${index}.productLinkUrl` as const)}
                size="sm"
              />
            </Box>
          </Stack>
        </>
      );
    case 'nowPlaying':
      return (
        <>
          <Text fontWeight="bold">현재라이브</Text>
          <Box>
            <Stack direction="row">
              <Text>플랫폼 </Text>
              <RadioGroup mb={1} value={watch(`carousel.${index}.platform` as const)}>
                <HStack>
                  <Radio
                    {...register(`carousel.${index}.platform` as const)}
                    value="twitch"
                  >
                    트위치
                  </Radio>
                  <Radio
                    {...register(`carousel.${index}.platform` as const)}
                    value="youtube"
                  >
                    유튜브
                  </Radio>
                </HStack>
              </RadioGroup>
            </Stack>

            <VideoImbed
              videoUrl={
                item.platform === 'twitch'
                  ? `https://player.twitch.tv/?channel=${item.videoUrl}&parent=${
                      getAdminHost().includes('localhost') ? 'localhost' : getAdminHost()
                    }`
                  : `https://www.youtube.com/embed/${item.videoUrl}`
              }
            />
          </Box>

          <Stack direction="row">
            <BroadcasterProfile profileImageUrl={item.profileImageUrl} />

            <ProductImage productImageUrl={item.productImageUrl} />
            <Box>
              <Text>상품링크</Text>
              <Input
                {...register(`carousel.${index}.productLinkUrl` as const)}
                size="sm"
              />
            </Box>
          </Stack>
        </>
      );
    case 'previous':
      return (
        <>
          <Text fontWeight="bold">이전라이브</Text>
          <VideoImbed videoUrl={`https://www.youtube.com/embed/${item.videoUrl}`} />
        </>
      );

    default:
      return <Text>{`not supported carousel item type : ${type}`}</Text>;
  }
}

export function ImageBanner({ imageUrl }: { imageUrl: string }): JSX.Element {
  return (
    <Box>
      <Text>배너이미지</Text>
      <img src={imageUrl} width="200" height="200" alt="" />
    </Box>
  );
}

export function VideoImbed({ videoUrl }: { videoUrl: string }): JSX.Element {
  return (
    <Box>
      <Text>영상</Text>
      <iframe
        title={videoUrl}
        allowFullScreen
        src={videoUrl}
        frameBorder="0"
        height="100"
        width="200"
      />
    </Box>
  );
}

export function BroadcasterProfile({
  profileImageUrl,
}: {
  profileImageUrl: string;
}): JSX.Element {
  return (
    <Box>
      <Text>방송인 프로필 이미지</Text>
      <img src={profileImageUrl} alt="" width="80" height="80" />
    </Box>
  );
}

export function ProductImage({
  productImageUrl,
}: {
  productImageUrl: string;
}): JSX.Element {
  return (
    <Box>
      <Text>상품이미지</Text>
      <img src={productImageUrl} alt="" width="100" height="100" />
    </Box>
  );
}
