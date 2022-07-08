import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  IconButton,
  Input,
  ListItem,
  Spinner,
  Stack,
  Text,
  UnorderedList,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import SectionWithTitle from '@project-lc/components-layout/SectionWithTitle';
import { useGoodsCategory, useGoodsInformationSubjectById } from '@project-lc/hooks';
import { GoodsCategoryItem, RegistGoodsDto } from '@project-lc/shared-types';
import { goodsRegistStore } from '@project-lc/stores';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

export function GoodsRegistCategory(): JSX.Element {
  const selectedCategory = goodsRegistStore((s) => s.selectedCategory);
  const handleCaregorySelect = goodsRegistStore((s) => s.handleCaregorySelect);
  const { setValue } = useFormContext<RegistGoodsDto>();
  const handleClick = (category: GoodsCategoryItem): void => {
    setValue('categoryId', category.id);
    handleCaregorySelect(category);
  };

  return (
    <SectionWithTitle title="상품 카테고리" variant="outlined">
      <FormControl>
        <Text>선택된 카테고리: {selectedCategory?.name}</Text>
        <UnorderedList fontSize="xs" color="GrayText">
          <ListItem>아래 카테고리 트리에서 선택해주세요.</ListItem>
        </UnorderedList>
        <Categories onCategoryClick={handleClick} />
      </FormControl>

      <Box my={2}>
        <GoodsRegistInformationNotice
          informationSubjectId={selectedCategory?.informationSubjectId}
        />
      </Box>
    </SectionWithTitle>
  );
}

export default GoodsRegistCategory;

interface CategoriesProps {
  onCategoryClick: (category: GoodsCategoryItem) => void;
}
function Categories({ onCategoryClick }: CategoriesProps): JSX.Element | null {
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
function Category({ depth = 0, category, onClick }: CategoryProps): JSX.Element {
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

function GoodsRegistInformationNotice({
  informationSubjectId,
}: {
  informationSubjectId?: GoodsCategoryItem['informationSubjectId'] | null;
}): JSX.Element | null {
  const { initializeNotice, informationNotice, handleChange } = goodsRegistStore();
  const { data } = useGoodsInformationSubjectById(informationSubjectId);

  useEffect(() => {
    if (data) initializeNotice(data.items);
  }, [data, initializeNotice]);

  if (!data) return null;
  return (
    <Box>
      <Box mb={2}>
        <Text fontSize="xl" fontWeight="bold">
          품목별 필수 정보
          <Text as="span" fontSize="sm">
            {` (${data.subject})`}
          </Text>
        </Text>

        <UnorderedList fontSize="xs" color="GrayText">
          <ListItem>
            항목을 비워두는 경우 상세설명 및 상세이미지 참조로 작성됩니다.
          </ListItem>
        </UnorderedList>
      </Box>
      {informationNotice &&
        Object.keys(data.items as object).map((key) => (
          <FormControl key={key}>
            <Grid templateColumns="repeat(4, 1fr)" gap={2} mb={2}>
              <GridItem colSpan={[4, 4, 1]}>
                <FormLabel fontSize="sm" fontWeight="normal">
                  {key}
                </FormLabel>
              </GridItem>
              <GridItem colSpan={[4, 4, 3]}>
                <Input
                  size="sm"
                  placeholder="상세설명 및 상세이미지 참조"
                  value={
                    key === '소비자상담 관련 전화번호'
                      ? data.items[key]
                      : informationNotice[key]
                  }
                  isReadOnly={key === '소비자상담 관련 전화번호'}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              </GridItem>
            </Grid>
          </FormControl>
        ))}
    </Box>
  );
}
