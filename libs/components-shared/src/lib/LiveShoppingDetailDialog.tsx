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
import { LiveShoppingWithGoods, LIVE_SHOPPING_PROGRESS } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import BroadcasterChannelButton from './BroadcasterChannelButton';
import { BroadcasterName } from './BroadcasterName';

import { LiveShoppingProgressBadge } from './LiveShoppingProgressBadge';

export type LiveShoppingDetailDialogProps = Pick<ModalProps, 'isOpen' | 'onClose'> & {
  liveShopping?: LiveShoppingWithGoods;
  type: 'broadcaster' | 'seller';
};

export function LiveShoppingDetailDialog(
  props: LiveShoppingDetailDialogProps,
): JSX.Element | null {
  const { isOpen, onClose, liveShopping, type } = props;
  if (!liveShopping) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>상세정보</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            {liveShopping.seller.sellerShop && (
              <Stack direction="row" alignItems="center">
                <Text as="span">라이브쇼핑명: </Text>
                <Text as="span">
                  {liveShopping.liveShoppingName ||
                    '라이브 쇼핑명은 라이브 쇼핑 확정 후, 등록됩니다.'}
                </Text>
              </Stack>
            )}

            {liveShopping.seller.sellerShop && (
              <Stack direction="row" alignItems="center">
                <Text as="span">판매자: </Text>
                <Text as="span">{liveShopping.seller.sellerShop?.shopName}</Text>
              </Stack>
            )}

            {type === 'broadcaster' && (
              <Stack direction="row" alignItems="center">
                <Text as="span">상품명: </Text>
                <Text as="span">{liveShopping.goods.goods_name}</Text>
              </Stack>
            )}

            <Stack direction="row" alignItems="center">
              <Text as="span">진행상태</Text>
              <LiveShoppingProgressBadge
                progress={liveShopping.progress}
                broadcastStartDate={liveShopping.broadcastStartDate}
                broadcastEndDate={liveShopping.broadcastEndDate}
                sellEndDate={liveShopping.sellEndDate}
              />
              {liveShopping.progress === LIVE_SHOPPING_PROGRESS.취소됨 ? (
                <Text>사유 : {liveShopping.rejectionReason}</Text>
              ) : null}
            </Stack>

            <Divider />

            {type === 'seller' && (
              <Stack direction="row" alignItems="center">
                <Text as="span">방송인: </Text>
                {liveShopping.broadcaster ? (
                  <>
                    <BroadcasterName data={liveShopping.broadcaster} />
                    <BroadcasterChannelButton
                      channelUrl={liveShopping.broadcaster?.channels[0]?.url}
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
                {liveShopping.broadcastStartDate
                  ? dayjs(liveShopping.broadcastStartDate).format('YYYY/MM/DD HH:mm')
                  : '미정'}
              </Text>
            </Stack>

            <Stack direction="row" alignItems="center">
              <Text as="span">방송종료 시간: </Text>
              <Text as="span" fontWeight="bold">
                {liveShopping.broadcastEndDate
                  ? dayjs(liveShopping.broadcastEndDate).format('YYYY/MM/DD HH:mm')
                  : '미정'}
              </Text>
            </Stack>

            <Divider />
            <Stack direction="row" alignItems="center">
              <Text as="span">판매시작 시간: </Text>
              <Text as="span" fontWeight="bold">
                {liveShopping.sellStartDate
                  ? dayjs(liveShopping.sellStartDate).format('YYYY/MM/DD HH:mm')
                  : '미정'}
              </Text>
            </Stack>

            <Stack direction="row" alignItems="center">
              <Text as="span">판매종료 시간: </Text>
              <Text as="span" fontWeight="bold">
                {liveShopping.sellEndDate
                  ? dayjs(liveShopping.sellEndDate).format('YYYY/MM/DD HH:mm')
                  : '미정'}
              </Text>
            </Stack>

            <Divider />
            <Stack direction="row" alignItems="center">
              <Text as="span">방송인 수수료: </Text>
              <Text as="span" fontWeight="bold">
                {liveShopping.broadcasterCommissionRate
                  ? `${liveShopping.broadcasterCommissionRate}%`
                  : '미정'}
              </Text>
            </Stack>

            {type === 'seller' && (
              <Stack direction="row" alignItems="center">
                <Text as="span">판매 수수료: </Text>
                <Text as="span" fontWeight="bold">
                  {liveShopping.whiletrueCommissionRate
                    ? `${liveShopping.whiletrueCommissionRate}%`
                    : '미정'}
                </Text>
              </Stack>
            )}

            {type === 'seller' && (
              <Stack direction="row" alignItems="center">
                <Text as="span">희망 판매 수수료: </Text>
                <Text as="span" fontWeight="bold">
                  {liveShopping.desiredCommission} %
                </Text>
              </Stack>
            )}

            {type === 'seller' && (
              <Stack direction="row" alignItems="center">
                <Text as="span">희망 진행 기간: </Text>
                <Text as="span" fontWeight="bold">
                  {liveShopping.desiredPeriod}
                </Text>
              </Stack>
            )}

            <Stack>
              <Text>요청사항</Text>
              <Textarea
                resize="none"
                rows={10}
                value={liveShopping.requests || ''}
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
