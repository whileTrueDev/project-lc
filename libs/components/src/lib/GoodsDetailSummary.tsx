import { GoodsConfirmationStatuses } from '@prisma/client';
import { GoodsByIdRes } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { AiTwotoneExperiment } from 'react-icons/ai';
import { BsFillDisplayFill } from 'react-icons/bs';
import { IoImagesOutline } from 'react-icons/io5';
import { MdDateRange } from 'react-icons/md';
import { SummaryList } from '..';
import { GOODS_CONFIRMATION_STATUS } from '../constants/goodsStatus';

export interface GoodsDetailSummaryProps {
  goods: GoodsByIdRes;
}
export function GoodsDetailSummary({ goods }: GoodsDetailSummaryProps): JSX.Element {
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
        {
          id: '검수',
          value: `검수상태 ${
            GOODS_CONFIRMATION_STATUS[
              goods.confirmation?.status as GoodsConfirmationStatuses
            ]?.label || ''
          }`,
          icon: AiTwotoneExperiment,
          iconColor: goods.confirmation?.status === 'rejected' ? 'orange.400' : undefined,
          disabled: !goods.confirmation,
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
