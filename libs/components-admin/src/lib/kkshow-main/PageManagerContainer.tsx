import { Box, Button, ButtonGroup, Flex, Stack, Text } from '@chakra-ui/react';
import { KkshowShoppingTabResData } from '@project-lc/shared-types';
import React, { memo, useCallback } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { PageManagerContainerButtonSet } from './PageManagerContainerButtonSet';

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
    <Flex
      rounded="lg"
      direction="row"
      border="1px"
      p={2}
      px={4}
      mb={1}
      flexWrap="wrap"
      alignItems="center"
      justifyContent="space-between"
    >
      <Box>{children}</Box>

      <PageManagerContainerButtonSet
        isMoveUpDisabled={isMoveUpDisabled}
        isMoveDownDisabled={isMoveDownDisabled}
        removeHandler={removeHandler}
        moveUp={moveUp}
        moveDown={moveDown}
      />
    </Flex>
  );
}

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
  fieldName: Exclude<keyof KkshowShoppingTabResData, 'banner'>;
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

  const moveUp = useCallback(
    (idx: number): void => {
      if (idx > 0) move(idx, idx - 1);
    },
    [move],
  );
  const moveDown = useCallback(
    (idx: number): void => {
      if (idx < fields.length - 1) move(idx, idx + 1);
    },
    [fields.length, move],
  );

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
  );
}

export default memo(PageManagerContainer);
