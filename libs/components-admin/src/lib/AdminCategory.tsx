import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { CloseButton, IconButton, Stack, Text, useBoolean } from '@chakra-ui/react';
import { useAdminCategory } from '@project-lc/hooks';
import { CategoryWithGoodsCount } from '@project-lc/shared-types';
import { useState } from 'react';

export function AdminCategory(): JSX.Element {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const { data, isLoading } = useAdminCategory();
  if (isLoading) return <Text>loading...</Text>;
  if (!data || !data.length) return <Text>no data...</Text>;

  // 메인카테고리
  const mainCategories = data.filter((d) => d.mainCategoryFlag === true);
  const mainCategoryIdList = mainCategories.map((c) => c.id);
  // 1차 카테고리
  const subCategories = data.filter(
    (c) => c.parentCategoryId && mainCategoryIdList.includes(c.parentCategoryId),
  );
  const subCategoryIdList = subCategories.map((c) => c.id);
  // 2차 카테고리
  const subSubCategories = data.filter(
    (c) => c.parentCategoryId && subCategoryIdList.includes(c.parentCategoryId),
  );

  // 각 카테고리 내에 childrenCategories 넣어서 트리구조로 만듦
  const categoryTree = mainCategories.map((mainC) => {
    return {
      ...mainC,
      childrenCategories: subCategories
        .filter((c) => c.parentCategoryId && c.parentCategoryId === mainC.id)
        .map((subC) => {
          return {
            ...subC,
            childrenCategories: subSubCategories.filter(
              (c) => c.parentCategoryId && c.parentCategoryId === subC.id,
            ),
          };
        }),
    };
  });
  return (
    <Stack>
      <Stack direction="row">
        <Text>선택된 카테고리 : </Text>
        {selectedCategoryId && (
          <>
            <Text>{data.find((c) => c.id === selectedCategoryId)?.name}</Text>
            <CloseButton size="sm" onClick={() => setSelectedCategoryId(null)} />
          </>
        )}
      </Stack>

      {categoryTree.map((mainC) => (
        <CategoryItem
          key={mainC.id}
          item={mainC}
          onClick={(id) => setSelectedCategoryId(id)}
          selectedCategoryId={selectedCategoryId}
        />
      ))}
    </Stack>
  );
}

export default AdminCategory;

type CategoryItemType = CategoryWithGoodsCount & {
  childrenCategories?: CategoryItemType[];
};
interface CategoryItemProps {
  item: CategoryItemType;
  onClick?: (id: number) => void;
  selectedCategoryId: number | null;
}

function CategoryItem(props: CategoryItemProps): JSX.Element {
  const [open, { toggle }] = useBoolean(false);
  const { onClick, item, selectedCategoryId } = props;
  const { id, name, childrenCategories, mainCategoryFlag } = item;
  const hasChildren = childrenCategories && childrenCategories.length > 0;
  return (
    <Stack borderWidth="1px" borderRadius="md" p={1}>
      <Stack direction="row">
        <Text>
          {!mainCategoryFlag && (
            <Text as="span" color="gray.400">
              ㄴ
            </Text>
          )}
          {hasChildren && (
            <IconButton
              aria-label={open ? '닫기' : '열기'}
              size="xs"
              mr={1}
              onClick={toggle}
              icon={open ? <ChevronUpIcon /> : <ChevronDownIcon />}
            />
          )}
          <Text
            as="span"
            onClick={() => {
              if (onClick) onClick(id);
              if (hasChildren) toggle();
            }}
            color={selectedCategoryId === id ? 'red' : undefined}
            cursor="pointer"
          >
            {name}
          </Text>
        </Text>
      </Stack>
      {open && (
        <Stack pl={6}>
          {hasChildren &&
            childrenCategories.map((child) => (
              <CategoryItem
                key={child.id}
                item={child}
                onClick={onClick}
                selectedCategoryId={selectedCategoryId}
              />
            ))}
        </Stack>
      )}
    </Stack>
  );
}
