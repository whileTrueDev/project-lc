import { ChevronDownIcon, ChevronUpIcon, DeleteIcon } from '@chakra-ui/icons';
import { Button, ButtonProps, Flex, IconButton, Stack } from '@chakra-ui/react';

export function PageManagerContainerButtonSet({
  isMoveUpDisabled = false,
  isMoveDownDisabled = false,
  removeHandler,
  moveUp,
  moveDown,
  buttonSize = 'sm',
  variant = 'with-text',
}: {
  isMoveUpDisabled?: boolean;
  isMoveDownDisabled?: boolean;
  removeHandler?: () => void;
  moveUp?: () => void;
  moveDown?: () => void;
  buttonSize?: ButtonProps['size'];
  variant?: 'only-icon' | 'with-text';
}): JSX.Element {
  if (variant === 'only-icon')
    return (
      <Flex gap={1}>
        <IconButton
          size={buttonSize}
          aria-label="field-up"
          icon={<ChevronUpIcon />}
          isDisabled={isMoveUpDisabled}
          onClick={moveUp}
        />
        <IconButton
          size={buttonSize}
          aria-label="field-down"
          icon={<ChevronDownIcon />}
          isDisabled={isMoveDownDisabled}
          onClick={moveDown}
        />
        <IconButton
          size={buttonSize}
          aria-label="field-delete"
          icon={<DeleteIcon />}
          onClick={removeHandler}
        />
      </Flex>
    );
  return (
    <Stack>
      <Button
        size={buttonSize}
        leftIcon={<ChevronUpIcon />}
        isDisabled={isMoveUpDisabled}
        onClick={moveUp}
      >
        위 로
      </Button>
      <Button
        size={buttonSize}
        leftIcon={<ChevronDownIcon />}
        isDisabled={isMoveDownDisabled}
        onClick={moveDown}
      >
        아래로
      </Button>
      <Button size={buttonSize} leftIcon={<DeleteIcon />} onClick={removeHandler}>
        삭제
      </Button>
    </Stack>
  );
}
export default PageManagerContainerButtonSet;
