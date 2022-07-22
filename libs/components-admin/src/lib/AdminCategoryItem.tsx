import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import {
  Button,
  IconButton,
  Stack,
  Text,
  useBoolean,
  useDisclosure,
} from '@chakra-ui/react';
import { GiLighthouse } from 'react-icons/gi';
import { MdImage } from 'react-icons/md';
import { CategoryCreateFormDialog } from './AdminCategoryCreateDialog';
import { CategoryDeleteDiaglog, CategoryItemType } from './AdminCategoryDeleteDialog';
import { CategoryDisplayDiaglog } from './AdminCategoryDisplayDialog';
import { CategoryUpdateFormDialog } from './AdminCategoryUpdateDialog';

export interface CategoryItemProps {
  item: CategoryItemType;
  onClick?: (id: number) => void;
  selectedCategoryId: number | null;
}

/** 카테고리 아이템 */
export function CategoryItem(props: CategoryItemProps): JSX.Element {
  const [open, { toggle }] = useBoolean(false);
  const createDialog = useDisclosure();
  const updateDialog = useDisclosure();
  const deleteDialog = useDisclosure();
  const displayDialog = useDisclosure();
  const { onClick, item, selectedCategoryId } = props;
  const { id, name, childrenCategories, mainCategoryFlag, depth, goodsCount } = item;
  const hasChildren = childrenCategories && childrenCategories.length > 0;
  const actionsVisible = useDisclosure();
  const onActionVisible = (): void => actionsVisible.onOpen();
  const onActionInvisible = (): void => actionsVisible.onClose();
  return (
    <Stack
      borderWidth="1px"
      borderRadius="md"
      mt={1}
      p={1}
      spacing={0}
      onMouseEnter={onActionVisible}
      onMouseLeave={onActionInvisible}
    >
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="row" align="center" spacing={1}>
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
          {item.imageSrc && <MdImage color="green" />}
          {item.kkshowShoppingTabCategory && <GiLighthouse color="blue" />}

          <Text as="span">({goodsCount})</Text>
          {hasChildren && (
            <IconButton
              aria-label={open ? '닫기' : '열기'}
              size="xs"
              onClick={toggle}
              icon={open ? <ChevronUpIcon /> : <ChevronDownIcon />}
            />
          )}
        </Stack>

        {actionsVisible.isOpen && (
          <Stack direction="row">
            {/* depth 2 미만일때만 하위 카테고리 생성 가능하도록 제한함 */}
            {depth < 2 && (
              <Button size="xs" onClick={createDialog.onOpen}>
                하위 카테고리 생성
              </Button>
            )}

            <Button
              size="xs"
              leftIcon={
                <GiLighthouse color={item.kkshowShoppingTabCategory ? 'red' : 'blue'} />
              }
              onClick={displayDialog.onOpen}
            >
              {item.kkshowShoppingTabCategory ? '전시제거' : '전시'}
            </Button>

            <Button size="xs" onClick={updateDialog.onOpen}>
              수정
            </Button>

            <Button
              size="xs"
              onClick={deleteDialog.onOpen}
              disabled={item.goodsCount > 0}
            >
              삭제
            </Button>
          </Stack>
        )}
      </Stack>

      <CategoryCreateFormDialog
        isOpen={createDialog.isOpen}
        onClose={createDialog.onClose}
        parentCategory={item}
      />
      <CategoryDisplayDiaglog
        isOpen={displayDialog.isOpen}
        onClose={displayDialog.onClose}
        category={item}
      />
      <CategoryUpdateFormDialog
        isOpen={updateDialog.isOpen}
        onClose={updateDialog.onClose}
        category={item}
      />
      <CategoryDeleteDiaglog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.onClose}
        category={item}
      />

      {open && (
        <Stack pl={6} spacing={0}>
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
