import {
  Button,
  ButtonGroup,
  HStack,
  Input,
  Stack,
  useMergeRefs,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import SettingSectionLayout from './SettingSectionLayout';

/** 방송인 활동명 컴포넌트. editable input */
export function BroadcasterNickName(): JSX.Element {
  return (
    <SettingSectionLayout title="활동명">
      <EditableInput />
    </SettingSectionLayout>
  );
}

function EditableInput(): JSX.Element {
  const { register, handleSubmit } = useForm<{ nickname: string }>();
  const registeredNicknameField = register('nickname');

  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergeRefs(registeredNicknameField.ref, inputRef);

  const [editMode, setEditMode] = useState(false);
  function onEditModeToggle(): void {
    setEditMode(!editMode);
  }

  function onSubmit(formdata: { nickname: string }): void {
    console.log(formdata);
    // 변경 요청
    setEditMode(false);
  }

  useEffect(() => {
    if (inputRef.current && editMode) inputRef.current.focus();
  }, [editMode]);
  return (
    <Stack as="form" onSubmit={handleSubmit(onSubmit)}>
      {!editMode ? (
        <HStack>
          <Input maxW={200} readOnly />
          <Button onClick={onEditModeToggle}>수정</Button>
        </HStack>
      ) : (
        <HStack>
          <Input maxW={201} {...registeredNicknameField} ref={mergedRef} />
          <ButtonGroup>
            <Button type="submit">변경</Button>
            <Button onClick={onEditModeToggle}>취소</Button>
          </ButtonGroup>
        </HStack>
      )}
    </Stack>
  );
}
