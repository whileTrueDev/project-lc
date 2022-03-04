// 최초 입장시에 상점명을 입력하는 다이얼로그
// -> 추후에는 상점명 뿐 만 아니라 다른 것도 입력이 가능해야할 수 있음.
import {
  Alert,
  AlertIcon,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
  Stack,
  useMergeRefs,
} from '@chakra-ui/react';
import { SellerShopInfoDto } from '@project-lc/shared-types';
import { useProfile, useShopInfoMutation } from '@project-lc/hooks';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';

type ShopNameDialogType = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  autoCheck?: boolean;
};

export function ShopNameDialog(props: ShopNameDialogType): JSX.Element {
  const { isOpen, onOpen, onClose, autoCheck } = props;
  const { data, refetch } = useProfile();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const toast = useToast();

  const initialRef = useRef(null);
  const { ref, ...shopName } = register('shopName', {
    required: '상점명을 반드시 입력해주세요.',
  });
  const shopNameRefs = useMergeRefs(initialRef, ref);

  useEffect(() => {
    // 렌더링 이후, seller가 가진 shopName을 프로퍼티로 가지는 경우,
    if (autoCheck && data && 'shopName' in data) {
      // 이때, data의 shopName이 없을 수 있다. -> seller의 특성이기 때문이다.
      if (!data?.shopName) {
        onOpen();
      }
    }
  }, [data, onOpen, autoCheck]);

  const useClose = (): void => {
    reset();
    onClose();
  };

  const mutation = useShopInfoMutation();
  async function useSubmit(submitData: SellerShopInfoDto): Promise<void> {
    try {
      await mutation.mutateAsync(submitData);
      refetch();
      toast({
        title: '상점명 등록이 완료되었습니다.',
        status: 'success',
      });
    } catch (error) {
      toast({
        title: '상점명 등록이 실패하였습니다.',
        description: (error as AxiosError).response?.data.message,
        status: 'error',
      });
    } finally {
      useClose();
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      size="md"
      isCentered
      scrollBehavior="inside"
      onClose={useClose}
      initialFocusRef={initialRef}
    >
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(useSubmit)}>
        <ModalHeader>상점명 등록하기</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
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
          <FormControl isInvalid={!!errors.shopName} m={2} mt={6}>
            <FormLabel fontSize="md">상점명</FormLabel>
            <FormHelperText>
              고객에게 보여질 상점명(브랜드명)을 등록하세요.
            </FormHelperText>
            <Input
              id="shopName"
              variant="flushed"
              maxW={['inherit', 300, 300, 300]}
              mt={3}
              maxLength={20}
              autoComplete="off"
              placeholder="등록할 상점명을 입력해주세요."
              {...shopName}
              ref={shopNameRefs}
            />
            <FormErrorMessage>
              {errors.shopName && errors.shopName.message}
            </FormErrorMessage>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button type="submit" isLoading={isSubmitting}>
            등록하기
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
