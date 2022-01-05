import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import {
  Button,
  FormControl,
  FormErrorMessage,
  Grid,
  GridItem,
  Input,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import {
  useDialogHeaderConfig,
  useDialogValueConfig,
} from '@project-lc/components-layout/GridTableItem';

import { useNoticeMutation } from '@project-lc/hooks';
import { NoticePostDto } from '@project-lc/shared-types';
import { useForm } from 'react-hook-form';

export interface AdminNoticeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminNoticeDialog({
  isOpen,
  onClose,
}: AdminNoticeDialogProps): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NoticePostDto>();

  const toast = useToast();
  const mutation = useNoticeMutation();

  const useSubmit = async (data: NoticePostDto): Promise<void> => {
    try {
      await mutation.mutateAsync(data);
      toast({
        title: '공지사항이 등록되었습니다.',
        status: 'success',
      });
      onClose();
    } catch (error) {
      toast({
        title: '공지사항의 등록이 실패하였습니다..',
        status: 'error',
      });
    } finally {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} size="5xl" onClose={onClose}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(useSubmit)}>
        <ModalHeader>공지사항 등록하기</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid templateColumns="2fr 3fr" borderTopColor="gray.100" borderTopWidth={1.5}>
            <GridItem {...useDialogHeaderConfig(useColorModeValue)}>
              공지사항 제목
            </GridItem>
            <GridItem {...useDialogValueConfig(useColorModeValue)}>
              <FormControl isInvalid={!!errors.title}>
                <Input
                  id="title"
                  m={[1, 3, 3, 3]}
                  variant="flushed"
                  placeholder="공지사항 제목을 입력해주세요."
                  autoComplete="off"
                  width="100%"
                  {...register('title', {
                    required: '공지사항 제목을 입력해주세요',
                  })}
                />
                <FormErrorMessage ml={3} mt={0}>
                  {errors.title && errors.title.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem {...useDialogHeaderConfig(useColorModeValue)}>
              공지사항 URL
            </GridItem>
            <GridItem {...useDialogValueConfig(useColorModeValue)}>
              <FormControl isInvalid={!!errors.url}>
                <Input
                  id="url"
                  m={[1, 3, 3, 3]}
                  variant="flushed"
                  placeholder="공지사항 글의 노션 URL을 입력해주세요"
                  autoComplete="off"
                  width="100%"
                  {...register('url', {
                    required: '공지사항 글의 노션 URL을 입력해주세요',
                  })}
                  type="url"
                />
                <FormErrorMessage ml={3} mt={0}>
                  {errors.url && errors.url.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>
          </Grid>
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
