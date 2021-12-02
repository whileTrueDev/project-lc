import { EditIcon } from '@chakra-ui/icons';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  ButtonGroup,
  HStack,
  Input,
  Stack,
  useMergeRefs,
  Text,
  useToast,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useBroadcaster, useUpdateNicknameMutation } from '@project-lc/hooks';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import SettingSectionLayout from './SettingSectionLayout';

/** 방송인 활동명 컴포넌트. editable input */
export function BroadcasterNickNameSection(): JSX.Element {
  const broadcaster = useBroadcaster({ id: 1 });

  return (
    <SettingSectionLayout title="활동명">
      {!broadcaster.isLoading && !broadcaster.data?.userNickname && (
        <NoNicknameAlertBox />
      )}
      {!broadcaster.isLoading && broadcaster.data?.userNickname && (
        <Text>
          크리에이터, 인플루언서로 활동하시면서 사용하시는 활동명 또는 채널명 입니다.
        </Text>
      )}
      <EditableNickname />
    </SettingSectionLayout>
  );
}

function NoNicknameAlertBox(): JSX.Element {
  return (
    <Alert status="warning">
      <Stack>
        <HStack spacing={0}>
          <AlertIcon />
          <AlertTitle>입력이 필요합니다!</AlertTitle>
        </HStack>
        <AlertDescription>
          크리에이터, 인플루언서로 활동하시면서 사용하시는{' '}
          <Text as="span" fontWeight="bold">
            활동명 혹은 채널명
          </Text>
          을 입력해주세요.
        </AlertDescription>
      </Stack>
    </Alert>
  );
}

/** 수정가능한 닉네임 필드 */
export function EditableNickname(): JSX.Element {
  const toast = useToast();
  const broadcaster = useBroadcaster({ id: 1 });
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
  function onEditModeToggle(): void {
    setEditMode(!editMode);
  }

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
      toast({ title: '활동명 변경 완료되었습니다.', status: 'success' });
    };
    const onError = (): void => {
      setEditMode(true);
      toast({
        title: '활동명 변경중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
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
        onError();
      });
  }

  useEffect(() => {
    if (inputRef.current && editMode) inputRef.current.focus();
  }, [editMode]);
  return (
    <Stack as="form" onSubmit={handleSubmit(onSubmit)}>
      {!editMode ? (
        <HStack>
          <Input
            cursor="default"
            maxW={200}
            readOnly
            value={broadcaster.data?.userNickname || undefined}
          />
          <Button leftIcon={<EditIcon />} onClick={onEditModeToggle}>
            {isBeginner ? '등록하기' : '수정'}
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
            <Button type="submit" isLoading={changeNickname.isLoading}>
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
