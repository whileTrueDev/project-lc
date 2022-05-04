import { Stack, Text, useToast } from '@chakra-ui/react';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import { useAdminCategoryDeleteMutation } from '@project-lc/hooks';
import { CategoryWithGoodsCount } from '@project-lc/shared-types';

export type CategoryItemType = CategoryWithGoodsCount & {
  childrenCategories?: CategoryItemType[];
  depth: number;
};
export function CategoryDeleteDiaglog({
  category,
  isOpen,
  onClose,
}: {
  category: CategoryItemType;
  isOpen: boolean;
  onClose: () => void;
}): JSX.Element {
  const toast = useToast();
  const { mutateAsync } = useAdminCategoryDeleteMutation(category.id);
  const onConfirm = async (): Promise<void> => {
    mutateAsync()
      .then((res) => {
        toast({
          status: 'success',
          title: '카테고리를 삭제하였습니다',
        });
      })
      .catch((e) => {
        console.error(e);
        toast({
          status: 'error',
          title: '카테고리를 삭제하지 못했습니다',
          description: e,
        });
      });
  };
  return (
    <ConfirmDialog
      title={`"${category.name}" 카테고리를 삭제하시겠습니까?`}
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
    >
      <Stack>
        <Text>삭제된 카테고리는 복구할 수 없습니다</Text>
        {category.childrenCategories && category.childrenCategories.length > 0 && (
          <Stack>
            <Text>하위 카테고리</Text>
            <Text pl={2}>
              {category.childrenCategories.map((c) => c.name).join(', ')}
            </Text>
            <Text>모두 삭제됩니다</Text>
          </Stack>
        )}
      </Stack>
    </ConfirmDialog>
  );
}
