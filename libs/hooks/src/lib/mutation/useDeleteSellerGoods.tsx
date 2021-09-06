import { DeleteGoodsDto } from '@project-lc/shared-types';
import { useMutation } from 'react-query';
import axios from '../../axios';

// project-lc DB Goods 테이블에 저장된 상품정보 삭제
export const useDeleteLcGoods = () => {
  return useMutation((dto: DeleteGoodsDto) => axios.delete<any>('/goods', { data: dto }));
};

// 검수 후 퍼스트몰 db fm_goods 테이블에 등록된 상품정보 삭제
export const useDeleteFmGoods = () => {
  return useMutation((dto: DeleteGoodsDto) =>
    axios.delete<any>('/fm-goods', { data: dto }),
  );
};
