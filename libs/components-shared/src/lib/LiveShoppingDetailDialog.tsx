import {
  Button,
  Grid,
  GridItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Stack,
  Text,
} from '@chakra-ui/react';
import { GridTableItem } from '@project-lc/components-layout/GridTableItem';
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
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>상세정보</ModalHeader>
        <ModalCloseButton />
        <ModalBody fontSize="sm">
          <Stack spacing={2}>
            <Grid templateColumns="1fr 2fr">
              {liveShopping.seller.sellerShop && (
                <GridTableItem
                  title="라이브쇼핑명"
                  value={
                    liveShopping.liveShoppingName ||
                    '라이브 쇼핑명은 라이브 쇼핑 확정 후, 등록됩니다.'
                  }
                />
              )}

              {liveShopping.seller.sellerShop && (
                <GridTableItem
                  title="판매자"
                  value={liveShopping.seller.sellerShop?.shopName}
                />
              )}

              <DisplayGoodsName type={type} liveShopping={liveShopping} />

              <GridTableItem
                title="진행상태"
                value={
                  <>
                    <LiveShoppingProgressBadge
                      progress={liveShopping.progress}
                      broadcastStartDate={liveShopping.broadcastStartDate}
                      broadcastEndDate={liveShopping.broadcastEndDate}
                      sellEndDate={liveShopping.sellEndDate}
                    />
                    {liveShopping.progress === LIVE_SHOPPING_PROGRESS.취소됨 ? (
                      <Text>사유 : {liveShopping.rejectionReason}</Text>
                    ) : null}
                  </>
                }
              />

              <GridItem colSpan={2} mt={4} mb={2}>
                <Text fontWeight="bold">라이브 방송 정보</Text>
              </GridItem>

              <GridTableItem
                title="방송인"
                value={
                  <>
                    {liveShopping.broadcaster ? (
                      <Stack direction="row">
                        <BroadcasterName data={liveShopping.broadcaster} />
                        <BroadcasterChannelButton
                          channelUrl={liveShopping.broadcaster?.channels[0]?.url}
                        />
                      </Stack>
                    ) : (
                      <Text fontWeight="bold">미정</Text>
                    )}
                  </>
                }
              />

              <GridTableItem
                title="방송시간"
                value={
                  !(liveShopping.broadcastStartDate && liveShopping.broadcastEndDate) ? (
                    '미정'
                  ) : (
                    <>
                      <Text as="span" fontWeight="bold">
                        {dayjs(liveShopping.broadcastStartDate).format(
                          'YYYY/MM/DD HH:mm',
                        )}
                      </Text>{' '}
                      부터{' '}
                      <Text as="span" fontWeight="bold">
                        {dayjs(liveShopping.broadcastEndDate).format('YYYY/MM/DD HH:mm')}
                      </Text>{' '}
                      까지
                    </>
                  )
                }
              />

              <GridTableItem
                title="판매시간"
                value={
                  !(liveShopping.sellStartDate && liveShopping.sellEndDate) ? (
                    '미정'
                  ) : (
                    <>
                      <Text as="span" fontWeight="bold">
                        {dayjs(liveShopping.sellStartDate).format('YYYY/MM/DD HH:mm')}
                      </Text>{' '}
                      부터{' '}
                      <Text as="span" fontWeight="bold">
                        {dayjs(liveShopping.sellEndDate).format('YYYY/MM/DD HH:mm')}
                      </Text>{' '}
                      까지
                    </>
                  )
                }
              />

              <GridItem colSpan={2} mt={4} mb={2}>
                <Text fontWeight="bold">수수료 정보</Text>
              </GridItem>

              <GridTableItem
                title="방송인 수수료"
                value={
                  liveShopping.broadcasterCommissionRate
                    ? `${liveShopping.broadcasterCommissionRate}%`
                    : '미정'
                }
              />

              {type === 'seller' && (
                <GridTableItem
                  title="판매 수수료"
                  value={
                    liveShopping.whiletrueCommissionRate
                      ? `${liveShopping.whiletrueCommissionRate}%`
                      : '미정'
                  }
                />
              )}

              <GridItem colSpan={2} mt={4} mb={2}>
                <Text fontWeight="bold">판매자 입력 정보</Text>
              </GridItem>

              {type === 'seller' && (
                <GridTableItem
                  title="희망 판매 수수료"
                  value={`${liveShopping.desiredCommission} %`}
                />
              )}

              {type === 'seller' && (
                <GridTableItem
                  title="희망 진행 기간"
                  value={`${liveShopping.desiredPeriod}`}
                />
              )}

              <GridTableItem title="요청사항" value={liveShopping.requests || '-'} />
            </Grid>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>닫기</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default LiveShoppingDetailDialog;

function DisplayGoodsName({
  type,
  liveShopping,
}: {
  type: LiveShoppingDetailDialogProps['type'];
  liveShopping: LiveShoppingWithGoods;
}): JSX.Element {
  let goodsName = '';
  let goodsConfirmStatus = '';
  if (liveShopping.goods) {
    goodsName = liveShopping.goods.goods_name;
    goodsConfirmStatus =
      liveShopping.goods.confirmation?.status !== 'confirmed' ? '(검수미완료) ' : '';
  }
  if (liveShopping.externalGoods) {
    goodsName = liveShopping.externalGoods.name;
  }
  if (type === 'broadcaster') {
    <GridTableItem title="상품명" value={goodsName} />;
  }
  return <GridTableItem title="상품명" value={goodsConfirmStatus + goodsName} />;
}
