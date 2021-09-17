/* eslint-disable react/jsx-props-no-spreading */

import {
  Button,
  Grid,
  GridItem,
  Flex,
  useDisclosure,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useProfile } from '@project-lc/hooks';
import SettingSectionLayout from './SettingSectionLayout';
import { ShopNameDialog } from './ShopNameDialog';
import { useDialogHeaderConfig, useDialogValueConfig } from './GridTableItem';

// shop 이름 변경 섹션
export function ShopNameSection(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data } = useProfile();

  return (
    <SettingSectionLayout title="상점명">
      <Text fontSize={['sm', 'md']}>구매자들에게 보여질 상점명을 변경하세요.</Text>
      <Grid templateColumns="2fr 3fr" borderTopWidth={1.5} width={['100%', '70%']}>
        <GridItem {...useDialogHeaderConfig(useColorModeValue)}>현재 상점명</GridItem>
        <GridItem {...useDialogValueConfig(useColorModeValue)}>
          <Text fontSize="lg">{data?.shopName}</Text>
        </GridItem>
      </Grid>

      <Button width="200px" onClick={onOpen}>
        상점명 변경하기
      </Button>
      <ShopNameDialog isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </SettingSectionLayout>
  );
}
