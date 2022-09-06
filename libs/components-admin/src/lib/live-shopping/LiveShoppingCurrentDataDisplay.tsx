import {
  Alert,
  AlertDescription,
  Box,
  Button,
  Divider,
  Link,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { GoodsConfirmationStatuses } from '@prisma/client';
import { LiveShoppingProgressBadge } from '@project-lc/components-shared/LiveShoppingProgressBadge';
import {
  LiveShoppingKkshowGoodsData,
  LiveShoppingWithGoods,
  LIVE_SHOPPING_PROGRESS,
} from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import AdminLiveShoppingBroadcasterName from '../AdminLiveShoppingBroadcasterName';
import AdminLiveShoppingSpecialPrice from './AdminLiveShoppingSpecialPrice';

function getDuration(startDate: Date | null, endDate: Date | null): string {
  if (startDate && startDate) {
    const startTime = dayjs(startDate);
    const endTime = dayjs(endDate);
    const duration = endTime.diff(startTime);
    const hours = duration / (1000 * 60 * 60);
    const stringfiedHours = hours.toFixed(1);
    return `${stringfiedHours}시간`;
  }
  return '미정';
}
export function LiveShoppingCurrentDataDisplay({
  liveShopping,
}: {
  liveShopping: LiveShoppingWithGoods;
}): JSX.Element {
  return (
    <Stack spacing={5}>
      <Box>
        {liveShopping.externalGoods && (
          <Text fontWeight="bold" color="red">
            * 크크쇼에 등록된 상품이 아닌, 외부 상품으로 진행하는 라이브커머스입니다
          </Text>
        )}
        <Stack direction="row">
          <Text as="span">상품명 :</Text>
          {liveShopping.externalGoods && (
            <Link href={liveShopping.externalGoods.linkUrl} isExternal color="blue">
              <Text as="span" color="red" fontSize="xs">
                [외부상품]
              </Text>
              {liveShopping.externalGoods.name}
              <ExternalLinkIcon mx="2px" />
            </Link>
          )}
          {liveShopping.goods && (
            <Text color="blue">
              <KkshowGoodsConfirmationStatusText goods={liveShopping.goods} />
              {liveShopping.goods.goods_name}
            </Text>
          )}
        </Stack>
        {liveShopping.goods && liveShopping.goodsId && (
          <LiveShoppingKkshowGoodsConfirmationAlert
            goods={liveShopping.goods}
            goodsId={liveShopping.goodsId}
          />
        )}
      </Box>
      <Stack direction="row">
        <Text as="span">판매자 :</Text>
        <Text color="blue">{liveShopping.seller.sellerShop?.shopName || ''}</Text>
      </Stack>

      <Stack direction="row" alignItems="center">
        <Text as="span">현재 진행상태</Text>
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
      <Stack direction="row" alignItems="center">
        <Text as="span">방송인: </Text>
        {liveShopping.broadcaster ? (
          <AdminLiveShoppingBroadcasterName
            data={liveShopping.broadcaster}
            color="blue"
          />
        ) : (
          <Text fontWeight="bold">미정</Text>
        )}
      </Stack>
      <Stack direction="row" alignItems="center">
        <Text as="span">방송시작 시간: </Text>
        <Text as="span" fontWeight="bold" color="blue">
          {liveShopping.broadcastStartDate
            ? dayjs(liveShopping.broadcastStartDate).format('YYYY/MM/DD HH:mm')
            : '미정'}
        </Text>
      </Stack>

      <Stack direction="row" alignItems="center">
        <Text as="span">방송종료 시간: </Text>
        <Text as="span" fontWeight="bold" color="blue">
          {liveShopping.broadcastEndDate
            ? dayjs(liveShopping.broadcastEndDate).format('YYYY/MM/DD HH:mm')
            : '미정'}
        </Text>
      </Stack>

      <Stack direction="row" alignItems="center">
        <Text as="span">방송시간: </Text>
        <Text as="span" fontWeight="bold" color="blue">
          {getDuration(liveShopping.broadcastStartDate, liveShopping.broadcastEndDate)}
        </Text>
      </Stack>
      {liveShopping.progress === 'confirmed' && liveShopping.liveShoppingVideo && (
        <Stack direction="row" alignItems="center">
          <Text as="span">영상 URL: </Text>
          <Text as="span" fontWeight="bold" color="blue">
            <Link
              isTruncated
              href={liveShopping.liveShoppingVideo.youtubeUrl || ''}
              fontWeight="bold"
              colorScheme="blue"
              textDecoration="underline"
              isExternal
            >
              {liveShopping.liveShoppingVideo.youtubeUrl || ''}
            </Link>
          </Text>
        </Stack>
      )}

      <Divider />

      <Stack direction="row" alignItems="center">
        <Text as="span">판매시작 시간: </Text>
        <Text as="span" fontWeight="bold" color="blue">
          {liveShopping.sellStartDate
            ? dayjs(liveShopping.sellStartDate).format('YYYY/MM/DD HH:mm')
            : '미정'}
        </Text>
      </Stack>

      <Stack direction="row" alignItems="center">
        <Text as="span">판매종료 시간: </Text>
        <Text as="span" fontWeight="bold" color="blue">
          {liveShopping.sellEndDate
            ? dayjs(liveShopping.sellEndDate).format('YYYY/MM/DD HH:mm')
            : '미정'}
        </Text>
      </Stack>
      <Stack direction="row" alignItems="center">
        <Text as="span">판매시간: </Text>
        <Text as="span" fontWeight="bold" color="blue">
          {getDuration(liveShopping.sellStartDate, liveShopping.sellEndDate)}
        </Text>
      </Stack>

      <Box>
        <Text fontWeight="bold">구매 메시지 설정</Text>
        <Text>비회원 팬닉: </Text>
        <Text as="span" fontWeight="bold" color="blue">
          {liveShopping.messageSetting?.fanNick || ''}
        </Text>

        <Text>1,2단계 구매메시지 기준 금액: </Text>
        <Text as="span" fontWeight="bold" color="blue">
          {liveShopping.messageSetting?.levelCutOffPoint || ''}
        </Text>

        <Text>TTS 설정: </Text>
        <Text as="span" fontWeight="bold" color="blue">
          {liveShopping.messageSetting?.ttsSetting || ''}
        </Text>
      </Box>

      <Divider />
      <Stack direction="row" alignItems="center">
        <Text as="span">희망 판매 수수료: </Text>
        <Text as="span" fontWeight="bold" color="blue">
          {liveShopping.desiredCommission} %
        </Text>
      </Stack>

      <Stack direction="row" alignItems="center">
        <Text as="span">희망 진행 기간: </Text>
        <Text as="span" fontWeight="bold" color="blue">
          {liveShopping.desiredPeriod}
        </Text>
      </Stack>

      <Divider />
      <Stack direction="row" alignItems="center">
        <Text as="span">방송인 수수료: </Text>
        <Text as="span" fontWeight="bold" color="blue">
          {liveShopping.broadcasterCommissionRate
            ? `${liveShopping.broadcasterCommissionRate}%`
            : '미정'}
        </Text>
      </Stack>

      <Stack direction="row" alignItems="center">
        <Text as="span">와일트루 수수료: </Text>
        <Text as="span" fontWeight="bold" color="blue">
          {liveShopping.whiletrueCommissionRate
            ? `${liveShopping.whiletrueCommissionRate}%`
            : '미정'}
        </Text>
      </Stack>

      <Divider />

      {/* 크크쇼 상품으로 진행하는 경우에만 - 라이브쇼핑 특가정보 표시 및 수정 */}
      {liveShopping.goods && (
        <AdminLiveShoppingSpecialPrice liveShopping={liveShopping} />
      )}

      <Divider />

      <Box>
        <Text>요청사항</Text>
        <Textarea resize="none" rows={10} value={liveShopping.requests || ''} readOnly />
      </Box>
    </Stack>
  );
}

export default LiveShoppingCurrentDataDisplay;

function KkshowGoodsConfirmationStatusText({
  goods,
}: {
  goods: LiveShoppingKkshowGoodsData;
}): JSX.Element {
  return (
    <Text as="span" color="red">
      {goods.confirmation?.status === GoodsConfirmationStatuses.waiting ||
        (goods.confirmation?.status === GoodsConfirmationStatuses.needReconfirmation &&
          `(검수미완료) `)}
      {goods.confirmation?.status === GoodsConfirmationStatuses.rejected &&
        `(검수거절상품) `}
    </Text>
  );
}

/** 크크쇼  상품으로 라이브 진행하는 경우 - 검수완료 되지 않은경우 검수하라는 메시지 표시 */
function LiveShoppingKkshowGoodsConfirmationAlert({
  goods,
  goodsId,
}: {
  goods: LiveShoppingKkshowGoodsData;
  goodsId: number;
}): JSX.Element {
  const router = useRouter();
  if (!goods?.confirmation || goods?.confirmation.status === 'confirmed') {
    return <></>;
  }
  return (
    <Alert status="info" variant="left-accent" rounded="md">
      <AlertDescription>
        {goods?.confirmation?.status === GoodsConfirmationStatuses.rejected
          ? '해당 상품은 검수 거절된 상품입니다. (라이브쇼핑을 취소하세요.)'
          : '검수 미완료 상태이므로 상품 검수부터 진행해야 합니다.'}
        <Button size="xs" onClick={() => router.push(`/goods/${goodsId}`)}>
          상품 검수 이동하기
        </Button>
      </AlertDescription>
    </Alert>
  );
}
