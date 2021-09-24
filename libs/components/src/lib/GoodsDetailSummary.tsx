import { GoodsConfirmationStatuses } from '@prisma/client';
import { GoodsByIdRes } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { AiTwotoneExperiment } from 'react-icons/ai';
import { IoImagesOutline } from 'react-icons/io5';
import { MdDateRange } from 'react-icons/md';
import { SummaryList } from '..';
import { GOODS_CONFIRMATION_STATUS } from '../constants/goodsStatus';

export interface GoodsDetailSummaryProps {
  goods: GoodsByIdRes;
}
export function GoodsDetailSummary({ goods }: GoodsDetailSummaryProps) {
  return (
    <SummaryList
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
        // {
        //   id: '검수',
        //   value: `검수상태 ${
        //     GOODS_CONFIRMATION_STATUS[
        //       goods.confirmation?.status as GoodsConfirmationStatuses
        //     ]?.label || ''
        //   }`,
        //   icon: AiTwotoneExperiment,
        //   disabled: !goods.confirmation,
        // },
      ]}
    />
  );
}
