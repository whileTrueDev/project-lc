import {
  Button,
  Stack,
  Text,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Divider,
  Textarea,
  ModalProps,
} from '@chakra-ui/react';
import { LIVE_SHOPPING_PROGRESS } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import BroadcasterChannelButton from './BroadcasterChannelButton';
import { BroadcasterName } from './BroadcasterName';

import { LiveShoppingProgressBadge } from './LiveShoppingProgressBadge';

export type LiveShoppingDetailDialogProps = Pick<ModalProps, 'isOpen' | 'onClose'> & {
  data: any;
  id: number;
  type: 'broadcaster' | 'seller';
};

export function LiveShoppingDetailDialog(
  props: LiveShoppingDetailDialogProps,
): JSX.Element {
  const { isOpen, onClose, data, id, type } = props;
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>상세정보</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            {data[id]?.seller.sellerShop && (
              <Stack direction="row" alignItems="center">
                <Text as="span">판매자: </Text>
                <Text as="span">{data[id]?.seller.sellerShop.shopName}</Text>
              </Stack>
            )}

            {type === 'broadcaster' && (
              <Stack direction="row" alignItems="center">
                <Text as="span">상품명: </Text>
                <Text as="span">{data[id]?.goods.goods_name}</Text>
              </Stack>
            )}

            <Stack direction="row" alignItems="center">
              <Text as="span">진행상태</Text>
              <LiveShoppingProgressBadge
                progress={data[id]?.progress}
                broadcastStartDate={data[id]?.broadcastStartDate}
                broadcastEndDate={data[id]?.broadcastEndDate}
                sellEndDate={data[id]?.sellEndDate}
              />
              {data[id]?.progress === LIVE_SHOPPING_PROGRESS.취소됨 ? (
                <Text>사유 : {data[id]?.rejectionReason}</Text>
              ) : null}
            </Stack>

            <Divider />

            {type === 'seller' && (
              <Stack direction="row" alignItems="center">
                <Text as="span">방송인: </Text>
                {data[id].broadcaster ? (
                  <>
                    <BroadcasterName data={data[id].broadcaster} />
                    <BroadcasterChannelButton
                      channelUrl={data[id].broadcaster?.channels[0]?.url}
                    />
                  </>
                ) : (
                  <Text fontWeight="bold">미정</Text>
                )}
              </Stack>
            )}

            <Stack direction="row" alignItems="center">
              <Text as="span">방송시작 시간: </Text>
              <Text as="span" fontWeight="bold">
                {data[id]?.broadcastStartDate
                  ? dayjs(data[id]?.broadcastStartDate).format('YYYY/MM/DD HH:mm')
                  : '미정'}
              </Text>
            </Stack>

            <Stack direction="row" alignItems="center">
              <Text as="span">방송종료 시간: </Text>
              <Text as="span" fontWeight="bold">
                {data[id]?.broadcastEndDate
                  ? dayjs(data[id]?.broadcastEndDate).format('YYYY/MM/DD HH:mm')
                  : '미정'}
              </Text>
            </Stack>

            <Divider />
            <Stack direction="row" alignItems="center">
              <Text as="span">판매시작 시간: </Text>
              <Text as="span" fontWeight="bold">
                {data[id]?.sellStartDate
                  ? dayjs(data[id]?.sellStartDate).format('YYYY/MM/DD HH:mm')
                  : '미정'}
              </Text>
            </Stack>

            <Stack direction="row" alignItems="center">
              <Text as="span">판매종료 시간: </Text>
              <Text as="span" fontWeight="bold">
                {data[id]?.sellEndDate
                  ? dayjs(data[id]?.sellEndDate).format('YYYY/MM/DD HH:mm')
                  : '미정'}
              </Text>
            </Stack>

            <Divider />
            <Stack direction="row" alignItems="center">
              <Text as="span">방송인 수수료: </Text>
              <Text as="span" fontWeight="bold">
                {data[id]?.broadcasterCommissionRate
                  ? `${data[id]?.broadcasterCommissionRate}%`
                  : '미정'}
              </Text>
            </Stack>

            {type === 'seller' && (
              <Stack direction="row" alignItems="center">
                <Text as="span">판매 수수료: </Text>
                <Text as="span" fontWeight="bold">
                  {data[id].whiletrueCommissionRate
                    ? `${data[id].whiletrueCommissionRate}%`
                    : '미정'}
                </Text>
              </Stack>
            )}

            {type === 'seller' && (
              <Stack direction="row" alignItems="center">
                <Text as="span">희망 판매 수수료: </Text>
                <Text as="span" fontWeight="bold">
                  {data[id]?.desiredCommission} %
                </Text>
              </Stack>
            )}

            {type === 'seller' && (
              <Stack direction="row" alignItems="center">
                <Text as="span">희망 진행 기간: </Text>
                <Text as="span" fontWeight="bold">
                  {data[id]?.desiredPeriod}
                </Text>
              </Stack>
            )}

            <Stack>
              <Text>요청사항</Text>
              <Textarea
                resize="none"
                rows={10}
                value={data[id]?.requests || ''}
                readOnly
              />
            </Stack>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            닫기
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default LiveShoppingDetailDialog;
