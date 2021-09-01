import {
  FormControl,
  FormLabel,
  Switch,
  Spinner,
  VisuallyHidden,
} from '@chakra-ui/react';
import { useChangeFmGoodsView, useChangeGoodsView } from '@project-lc/hooks';
import { GoodsView } from '@prisma/client';
import { useQueryClient } from 'react-query';
import { GOODS_VIEW } from '../constants/goodsStatus';

export function GoodsExposeSwitch({
  goodsId,
  goodsView,
  confirmedGoodsId,
}: {
  goodsId: number;
  goodsView: GoodsView;
  confirmedGoodsId?: number;
}) {
  const queryClient = useQueryClient();
  const changeGoodsView = useChangeGoodsView();
  const changeFmGoodsView = useChangeFmGoodsView();
  const changeView = async () => {
    try {
      if (confirmedGoodsId) {
        // 검수된 상품의 경우 fm-goods에서도 수정
        console.log({ confirmedGoodsId });
        await changeFmGoodsView.mutateAsync({
          id: confirmedGoodsId,
          view: goodsView === 'look' ? 'notLook' : 'look',
        });
      }
      // 미검수 상품의 경우 Goods에서 수정
      console.log({ goodsId });
      await changeGoodsView.mutateAsync({
        id: goodsId,
        view: goodsView === 'look' ? 'notLook' : 'look',
      });
      queryClient.invalidateQueries('SellerGoodsList');
    } catch (error) {
      console.error(error);
    }
  };
  const label = GOODS_VIEW[goodsView];
  return (
    <FormControl height="100%" display="flex" alignItems="center" justifyContent="center">
      <VisuallyHidden>
        <FormLabel htmlFor={`${goodsId}_view_switch`} fontSize="sm">
          {label}
        </FormLabel>
      </VisuallyHidden>
      {changeFmGoodsView.isLoading || changeGoodsView.isLoading ? (
        <Spinner size="sm" />
      ) : (
        <Switch
          id={`${goodsId}_view_switch`}
          isChecked={goodsView === 'look'}
          onChange={changeView}
        />
      )}
    </FormControl>
  );
}
