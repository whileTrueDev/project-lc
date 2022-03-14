import { ChakraAutoComplete } from '@project-lc/components-core/ChakraAutoComplete';
import { useAdminLiveShoppingList } from '@project-lc/hooks';
import { LiveShoppingWithGoods } from '@project-lc/shared-types';
import React from 'react';

/** 크크쇼메인데이터 중 라이브방송정보(라이브방송,판매상품,방송인) 조회하기 위한 autocomplete컴포넌트 */

export function LiveShoppingListAutoComplete({
  onChange,
}: {
  onChange: (item: LiveShoppingWithGoods | null) => void;
}): JSX.Element {
  const { data: liveShoppingList } = useAdminLiveShoppingList({}, { enabled: true });
  return (
    <ChakraAutoComplete
      options={
        liveShoppingList
          ? liveShoppingList.filter((l) =>
              ['adjusting', 'confirmed'].includes(l.progress),
            )
          : []
      }
      getOptionLabel={(option) => option?.liveShoppingName || ''}
      onChange={(newItem) => {
        onChange(newItem || null);
      }}
    />
  );
}
