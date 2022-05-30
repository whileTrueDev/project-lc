import {
  FormControl,
  FormLabel,
  Spinner,
  Switch,
  useToast,
  VisuallyHidden,
} from '@chakra-ui/react';
import { GoodsView } from '@prisma/client';
import { GOODS_VIEW } from '@project-lc/components-constants/goodsStatus';
import { useChangeGoodsView } from '@project-lc/hooks';
import { useQueryClient } from 'react-query';

export function GoodsExposeSwitch({
  goodsId,
  goodsView,
  isReadOnly = false,
}: {
  goodsId: number;
  goodsView: GoodsView;
  isReadOnly?: boolean;
}): JSX.Element {
  const queryClient = useQueryClient();
  const changeGoodsView = useChangeGoodsView();
  const toast = useToast();
  const changeView = async (): Promise<void> => {
    try {
      await changeGoodsView.mutateAsync({
        id: goodsId,
        view: goodsView === 'look' ? 'notLook' : 'look',
      });
      queryClient.invalidateQueries('SellerGoodsList', { refetchInactive: true });
      queryClient.invalidateQueries('GoodsById');
    } catch (error) {
      console.error(error);
      toast({
        description: '상품 상태 변경 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        status: 'error',
      });
    }
  };
  const label = GOODS_VIEW[goodsView];
  return (
    <FormControl height="100%">
      <VisuallyHidden>
        <FormLabel htmlFor={`${goodsId}_view_switch`} fontSize="sm">
          {label}
        </FormLabel>
      </VisuallyHidden>
      {changeGoodsView.isLoading ? (
        <Spinner size="sm" />
      ) : (
        <Switch
          id={`${goodsId}_view_switch`}
          isChecked={goodsView === 'look'}
          onChange={changeView}
          isDisabled={isReadOnly}
        />
      )}
    </FormControl>
  );
}
