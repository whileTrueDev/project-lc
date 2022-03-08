import { Button, Grid, GridItem, Text, useDisclosure, useToast } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import {
  useProfile,
  useBroadcasterUpdateContractionAgreementMutation,
  useSellerUpdateContractionAgreementMutation,
} from '@project-lc/hooks';
import { SettingSectionLayout } from '@project-lc/components-layout/SettingSectionLayout';
import { SettingNeedAlertBox } from '@project-lc/components-core/SettingNeedAlertBox';
import { ContractionAgreeDialog } from './ContractionAgreeDialog';

export function ContractionAgreeSection({
  userType,
}: {
  userType: 'seller' | 'broadcaster';
}): JSX.Element {
  const { data } = useProfile();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const broadcasterMutation = useBroadcasterUpdateContractionAgreementMutation();
  const sellerMutation = useSellerUpdateContractionAgreementMutation();

  const onSubmit = (): void => {
    const onSuccess = (): void => {
      // 성공시
      onClose();
      toast({ title: '약관동의가 완료되었습니다.', status: 'success' });
    };
    const onError = (): void => {
      onClose();
      toast({
        title: '약관동의중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        status: 'error',
      });
    };

    if (!data?.email) {
      return;
    }

    if (userType === 'seller') {
      sellerMutation
        .mutateAsync({ email: data?.email, agreementFlag: true })
        .then((result) => {
          if (result) onSuccess();
          else onError();
        })
        .catch((err) => {
          onError();
        });
    }
    if (userType === 'broadcaster') {
      broadcasterMutation
        .mutateAsync({ email: data?.email, agreementFlag: true })
        .then((result) => {
          if (result) onSuccess();
          else onError();
        })
        .catch((err) => {
          onError();
        });
    }
  };

  return (
    <SettingSectionLayout title="크크쇼 이용동의">
      {data?.agreementFlag ? (
        <Grid templateColumns="2fr 3fr" width={['100%', '70%']}>
          <GridItem display="flex" alignItems="center">
            <Text>이용동의 완료</Text>
            <CheckIcon color="green.500" ml={1} />
          </GridItem>
          <GridItem>
            <Button width="150px" size="sm" onClick={onOpen}>
              이용약관 보기
            </Button>
          </GridItem>
        </Grid>
      ) : (
        <>
          <SettingNeedAlertBox
            title="이용동의가 필요합니다."
            text="원활한 서비스 이용을 위해서 이용동의가 필요합니다."
          />
          <Button width="200px" onClick={onOpen}>
            이용동의하기
          </Button>
        </>
      )}
      <ContractionAgreeDialog
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onSubmit}
        agreementFlag={data?.agreementFlag === undefined ? true : data.agreementFlag}
        userType={userType}
      />
      |
    </SettingSectionLayout>
  );
}
