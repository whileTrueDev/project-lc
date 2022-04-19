import { Button, Heading, Stack, Text, useDisclosure } from '@chakra-ui/react';
import { useAdminCategory } from '@project-lc/hooks';
import { useState } from 'react';
import { CategoryCreateFormDialog } from './AdminCategoryCreateDialog';
import { CategoryItem } from './AdminCategoryItem';

export function AdminCategory(): JSX.Element {
  const createDialog = useDisclosure();
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
        <Heading>상품 카테고리</Heading>
        <Button size="sm" onClick={createDialog.onOpen}>
          메인 카테고리 만들기
        </Button>
      </Stack>

      <CategoryCreateFormDialog
        isOpen={createDialog.isOpen}
        onClose={createDialog.onClose}
      />

      {/* 카테고리 목록 */}
      <Stack w="400px">
        {categoryTree.map((mainC) => (
          <CategoryItem
            key={mainC.id}
            item={mainC}
            onClick={(id) => setSelectedCategoryId(id)}
            selectedCategoryId={selectedCategoryId}
          />
        ))}
      </Stack>
    </Stack>
  );
}

export default AdminCategory;
