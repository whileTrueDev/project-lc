import { EditIcon } from '@chakra-ui/icons';
import {
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  Spinner,
  Stack,
  Text,
  useMergeRefs,
  useToast,
} from '@chakra-ui/react';
import SettingSectionLayout from '@project-lc/components-layout/SettingSectionLayout';
import { SettingNeedAlertBox } from '@project-lc/components-core/SettingNeedAlertBox';
import { useBroadcaster, useProfile, useUpdateNicknameMutation } from '@project-lc/hooks';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { parseErrorObject } from '@project-lc/utils-frontend';

/** 방송인 활동명 컴포넌트. editable input */
export function BroadcasterNickNameSection(): JSX.Element {
  const profile = useProfile();
  const broadcaster = useBroadcaster({ id: profile.data?.id });

  if (broadcaster.isLoading) {
    return (
      <SettingSectionLayout title="활동명">
        <Spinner />
      </SettingSectionLayout>
    );
  }
  return (
    <SettingSectionLayout title="활동명">
      {!broadcaster.isLoading && !broadcaster.data?.userNickname && (
        <SettingNeedAlertBox
          text={
            <Text>
              크리에이터, 인플루언서로 활동하시면서 사용하시는{' '}
              <Text as="span" fontWeight="bold">
                활동명 혹은 채널명
              </Text>
              을 입력해주세요.
            </Text>
          }
        />
      )}
      {!broadcaster.isLoading && broadcaster.data?.userNickname && (
        <Text>
          크리에이터, 인플루언서로 활동하시면서 사용하시는 활동명 또는 채널명 입니다.
        </Text>
      )}
      <BroadcasterNicknameForm />
    </SettingSectionLayout>
  );
}

/** 방송인 활동명 폼 */
export function BroadcasterNicknameForm(): JSX.Element {
  const toast = useToast();
  const profile = useProfile();
  const broadcaster = useBroadcaster({ id: profile.data?.id });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ nickname: string }>();
  const registeredNicknameField = register('nickname', {
    required: { message: '활동명을 입력해주세요.', value: true },
    maxLength: {
      message: '최대 10 글자까지 가능합니다.',
      value: 10,
    },
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergeRefs(registeredNicknameField.ref, inputRef);

  const [editMode, setEditMode] = useState(false);
  const onEditModeToggle = (): void => {
    setEditMode(!editMode);
  };

  const isBeginner = useMemo(
    () => !broadcaster.data?.userNickname,
    [broadcaster.data?.userNickname],
  );

  const changeNickname = useUpdateNicknameMutation();
  function onSubmit(formdata: { nickname: string }): void {
    const onSuccess = (): void => {
      // 성공시
      reset();
      setEditMode(false);
      toast({ title: '활동명이 변경되었습니다.', status: 'success' });
    };
    const onError = (err?: any): void => {
      const { status, message } = parseErrorObject(err);
      setEditMode(true);
      toast({
        title: '활동명 변경중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        description: status ? `code: ${status} - message: ${message}` : undefined,
        status: 'error',
      });
    };

    changeNickname
      .mutateAsync(formdata)
      .then((result) => {
        if (result) onSuccess();
        else onError();
      })
      .catch((err) => {
        console.log(err);
        onError(err);
      });
  }

  useEffect(() => {
    if (inputRef.current && editMode) inputRef.current.focus();
  }, [editMode]);
  return (
    <Stack as="form" onSubmit={handleSubmit(onSubmit)}>
      {!editMode ? (
        <HStack>
          {broadcaster.data?.userNickname && (
            <Input
              cursor="default"
              maxW={200}
              readOnly
              value={broadcaster.data.userNickname}
            />
          )}
          <Button leftIcon={<EditIcon />} onClick={onEditModeToggle}>
            {isBeginner ? '등록' : '수정'}
          </Button>
        </HStack>
      ) : (
        <HStack alignItems="flex-start">
          <FormControl isInvalid={!!errors.nickname}>
            <Input maxW={200} {...registeredNicknameField} ref={mergedRef} />
            {errors.nickname && (
              <FormErrorMessage>{errors.nickname.message}</FormErrorMessage>
            )}
          </FormControl>
          <ButtonGroup>
            <Button colorScheme="blue" type="submit" isLoading={changeNickname.isLoading}>
              확인
            </Button>
            <Button
              onClick={() => {
                onEditModeToggle();
                reset();
              }}
            >
              취소
            </Button>
          </ButtonGroup>
        </HStack>
      )}
    </Stack>
  );
}
