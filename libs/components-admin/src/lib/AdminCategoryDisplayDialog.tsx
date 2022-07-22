import { Box, ListItem, Stack, Text, UnorderedList, useToast } from '@chakra-ui/react';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import {
  useAdminCategory,
  useAdminShoppingCategoryAddMutation,
  useAdminShoppingCategoryRemoveMutation,
} from '@project-lc/hooks';
import { CategoryWithGoodsCount } from '@project-lc/shared-types';
import { useMemo } from 'react';

export type CategoryItemType = CategoryWithGoodsCount & {
  childrenCategories?: CategoryItemType[];
  depth: number;
};
export function CategoryDisplayDiaglog({
  category,
  isOpen,
  onClose,
}: {
  category: CategoryItemType;
  isOpen: boolean;
  onClose: () => void;
}): JSX.Element {
  const toast = useToast();
  const { mutateAsync: addCategory } = useAdminShoppingCategoryAddMutation();
  const { mutateAsync: removeCategory } = useAdminShoppingCategoryRemoveMutation();

  const onConfirm = async (): Promise<void> => {
    if (category.kkshowShoppingTabCategory) {
      // 이미 전시되고 있는 경우
      removeCategory({ categoryCode: category.categoryCode })
        .then(() => {
          toast({ status: 'success', title: '카테고리를 전시목록에서 제거했습니다.' });
        })
        .catch((err) => {
          console.error(err);
          toast({
            status: 'error',
            title: '카테고리를 전시목록에서 제거하는 도중 오류가 발생했습니다.',
            description: err,
          });
        });
    } else {
      addCategory({ categoryCode: category.categoryCode })
        .then((res) => {
          toast({ status: 'success', title: '카테고리를 전시목록에 추가하였습니다' });
        })
        .catch((e) => {
          console.error(e);
          toast({
            status: 'error',
            title: '카테고리를 전시목록에 추가하는 도중 오류가 발생했습니다.',
            description: e,
          });
        });
    }
  };

  const title = useMemo(() => {
    if (category.kkshowShoppingTabCategory) {
      return `"${category.name}" 카테고리를 전시목록에서 제거하시겠습니까?`;
    }
    return `"${category.name}" 카테고리를 전시목록에 추가하시겠습니까?`;
  }, [category.kkshowShoppingTabCategory, category.name]);

  const categories = useAdminCategory();
  const displayedCategories = useMemo(() => {
    return categories.data?.filter((cate) => !!cate.kkshowShoppingTabCategory) || [];
  }, [categories.data]);

  const isInValid = useMemo(() => {
    if (category.kkshowShoppingTabCategory) {
      // 카테고리 목록에서 제거하는 경우, 5개이하가 되면 안됨
      return !!((displayedCategories?.length || 0) <= 5);
    }
    // 새로 추가하는 경우 10개 초과로 설정할 수 없음.
    if (!displayedCategories?.length) return false;
    if (displayedCategories.length >= 10) return true;
    return false;
  }, [category.kkshowShoppingTabCategory, displayedCategories?.length]);

  return (
    <ConfirmDialog
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      isDisabled={isInValid}
    >
      <Stack>
        <UnorderedList fontSize="sm">
          <ListItem>
            <Text>이 작업을 진행하면 해당 카테고리가 크크마켓(쇼핑탭)이 변경됩니다.</Text>
          </ListItem>
          <ListItem>
            <Text>
              전시 카테고리의 최소 개수는 5개입니다. 카테고리 제거로 총 카테고리 개수가
              5개 미만이 되는 경우 삭제가 불가능합니다.
            </Text>
          </ListItem>
          <ListItem>
            <Text>
              전시 카테고리의 최대 개수는 10개 입니다. 카테고리 추가로 최대 개수가 10개를
              초과하게 되는 경우 진행이 불가합니다.
            </Text>
          </ListItem>
        </UnorderedList>
        <Box>
          <Text fontWeight="bold">
            현재 전시중인 카테고리 목록 ({displayedCategories?.length})
          </Text>
          <UnorderedList>
            {displayedCategories?.map((cate) => (
              <ListItem key={cate.id}>
                <Text color={cate.id === category.id ? 'red' : undefined}>
                  {cate.name}
                </Text>
              </ListItem>
            ))}
            {/* 새로운 카테고리 추가의 경우 표시 */}
            {!category.kkshowShoppingTabCategory && (
              <ListItem>
                <Text color="blue">{category.name}</Text>
              </ListItem>
            )}
          </UnorderedList>
        </Box>
      </Stack>
    </ConfirmDialog>
  );
}
