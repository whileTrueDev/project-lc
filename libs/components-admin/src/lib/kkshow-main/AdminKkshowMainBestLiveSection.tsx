import {
  Stack,
  Text,
  Input,
  Button,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Box,
} from '@chakra-ui/react';
import { LiveShoppingWithGoods } from '@project-lc/hooks';
import { KkshowMainBestLiveItem } from '@project-lc/shared-types';
import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { BroadcasterProfile, VideoImbed } from './AdminKkshowMainCarouselItemView';
import { AdminKkshowMainFieldArrayItemContainer } from './AdminKkshowMainCarouselSection';
import { LiveShoppingListAutoComplete } from './LiveShoppingListAutoComplete';

export function AdminKkshowMainBestLiveSection(): JSX.Element {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { control } = useFormContext();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'bestLive' as const,
  });
  return (
    <Stack>
      <Stack direction="row" alignItems="center">
        <Text fontWeight="bold" size="lg">
          베스트 라이브 영역
        </Text>
        <Stack>
          <Button onClick={onOpen}>베스트 라이브 아이템 추가하기</Button>
          <KkshowMainBestLiveItemDialog
            isOpen={isOpen}
            onClose={onClose}
            createCallback={(item) => append(item)}
          />
        </Stack>
      </Stack>

      <Stack px={4}>
        {fields.map((field, index) => {
          const item = field as unknown as KkshowMainBestLiveItem;
          return (
            <Stack key={field.id} w="100%" maxH="200px">
              <AdminKkshowMainFieldArrayItemContainer
                moveUp={() => {
                  if (index > 0) move(index, index - 1);
                }}
                moveDown={() => {
                  if (index < fields.length - 1) move(index, index + 1);
                }}
                removeHandler={() => remove(index)}
              >
                <AdminKkshowMainBestLiveItem index={index} item={item} />
              </AdminKkshowMainFieldArrayItemContainer>
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
}

export default AdminKkshowMainBestLiveSection;

export function KkshowMainBestLiveItemDialog({
  isOpen,
  onClose,
  createCallback,
}: {
  isOpen: boolean;
  onClose: () => void;
  createCallback: (data: KkshowMainBestLiveItem) => void;
}): JSX.Element {
  const [selectedLiveShopping, setSelectedLiveShopping] =
    useState<LiveShoppingWithGoods | null>(null);
  const handleCreate = (): void => {
    if (!selectedLiveShopping) return;
    createCallback({
      videoUrl: selectedLiveShopping.liveShoppingVideo.youtubeUrl,
      broadcasterProfileImageUrl: selectedLiveShopping.broadcaster.avatar || '',
      liveShoppingDescription: `${selectedLiveShopping.broadcaster.userNickname} x ${selectedLiveShopping.seller.sellerShop.shopName}`,
      liveShoppingTitle: selectedLiveShopping.liveShoppingName || '',
      liveShoppingId: selectedLiveShopping.id,
    });
    setSelectedLiveShopping(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>베스트 라이브 추가하기</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack>
            <Box>
              <Text>라이브 쇼핑 선택</Text>
              <LiveShoppingListAutoComplete onChange={setSelectedLiveShopping} />
            </Box>

            <Box>
              <Text>선택한 라이브 쇼핑 정보</Text>
              {selectedLiveShopping ? (
                <Stack direction="row">
                  <VideoImbed
                    videoUrl={`https://www.youtube.com/embed/${selectedLiveShopping.liveShoppingVideo.youtubeUrl.replace(
                      'https://youtu.be/',
                      '',
                    )}`}
                  />

                  <Stack>
                    <BroadcasterProfile
                      profileImageUrl={selectedLiveShopping.broadcaster.avatar || ''}
                    />
                    <Text>{selectedLiveShopping.broadcaster.userNickname}</Text>
                  </Stack>

                  <Stack>
                    <Text>상품</Text>
                    <Text>{selectedLiveShopping.goods.goods_name}</Text>
                  </Stack>
                </Stack>
              ) : (
                <Text>선택된 데이터 없음</Text>
              )}
            </Box>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleCreate}
            disabled={!selectedLiveShopping}
          >
            추가
          </Button>
          <Button variant="ghost" onClick={onClose}>
            닫기
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export function AdminKkshowMainBestLiveItem({
  index,
  item,
}: {
  index: number;
  item: KkshowMainBestLiveItem;
}): JSX.Element {
  const { register } = useFormContext();
  return (
    <Stack direction="row">
      <Stack>
        <Text>순위</Text>
        <Text>{index + 1}</Text>
      </Stack>

      <VideoImbed
        videoUrl={`https://www.youtube.com/embed/${item.videoUrl.replace(
          'https://youtu.be/',
          '',
        )}`}
      />

      <BroadcasterProfile profileImageUrl={item.broadcasterProfileImageUrl} />

      <Stack>
        <Text>방송인 x 상점명</Text>
        <Input {...register(`bestLive.${index}.liveShoppingDescription`)} />
      </Stack>
      <Stack>
        <Text>방송명</Text>
        <Input {...register(`bestLive.${index}.liveShoppingTitle`)} />
      </Stack>
    </Stack>
  );
}
