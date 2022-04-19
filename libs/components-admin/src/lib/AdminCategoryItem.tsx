import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import {
  Button,
  IconButton,
  Stack,
  Text,
  useBoolean,
  useDisclosure,
} from '@chakra-ui/react';
import { CategoryWithGoodsCount } from '@project-lc/shared-types';
import { CategoryCreateFormDialog } from './AdminCategoryCreateDialog';

export type CategoryItemType = CategoryWithGoodsCount & {
  childrenCategories?: CategoryItemType[];
};
export interface CategoryItemProps {
  item: CategoryItemType;
  onClick?: (id: number) => void;
  selectedCategoryId: number | null;
}

/** 카테고리 아이템 */
export function CategoryItem(props: CategoryItemProps): JSX.Element {
  const [open, { toggle }] = useBoolean(false);
  const createDialog = useDisclosure();
  const { onClick, item, selectedCategoryId } = props;
  const { id, name, childrenCategories, mainCategoryFlag } = item;
  const hasChildren = childrenCategories && childrenCategories.length > 0;
  return (
    <Stack borderWidth="1px" borderRadius="md" p={1}>
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="row">
          {!mainCategoryFlag && (
            <Text as="span" color="gray.400">
              ㄴ
            </Text>
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
          {hasChildren && (
            <IconButton
              aria-label={open ? '닫기' : '열기'}
              size="xs"
              onClick={toggle}
              icon={open ? <ChevronUpIcon /> : <ChevronDownIcon />}
            />
          )}
        </Stack>
        {selectedCategoryId === id && (
          <Stack direction="row">
            <Button size="xs" onClick={createDialog.onOpen}>
              하위 카테고리 생성
            </Button>
            <CategoryCreateFormDialog
              isOpen={createDialog.isOpen}
              onClose={createDialog.onClose}
              parentCategory={item}
            />
            <Button size="xs">수정</Button>
            <Button size="xs">삭제</Button>
          </Stack>
        )}
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
