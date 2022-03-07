import { AddIcon } from '@chakra-ui/icons';
import { Button, Stack, Text, useDisclosure } from '@chakra-ui/react';
import {
  KkshowMainCarouselItem,
  KkshowMainCarouselItemType,
  KkshowMainResData,
  ProductAndBroadcasterInfo,
} from '@project-lc/shared-types';
import React from 'react';
import { FieldArrayWithId, useFieldArray, useFormContext } from 'react-hook-form';
import {
  CarouselItemNowPlayingLive,
  CarouselItemPreviousLive,
  CarouselItemSimpleBanner,
  CarouselItemUpcomingLive,
} from './AdminKkshowMainCarouselItemView';

const carouselItemProductAndBroadcasterDefaultValue: ProductAndBroadcasterInfo = {
  liveShoppingName: '',
  productImageUrl: '',
  normalPrice: 0,
  discountedPrice: 0,
  productLinkUrl: '',
  profileImageUrl: '',
  broadcasterNickname: '',
  promotionPageLinkUrl: '',
  liveShoppingId: null,
  liveShoppingProgress: null,
  broadcastStartDate: null,
  broadcastEndDate: null,
};

const carouselItemAddButtons: {
  type: KkshowMainCarouselItemType;
  label: string;
  defaultValue: KkshowMainCarouselItem;
}[] = [
  {
    type: 'simpleBanner',
    label: '이미지 배너',
    defaultValue: {
      type: 'simpleBanner',
      linkUrl: '',
      imageUrl: '',
      description: '',
    },
  },
  {
    type: 'upcoming',
    label: '라이브 예고',
    defaultValue: {
      type: 'upcoming',
      imageUrl: '',
      ...carouselItemProductAndBroadcasterDefaultValue,
    },
  },
  {
    type: 'nowPlaying',
    label: '현재 라이브',
    defaultValue: {
      type: 'nowPlaying',
      platform: 'twitch',
      videoUrl: '',
      ...carouselItemProductAndBroadcasterDefaultValue,
    },
  },
  {
    type: 'previous',
    label: '이전 라이브',
    defaultValue: {
      type: 'previous',
      videoUrl: '',
      ...carouselItemProductAndBroadcasterDefaultValue,
    },
  },
];

export function AdminKkshowMainCarouselSection(): JSX.Element {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { control } = useFormContext<KkshowMainResData>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'carousel' as const,
  });

  const itemRemoveHandler = async (
    field: FieldArrayWithId<KkshowMainResData, 'carousel', 'id'>,
    index: number,
  ): Promise<void> => {
    remove(index);
  };

  return (
    <Stack>
      <Stack direction="row" alignItems="center">
        <Text fontWeight="bold" size="lg">
          캐러셀 영역
        </Text>
        <Stack direction="row">
          {carouselItemAddButtons.map((button) => (
            <Button
              key={button.type}
              leftIcon={<AddIcon />}
              onClick={() => append(button.defaultValue)}
            >
              {button.label}
            </Button>
          ))}
        </Stack>
      </Stack>

      <Stack px={4}>
        {fields.map(
          (field: FieldArrayWithId<KkshowMainResData, 'carousel', 'id'>, index) => {
            return (
              <Stack key={field.id} w="100%" maxH="200px">
                <AdminKkshowMainFieldArrayItemContainer
                  moveUp={() => {
                    if (index > 0) move(index, index - 1);
                  }}
                  moveDown={() => {
                    if (index < fields.length - 1) move(index, index + 1);
                  }}
                  removeHandler={() => itemRemoveHandler(field, index)}
                >
                  {field.type === 'simpleBanner' && (
                    <CarouselItemSimpleBanner index={index} item={field} />
                  )}
                  {field.type === 'upcoming' && (
                    <CarouselItemUpcomingLive index={index} item={field} />
                  )}
                  {field.type === 'nowPlaying' && (
                    <CarouselItemNowPlayingLive index={index} item={field} />
                  )}
                  {field.type === 'previous' && (
                    <CarouselItemPreviousLive index={index} item={field} />
                  )}
                </AdminKkshowMainFieldArrayItemContainer>
              </Stack>
            );
          },
        )}
      </Stack>
    </Stack>
  );
}

export default AdminKkshowMainCarouselSection;

export function AdminKkshowMainFieldArrayItemContainer({
  children,
  removeHandler,
  moveUp,
  moveDown,
}: {
  children: React.ReactNode;
  removeHandler?: () => void;
  moveUp?: () => void;
  moveDown?: () => void;
}): JSX.Element {
  return (
    <Stack
      direction="row"
      border="1px"
      w="100%"
      p={1}
      alignItems="center"
      mb={1}
      justifyContent="space-between"
    >
      <Stack direction="row">{children}</Stack>

      <Stack>
        <Button onClick={moveUp}>위로</Button>
        <Button onClick={moveDown}>아래로</Button>
        <Button onClick={removeHandler}>delete</Button>
      </Stack>
    </Stack>
  );
}
