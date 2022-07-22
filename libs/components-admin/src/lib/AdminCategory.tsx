import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Heading,
  ListItem,
  Stack,
  Text,
  UnorderedList,
  useDisclosure,
} from '@chakra-ui/react';
import { useAdminCategory } from '@project-lc/hooks';
import { useState } from 'react';
import { GiLighthouse } from 'react-icons/gi';
import { MdImage } from 'react-icons/md';
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

  // 1차 카테고리에 2차카테고리 연결
  const subCategoriesWithChildren = subCategories.map((subC) => {
    const _subSubCategories = subSubCategories
      .filter((c) => c.parentCategoryId && c.parentCategoryId === subC.id)
      .map((subSubC) => ({ ...subSubC, depth: 2 }));

    const childrenTotalGoodsCount = _subSubCategories.reduce(
      (sum, cur) => sum + cur.goodsCount,
      0,
    );
    return {
      ...subC,
      depth: 1,
      childrenCategories: _subSubCategories,
      goodsCount: subC.goodsCount + childrenTotalGoodsCount,
    };
  });

  // 메인카테고리에 1차 카테고리 연결
  // depth 2까지 (메인 > 1차 > 2차 까지만) 생성함 -> 디비조회시 raw 쿼리 재귀로 하는방법이 있을거같지만 지금은 모르겠음
  const categoryTree = mainCategories.map((mainC) => {
    const _subCategoriesWithChildren = subCategoriesWithChildren.filter(
      (c) => c.parentCategoryId && c.parentCategoryId === mainC.id,
    );

    const childrenTotalGoodsCount = _subCategoriesWithChildren.reduce(
      (sum, cur) => sum + cur.goodsCount,
      0,
    );
    return {
      ...mainC,
      depth: 0,
      childrenCategories: _subCategoriesWithChildren,
      goodsCount: mainC.goodsCount + childrenTotalGoodsCount,
    };
  });
  return (
    <Stack>
      <Stack direction="row">
        <Heading>상품 카테고리</Heading>
      </Stack>

      <CategoryCreateFormDialog
        isOpen={createDialog.isOpen}
        onClose={createDialog.onClose}
      />

      <UnorderedList spacing={0} listStyleType="none">
        <ListItem>
          <Text>
            * 괄호안의 숫자는 해당 카테고리에 포함된 상품의 개수입니다(상위 카테고리 상품
            개수는 하위 카테고리 상품 개수를 포함)
          </Text>
        </ListItem>
        <ListItem>
          <Text>
            * 이미지가 등록된 카테고리는{' '}
            <MdImage
              style={{ display: 'inline-block', verticalAlign: 'middle' }}
              color="green"
            />{' '}
            표시가 적용되어있습니다.
          </Text>
        </ListItem>
        <ListItem>
          <Text>
            * 쇼핑페이지에 전시중인 카테고리는{' '}
            <GiLighthouse
              color="blue"
              style={{ display: 'inline-block', verticalAlign: 'middle' }}
            />{' '}
            표시가 적용되어있습니다.
          </Text>
        </ListItem>
        <ListItem>
          <Text>* 상품이 연결되어 있는 카테고리는 삭제할 수 없습니다</Text>
        </ListItem>
        <ListItem>
          <Text>* 상위 카테고리를 삭제하면 연결된 하위 카테고리도 함께 삭제됩니다</Text>
        </ListItem>
      </UnorderedList>

      <Box>
        <Button leftIcon={<AddIcon />} size="sm" onClick={createDialog.onOpen}>
          메인 카테고리 만들기
        </Button>
      </Box>

      {/* 카테고리 목록 */}
      <Stack minW="500px" w="100%" maxW="600px" fontSize="sm" spacing={0}>
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
