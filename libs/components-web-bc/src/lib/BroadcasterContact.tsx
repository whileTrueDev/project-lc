import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  ButtonGroup,
  ButtonProps,
  Checkbox,
  Collapse,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Input,
  InputGroup,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useMergeRefs,
  useToast,
} from '@chakra-ui/react';
import { SettingNeedAlertBox } from '@project-lc/components-core/SettingNeedAlertBox';
import { boxStyle } from '@project-lc/components-constants/commonStyleProps';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import SettingSectionLayout from '@project-lc/components-layout/SettingSectionLayout';
import {
  useBroadcasterContacts,
  useCreateBroadcasterContactMutation,
  useDeleteBroadcasterContactsMutation,
  useProfile,
  useUpdateBroadcasterContactsMutation,
} from '@project-lc/hooks';
import {
  BroadcasterContactDto,
  emailRegisterOptions,
  MAX_CONTACTS_COUNT,
} from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import { useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { UseMutateAsyncFunction } from 'react-query';
import { parseErrorObject } from '@project-lc/utils-frontend';
import { BroadcasterContacts } from '.prisma/client';

export function BroadcasterContactSection(): JSX.Element {
  const profile = useProfile();
  const broadcasterContacts = useBroadcasterContacts(profile.data?.id);

  if (broadcasterContacts.isLoading) {
    return (
      <SettingSectionLayout title="연락처">
        <Spinner />
      </SettingSectionLayout>
    );
  }
  return (
    <SettingSectionLayout title="연락처">
      {!broadcasterContacts.isLoading &&
        broadcasterContacts.data &&
        broadcasterContacts.data.length === 0 && (
          <SettingNeedAlertBox text="라이브 쇼핑 매칭 및 진행 관련 전달 사항을 받을 연락처를 등록해주세요." />
        )}
      {!broadcasterContacts.isLoading &&
        broadcasterContacts.data &&
        broadcasterContacts.data.length > 0 && (
          <Text>라이브 쇼핑 매칭 및 진행 관련한 전달 사항을 받을 연락처입니다.</Text>
        )}

      <BroadcasterContactList />
    </SettingSectionLayout>
  );
}

export function BroadcasterContactList(): JSX.Element {
  const profile = useProfile();
  const broadcasterContacts = useBroadcasterContacts(profile.data?.id);
  return (
    <Stack w="100%">
      {broadcasterContacts.data &&
        broadcasterContacts.data.map((contactData) => (
          <BroadcasterContactItem
            key={contactData.id}
            contactData={contactData}
            enableEdit
            enableRemove
          />
        ))}

      <BroadcasterContactAdd />
    </Stack>
  );
}

interface BroadcasterContactItemProps {
  contactData: BroadcasterContacts;
  enableEdit?: boolean;
  enableRemove?: boolean;
}
export function BroadcasterContactItem({
  contactData,
  enableEdit,
  enableRemove,
}: BroadcasterContactItemProps): JSX.Element {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutateAsync: deleteContact } = useDeleteBroadcasterContactsMutation();
  const onDelete = async (): Promise<void> => {
    if (contactData.isDefault) {
      toast({ title: '기본 연락처는 삭제할 수 없습니다.', status: 'warning' });
    } else {
      deleteContact(contactData.id)
        .then((res) => {
          if (res) toast({ title: '연락처가 삭제되었습니다.', status: 'success' });
          else {
            toast({
              title: '연락처가 삭제중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
              status: 'error',
            });
          }
        })
        .catch((err?: any) => {
          const { status, message } = parseErrorObject(err);
          toast({
            title: '연락처가 삭제중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
            description: status ? `code: ${status} - message: ${message}` : undefined,
            status: 'error',
          });
        });
    }
  };

  const updateSection = useDisclosure();
  const update = useUpdateBroadcasterContactsMutation(contactData.id);
  return (
    <>
      <Box px={2} py={1} borderWidth="thin" borderRadius="md" minW={200} maxW={300}>
        <Flex justifyContent="space-between">
          <Text fontSize="sm">
            <Text as="span" color="blue.500">
              {!!contactData.isDefault && '(기본연락처) '}
            </Text>
            {contactData.name}
          </Text>
          <ButtonGroup>
            {enableEdit && (
              <Button size="xs" onClick={updateSection.onToggle}>
                수정
              </Button>
            )}
            {enableRemove && (
              <Button size="xs" onClick={onOpen} isDisabled={contactData.isDefault}>
                삭제
              </Button>
            )}
          </ButtonGroup>
        </Flex>
        <Text fontSize="sm">{contactData.email}</Text>
        <Text fontSize="sm">{contactData.phoneNumber}</Text>

        <Collapse in={updateSection.isOpen} animateOpacity unmountOnExit>
          <Divider mt={2} />
          <BroadcasterContactForm
            onSuccess={() => {
              updateSection.onClose();
              toast({ title: '연락처가 수정되었습니다.', status: 'success' });
            }}
            onFail={() => {
              toast({
                title: '연락처 수정 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
                status: 'error',
              });
            }}
            onCancel={updateSection.onClose}
            defaultValues={{
              email: contactData.email,
              isDefault: contactData.isDefault,
              name: contactData.name,
              phone1: contactData.phoneNumber.slice(0, 3),
              phone2: contactData.phoneNumber.slice(4, 8),
              phone3: contactData.phoneNumber.slice(9, 13),
            }}
            mutateFn={update.mutateAsync}
          />
        </Collapse>
      </Box>

      <ConfirmDialog
        title={`연락처 ${contactData.name} 삭제`}
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onDelete}
      >
        연락처를 삭제하시겠습니까?
        <Box mt={4} {...boxStyle} maxW={300}>
          <Flex justifyContent="space-between">
            <Text fontSize="sm">
              <Text as="span" color="blue">
                {!!contactData.isDefault && '(기본연락처) '}
              </Text>
              {contactData.name}
            </Text>
          </Flex>
          <Text fontSize="sm">{contactData.email}</Text>
          <Text fontSize="sm">{contactData.phoneNumber}</Text>
        </Box>
      </ConfirmDialog>
    </>
  );
}

/**
 * 계정설정 - 활동플랫폼, 연락처 등 여러개 항목 입력 가능한 부분에서 사용하는 버튼 컴포넌트
 * maxCount, isFull 값이 주어진 경우 최대 등록 가능 개수 초과시 disabled 되고 안내문구가 뜬다
 * @param maxCount?: number 등록가능한 최대값.
 * @param isFull?: boolean 추가 등록 가능한지 여부
 */
export function AddButton(
  props: ButtonProps & {
    maxCount?: number;
    isFull?: boolean;
  },
): JSX.Element {
  const { maxCount, isFull, ...buttonProps } = props;

  if (!maxCount || !isFull) {
    return (
      <Button leftIcon={<AddIcon />} {...buttonProps}>
        등록
      </Button>
    );
  }
  return (
    <>
      <Button leftIcon={<AddIcon />} {...buttonProps} isDisabled={isFull}>
        등록
      </Button>

      {isFull && (
        <Text fontSize="xs" p={1} color="gray.500">
          최대 {maxCount}개까지 등록 가능합니다.
        </Text>
      )}
    </>
  );
}

type BroadcasterContactFormData = Omit<
  BroadcasterContactDto,
  'phoneNumber' | 'broadcasterId'
> & {
  phone1: string;
  phone2: string;
  phone3: string;
};
export function BroadcasterContactAdd(): JSX.Element {
  const toast = useToast();
  const profile = useProfile();
  const broadcasterContacts = useBroadcasterContacts(profile.data?.id);
  const addSection = useDisclosure({ defaultIsOpen: false });

  const isContactsFull = useMemo(
    () =>
      broadcasterContacts.data && broadcasterContacts.data.length === MAX_CONTACTS_COUNT,
    [broadcasterContacts.data],
  );
  return (
    <Box>
      <AddButton
        onClick={addSection.onToggle}
        maxCount={MAX_CONTACTS_COUNT}
        isFull={isContactsFull}
      />
      <Collapse in={addSection.isOpen} animateOpacity unmountOnExit>
        <BroadcasterContactForm
          onSuccess={() => {
            toast({ title: '연락처가 등록되었습니다.', status: 'success' });
            addSection.onClose();
          }}
          onCancel={addSection.onClose}
        />
      </Collapse>
    </Box>
  );
}

export interface BroadcasterContactFormProps {
  onSuccess: () => Promise<void> | void;
  onCancel: () => Promise<void> | void;
  onFail?: () => Promise<void> | void;
  defaultValues?: Partial<BroadcasterContactFormData>;
  mutateFn?: UseMutateAsyncFunction<
    boolean,
    AxiosError<any>,
    BroadcasterContactDto,
    unknown
  >;
}
export function BroadcasterContactForm(props: BroadcasterContactFormProps): JSX.Element {
  const profile = useProfile();
  const broadcasterContacts = useBroadcasterContacts(profile.data?.id);
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BroadcasterContactFormData>({ defaultValues: props.defaultValues });

  const { mutateAsync } = useCreateBroadcasterContactMutation();
  function onSubmit(formData: BroadcasterContactFormData): void {
    if (!profile.data) return;

    const { email, isDefault, name, phone1, phone2, phone3 } = formData;
    const dto: BroadcasterContactDto = {
      broadcasterId: profile.data.id,
      email,
      isDefault,
      name,
      phoneNumber: `${phone1}-${phone2}-${phone3}`,
    };
    const onSuccess = (): void => {
      toast({ title: '연락처가 등록되었습니다.', status: 'success' });
    };
    const onFail = (err?: any): void => {
      const { status, message } = parseErrorObject(err);
      toast({
        title: '연락처 등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        description: status ? `code: ${status} - message: ${message}` : undefined,
        status: 'error',
      });
    };
    if (props.mutateFn) {
      props
        .mutateFn(dto)
        .then((result) => {
          if (!result) onFail();
          else if (props.onSuccess) props.onSuccess();
          else onSuccess();
        })
        .catch((err) => {
          console.log(err);
          onFail(err);
        });
    } else {
      mutateAsync(dto)
        .then((result) => {
          if (!result) onFail();
          else if (props.onSuccess) props.onSuccess();
          else onSuccess();
        })
        .catch((err) => {
          console.log(err);
          onFail(err);
        });
    }
  }

  const registeredNameField = register('name', {
    required: {
      value: true,
      message: '연락처 이름을 작성해주세요.',
    },
    maxLength: { value: 7, message: '연락처명은 7자 이하' },
  });
  const nameFieldRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergeRefs(registeredNameField.ref, nameFieldRef);

  useEffect(() => {
    if (nameFieldRef.current) nameFieldRef.current.focus();
  }, []);

  return (
    <Box mt={2} as="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid templateColumns="repeat(6, 1fr)" gap={2}>
        <GridItem colSpan={2}>
          <FormControl isInvalid={!!errors.name}>
            <FormLabel fontSize="sm">연락처명</FormLabel>
            <Input
              placeholder="ex. 매니저, 본인"
              {...registeredNameField}
              ref={mergedRef}
            />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem colSpan={4}>
          <FormControl isInvalid={!!errors.email}>
            <FormLabel fontSize="sm">이메일</FormLabel>
            <Input
              placeholder="example@example.com"
              {...register('email', emailRegisterOptions)}
            />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem colSpan={6}>
          <FormControl isInvalid={!!errors.phone1 || !!errors.phone2 || !!errors.phone3}>
            <FormLabel fontSize="sm">휴대전화</FormLabel>
            <InputGroup alignItems="center">
              <Input
                type="number"
                placeholder="010"
                maxLength={3}
                {...register('phone1', {
                  required: { value: true, message: '휴대전화를 올바르게 입력해주세요.' },
                  minLength: 3,
                  maxLength: 4,
                })}
              />
              <span>-</span>
              <Input
                type="number"
                placeholder="0000"
                {...register('phone2', {
                  required: { value: true, message: '휴대전화를 올바르게 입력해주세요.' },
                  minLength: 4,
                  maxLength: 4,
                })}
              />
              <span>-</span>
              <Input
                type="number"
                placeholder="0000"
                {...register('phone3', {
                  required: { value: true, message: '휴대전화를 올바르게 입력해주세요.' },
                  minLength: 4,
                  maxLength: 4,
                })}
              />
            </InputGroup>
            <FormErrorMessage>휴대전화를 올바르게 입력해주세요</FormErrorMessage>
          </FormControl>
        </GridItem>
      </Grid>
      <Box my={2}>
        <Checkbox
          {...register('isDefault')}
          defaultChecked={
            (broadcasterContacts.data && broadcasterContacts.data.length === 0) ||
            props.defaultValues?.isDefault
          }
          isDisabled={
            (broadcasterContacts.data && broadcasterContacts.data.length === 0) ||
            props.defaultValues?.isDefault
          }
        >
          기본 연락처로 설정
        </Checkbox>
      </Box>
      <ButtonGroup mt={2}>
        <Button type="submit" colorScheme="blue">
          확인
        </Button>
        <Button onClick={props.onCancel}>취소</Button>
      </ButtonGroup>
    </Box>
  );
}
