import { GoodsByIdRes } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { Text, Stack } from '@chakra-ui/react';
import { AiTwotoneExperiment } from 'react-icons/ai';
import { BsFillDisplayFill } from 'react-icons/bs';
import { IoImagesOutline } from 'react-icons/io5';
import { MdDateRange } from 'react-icons/md';
import { InfoIcon } from '@chakra-ui/icons';
import { SummaryList } from '..';
import { GOODS_CONFIRMATION_STATUS } from '../constants/goodsStatus';

export interface GoodsDetailSummaryProps {
  goods: GoodsByIdRes;
}
export function GoodsDetailSummary({ goods }: GoodsDetailSummaryProps): JSX.Element {
  const { status, rejectionReason } = goods.confirmation;
  const confirmationStatusText = `검수상태 : ${GOODS_CONFIRMATION_STATUS[status].label}`;
  const confirmationValue =
    status === 'rejected' ? (
      <Stack whiteSpace="break-spaces">
        <Text>{confirmationStatusText}</Text>
        <Text>

          <InfoIcon mr={1} />
          상품 검수가 반려되었습니다. <br />
          아래 검수 반려 사유를 참고하여 상품 정보를 수정 하신 후 다시 등록해주세요.
        </Text>
        <Text
          whiteSpace="break-spaces"
          borderWidth="1px"
          borderRadius="lg"
          p={4}
          height="100%"
        >
          {rejectionReason}
        </Text>
      </Stack>
    ) : (
      confirmationStatusText
    );
  return (
    <SummaryList
      spacing={3}
      listItems={[
        {
          id: '등록일',
          value: `등록일 ${dayjs(goods.regist_date).format('YYYY년 MM월 DD일 HH:mm:ss')}`,
          icon: MdDateRange,
        },
        {
          id: '대표이미지',
          value: `상품 이미지 ${goods.image.length} 개`,
          icon: IoImagesOutline,
        },
        {
          id: '검수',
          value: confirmationValue,
          icon: AiTwotoneExperiment,
          iconColor: goods.confirmation?.status === 'rejected' ? 'orange.400' : undefined,
        },
        {
          id: '노출여부',
          value: `${
            goods.goods_view === 'notLook' ? '상품 노출되지 않고 있음' : '상품 노출중'
          }`,
          iconColor: goods.goods_view === 'notLook' ? 'orange.400' : undefined,
          icon: BsFillDisplayFill,
        },
      ]}
    />
  );
}
