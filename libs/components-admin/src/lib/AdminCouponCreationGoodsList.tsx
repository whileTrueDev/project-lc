import { Box } from '@chakra-ui/react';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { GridColumns } from '@material-ui/data-grid';
import { useAdminAllConfirmedLcGoodsListWithCategory } from '@project-lc/hooks';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { CouponDto } from '@project-lc/shared-types';
import { CreateCouponData } from './AdminCreateCouponDialog';

const columns: GridColumns = [
  { field: 'id', headerName: 'id', width: 10 },
  { field: 'goods_name', headerName: '상품명', flex: 1 },
  { field: 'category', headerName: '카테고리' },
];

export function AdminCouponCreationGoodsList(): JSX.Element {
  const { setValue } = useFormContext<CreateCouponData>();
  const { data: goodsData } = useAdminAllConfirmedLcGoodsListWithCategory();
  const [selectionModel, setSelectionModel] = useState<CouponDto['goods']>([]);

  const handleSelection = (value: CouponDto['goods']): void => {
    setSelectionModel(value);
    setValue('goods', value);
  };

  return (
    <Box>
      {goodsData && (
        <ChakraDataGrid
          rows={goodsData}
          columns={columns}
          minH={500}
          onSelectionModelChange={(newSelectionModel) => {
            handleSelection(newSelectionModel as CouponDto['goods']);
          }}
          selectionModel={selectionModel}
          checkboxSelection
        />
      )}
    </Box>
  );
}
