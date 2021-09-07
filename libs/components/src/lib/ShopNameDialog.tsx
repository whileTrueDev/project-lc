// 최초 입장시에 상점명을 입력하는 다이얼로그
// -> 추후에는 상점명 뿐 만 아니라 다른 것도 입력이 가능해야할 수 있음.
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  ModalOverlay,
  ModalHeader,
  ModalFooter,
  Button,
  Text,
  Flex,
  FormControl,
  Input,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useProfile, useShopInfoMutation } from '@project-lc/hooks';
import { WarningIcon } from '@chakra-ui/icons';

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
  const initialRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    // 렌더링 이후, seller가 가진 shopName을 프로퍼티로 가지는 경우,
    if (autoCheck && data && 'shopName' in data) {
      // 이때, data의 shopName이 없을 수 있다. -> seller의 특성이기 때문이다.
      if (!data?.shopName) {
        onOpen();
      }
    }
  }, [data, onOpen, autoCheck]);

  function useClose() {
    reset();
    onClose();
  }

  const mutation = useShopInfoMutation();
  async function useSubmit(submitData: { shopName: string }) {
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
        description: error.response.data.message,
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
      onClose={useClose}
      initialFocusRef={initialRef}
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(useSubmit)}>
        <ModalHeader>상점명 등록하기</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {!data?.shopName && (
            <Flex alignItems="center" backgroundColor="red.50" p={1}>
              <WarningIcon color="red.500" m={1} />
              <Text fontSize="sm" fontWeight="bold" color="red.500">
                상점명이 아직 등록되지 않았습니다.
              </Text>
            </Flex>
          )}
          <FormControl isInvalid={!!errors.shopName} m={2} mt={6}>
            <FormLabel fontSize="md">상점명</FormLabel>
            <FormHelperText>
              상품을 등록하기 전에 고객에게 보여질 상점명을 등록하세요.
            </FormHelperText>
            <Input
              id="shopName"
              variant="flushed"
              maxW={['inherit', 300, 300, 300]}
              mt={3}
              maxLength={20}
              autoComplete="off"
              placeholder="등록할 상점명을 입력해주세요."
              {...register('shopName', {
                required: '상점명을 반드시 입력해주세요.',
              })}
              ref={initialRef}
            />
            <FormErrorMessage mt={1}>
              {errors.shopName && errors.shopName.message}
            </FormErrorMessage>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button size="sm" type="submit" isLoading={isSubmitting}>
            등록하기
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
