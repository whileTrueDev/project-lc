/* eslint-disable @typescript-eslint/explicit-function-return-type */
// grid 내에서 동일한 포맷팅을 수행하는 테이블 구현

import { GridItem, useColorModeValue } from '@chakra-ui/react';

type settlementTableItemProps = {
  title: string;
  value: string | number | JSX.Element | null;
};

export function useTableHeaderConfig(useColorMode: typeof useColorModeValue) {
  return {
    colSpan: [2, 1, 1, 1],
    p: 3,
    pb: 5,
    pt: 2,
    fontSize: 'xs',
    backgroundColor: useColorMode('gray.50', 'gray.700'),
    borderBottomColor: useColorMode('gray.100', 'gray.750'),
    borderBottomWidth: 1.5,
    borderRightColor: useColorMode('gray.100', 'gray.750'),
    borderRightWidth: 1.5,
  };
}

export function useTableValueConfig(useColorMode: typeof useColorModeValue) {
  return {
    colSpan: [2, 1, 1, 1],
    p: 3,
    borderBottomColor: useColorMode('gray.100', 'gray.750'),
    borderBottomWidth: 1.5,
    fontSize: 'sm',
    mb: [3, 0, 0, 0],
  };
}

export function useDialogHeaderConfig(useColorMode: typeof useColorModeValue) {
  return {
    colSpan: [2, 1, 1, 1],
    p: 3,
    pb: 5,
    pt: 2,
    fontSize: 'xs',
    backgroundColor: useColorMode('gray.50', 'whiteAlpha.300'),
    borderBottomColor: useColorMode('gray.100', 'whiteAlpha.350'),
    borderBottomWidth: 1.5,
    borderRightColor: useColorMode('gray.100', 'whiteAlpha.350'),
    borderRightWidth: 1.5,
  };
}

export function useDialogValueConfig(useColorMode: typeof useColorModeValue) {
  return {
    colSpan: [2, 1, 1, 1],
    p: 3,
    borderBottomColor: useColorMode('gray.100', 'whiteAlpha.350'),
    borderBottomWidth: 1.5,
    fontSize: 'sm',
    mb: [3, 0, 0, 0],
  };
}

export function GridTableItem(props: settlementTableItemProps): JSX.Element {
  const { title, value } = props;
  return (
    <>
      <GridItem {...useTableHeaderConfig(useColorModeValue)}>{title}</GridItem>
      <GridItem {...useTableValueConfig(useColorModeValue)}>{value}</GridItem>
    </>
  );
}
