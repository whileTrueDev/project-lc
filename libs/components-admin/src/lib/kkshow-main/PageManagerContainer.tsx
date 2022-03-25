import { ChevronDownIcon, ChevronUpIcon, DeleteIcon } from '@chakra-ui/icons';
import { Button, ButtonGroup, Stack, Text } from '@chakra-ui/react';
import { KkshowShoppingTabResData } from '@project-lc/shared-types';
import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

interface PageManagerButtonOpt {
  icon?: JSX.Element;
  onClick: (operators: {
    append: (v: any) => void;
    remove: () => void;
    move: (indexA: number, indexB: number) => void;
  }) => void;
  label: string;
}
export interface PageManagerContainerProps {
  fieldName: keyof KkshowShoppingTabResData;
  title: string;
  buttons: PageManagerButtonOpt[];
  Component: (props: { index: number; [key: string]: any }) => JSX.Element;
}
export function PageManagerContainer({
  title,
  fieldName,
  buttons,
  Component,
}: PageManagerContainerProps): JSX.Element {
  const { control } = useFormContext<KkshowShoppingTabResData>();
  const { fields, append, remove, move } = useFieldArray({ control, name: fieldName });

  const moveUp = (idx: number): void => {
    if (idx > 0) move(idx, idx - 1);
  };
  const moveDown = (idx: number): void => {
    if (idx < fields.length - 1) move(idx, idx + 1);
  };

  return (
    <Stack>
      <Stack direction="row" alignItems="center">
        <Text fontWeight="bold" size="lg">
          {title}
        </Text>
        <Stack direction="row">
          <ButtonGroup>
            {buttons.map((btn) => (
              <Button
                key={btn.label}
                leftIcon={btn.icon}
                onClick={() => btn.onClick({ append, remove, move })}
              >
                {btn.label}
              </Button>
            ))}
          </ButtonGroup>
        </Stack>
      </Stack>

      <Stack>
        {fields.map((field, index) => (
          <Stack key={field.id} w="100%" minH={150}>
            <PageManagerFieldItem
              isMoveUpDisabled={index === 0}
              isMoveDownDisabled={index === fields.length - 1}
              moveUp={() => moveUp(index)}
              moveDown={() => moveDown(index)}
              removeHandler={() => remove(index)}
            >
              <Component index={index} />
            </PageManagerFieldItem>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

export function PageManagerFieldItem({
  children,
  isMoveUpDisabled = false,
  isMoveDownDisabled = false,
  removeHandler,
  moveUp,
  moveDown,
}: {
  children: React.ReactNode;
  isMoveUpDisabled?: boolean;
  isMoveDownDisabled?: boolean;
  removeHandler?: () => void;
  moveUp?: () => void;
  moveDown?: () => void;
}): JSX.Element {
  return (
    <Stack
      rounded="lg"
      direction="row"
      border="1px"
      w="100%"
      p={2}
      px={4}
      alignItems="center"
      mb={1}
      justifyContent="space-between"
    >
      <Stack direction="row">{children}</Stack>

      <Stack>
        <Button
          leftIcon={<ChevronUpIcon />}
          isDisabled={isMoveUpDisabled}
          onClick={moveUp}
        >
          위 로
        </Button>
        <Button
          leftIcon={<ChevronDownIcon />}
          isDisabled={isMoveDownDisabled}
          onClick={moveDown}
        >
          아래로
        </Button>
        <Button leftIcon={<DeleteIcon />} onClick={removeHandler}>
          삭제
        </Button>
      </Stack>
    </Stack>
  );
}

export default PageManagerContainer;
