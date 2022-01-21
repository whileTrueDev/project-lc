import { useEffect } from 'react';
import {
  Button,
  Grid,
  GridItem,
  useDisclosure,
  Text,
  useColorModeValue,
  Stack,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useProfile } from '@project-lc/hooks';
import SettingSectionLayout from '@project-lc/components-layout/SettingSectionLayout';
import {
  useDialogHeaderConfig,
  useDialogValueConfig,
} from '@project-lc/components-layout/GridTableItem';
import { guideConditionStore } from '@project-lc/stores';
import { ShopNameDialog } from './ShopNameDialog';

// shop 이름 변경 섹션
export function ShopNameSection(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data } = useProfile();
  const { completeStep } = guideConditionStore();

  useEffect(() => {
    if (data?.shopName && completeStep) {
      completeStep();
    }
  }, [data?.shopName, completeStep]);

  return (
    <SettingSectionLayout title="상점명">
      <Text fontSize={['sm', 'md']}>구매자들에게 보여질 상점명을 변경하세요.</Text>
      {!data?.shopName && (
        <Stack spacing={2}>
          <Alert status="error">
            <AlertIcon />
            <Text fontSize="sm" fontWeight="bold">
              상점명이 아직 등록되지 않았습니다.
            </Text>
          </Alert>
          <Alert status="warning">
            <AlertIcon />
            <Text fontSize="sm">
              상점명을 등록하지 않은 경우, 상품등록이 반려될 수 있습니다.
            </Text>
          </Alert>
        </Stack>
      )}
      <Grid templateColumns="2fr 3fr" borderTopWidth={1.5} width={['100%', '70%']}>
        <GridItem {...useDialogHeaderConfig(useColorModeValue)}>현재 상점명</GridItem>
        <GridItem {...useDialogValueConfig(useColorModeValue)}>
          <Text fontSize="lg">{data?.shopName}</Text>
        </GridItem>
      </Grid>

      <Button width="200px" onClick={onOpen}>
        {!data?.shopName ? '상점명 등록하기' : '상점명 변경하기'}
      </Button>
      <ShopNameDialog isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </SettingSectionLayout>
  );
}
