import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  IconButton,
  ListItem,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  UnorderedList,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import SectionWithTitle from '@project-lc/components-layout/SectionWithTitle';
import { useGoodsCategory } from '@project-lc/hooks';
import { GoodsCategoryItem } from '@project-lc/shared-types';
import { goodsRegistStore } from '@project-lc/stores';

export function GoodsRegistCategory(): JSX.Element {
  const selectedCategories = goodsRegistStore((s) => s.selectedCategories);
  const addToSelectedCategories = goodsRegistStore((s) => s.addToSelectedCategories);
  const removeFromSelectedCategories = goodsRegistStore(
    (s) => s.removeFromSelectedCategories,
  );

  const handleClick = (category: GoodsCategoryItem): void => {
    addToSelectedCategories(category);
  };

  return (
    <SectionWithTitle title="상품 카테고리" variant="outlined">
      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={8}>
        <FormControl>
          <Text fontSize="xs" color="GrayText">
            아래 카테고리 트리에서 선택해주세요.
          </Text>
          <Categories onCategoryClick={handleClick} />
        </FormControl>

        {/* 카테고리 트리에서 선택한 카테고리가 표시되는 목록 */}
        <Stack spacing={1}>
          <Text fontSize="xs" color="GrayText">
            상품에 연결될 카테고리 목록
          </Text>
          <Stack spacing={1} fontWeight="normal" fontSize="sm">
            {selectedCategories.length === 0 && <Text>없음</Text>}
            {selectedCategories.map((c) => (
              <Stack direction="row" key={c.id}>
                <Box>{c.name}</Box>
                <Button size="xs" onClick={() => removeFromSelectedCategories(c.id)}>
                  해제
                </Button>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </SimpleGrid>
    </SectionWithTitle>
  );
}

export default GoodsRegistCategory;

interface CategoriesProps {
  onCategoryClick: (category: GoodsCategoryItem) => void;
}
export function Categories({ onCategoryClick }: CategoriesProps): JSX.Element | null {
  const { data, isLoading } = useGoodsCategory({ mainCategoryFlag: true });
  if (isLoading)
    return (
      <Center>
        <Spinner />
      </Center>
    );
  if (!data) return null;
  return (
    <Stack spacing={1}>
      {data.map((mainCategory) => (
        <Category
          key={mainCategory.id}
          category={mainCategory}
          onClick={onCategoryClick}
        />
      ))}
    </Stack>
  );
}

interface CategoryProps {
  depth?: number;
  category: GoodsCategoryItem;
  onClick: (category: GoodsCategoryItem) => void;
}
export function Category({ depth = 0, category, onClick }: CategoryProps): JSX.Element {
  const subCategory = useDisclosure();
  const subCategories = useGoodsCategory(
    { parentCategoryId: category.id },
    {
      enabled: !!(
        category.id &&
        category._count.childrenCategories > 0 &&
        subCategory.isOpen
      ),
    },
  );
  return (
    <Box mt={2}>
      <Flex key={category.id} gap={2} ml={depth}>
        <Box w={4} mr={1}>
          {category._count.childrenCategories > 0 ? (
            <IconButton
              onClick={subCategory.onToggle}
              size="xs"
              variant="solid"
              aria-label="sub-category-btn"
              icon={subCategory.isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
            />
          ) : null}
        </Box>
        <Button
          variant="link"
          onClick={() => {
            onClick(category);
          }}
          color={useColorModeValue('blackAlpha.900', 'whiteAlpha.900')}
          fontWeight="normal"
          fontSize="sm"
          justifyContent="flex-start"
        >
          {category.name}{' '}
          {category._count.childrenCategories
            ? `(${category._count.childrenCategories})`
            : null}
        </Button>
      </Flex>

      {subCategories.isLoading && <Spinner />}
      {subCategory.isOpen && subCategories.data && (
        <Stack>
          {subCategories.data.map((c2) => (
            <Category
              key={c2.id}
              category={c2}
              depth={(depth || 0) + 4}
              onClick={onClick}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}
