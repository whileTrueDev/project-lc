/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable camelcase */
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Select,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { GoodsInfo } from '@prisma/client';
import {
  GoodsCommonInfo,
  useDeleteGoodsCommonInfo,
  useGoodsCommonInfoItem,
  useGoodsCommonInfoList,
  useProfile,
} from '@project-lc/hooks';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import 'suneditor/dist/css/suneditor.min.css';
import SunEditorCore from 'suneditor/src/lib/core';
import { boxStyle } from '../constants/commonStyleProps';
import { ConfirmDialog } from './ConfirmDialog';
import { GoodsFormValues } from './GoodsRegistForm';
import { MB } from './ImageInput';
import SectionWithTitle from './SectionWithTitle';

const SunEditor = dynamic(() => import('suneditor-react'), {
  ssr: false,
});

function GoodsCommonInfoList({
  onCommonInfoChange,
}: {
  onCommonInfoChange: (data: GoodsInfo) => void;
}) {
  const { data: profileData } = useProfile();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [value, setValue] = useState<string | undefined>(undefined);
  // 특정 공통정보 내용 불러오기
  useGoodsCommonInfoItem({
    id: Number(value),
    enabled: !!value,
    onSuccess: (data: GoodsInfo) => {
      onCommonInfoChange(data);
    },
  });
  // 공통정보 목록 불러오기
  const { data: infoList } = useGoodsCommonInfoList({
    email: profileData?.email || '',
    enabled: !!profileData?.email,
    onSuccess: (data: GoodsCommonInfo[]) => {
      if (data.length > 0) {
        setValue(data[0].id.toString());
      }
    },
  });

  useEffect(() => {
    if (infoList && infoList.length > 0) {
      setValue(infoList[0].id.toString());
    }
  }, [infoList]);

  const { mutateAsync: deleteCommonInfoItem } = useDeleteGoodsCommonInfo();

  // 공통정보 삭제 요청
  const deleteCommonInfo = async () => {
    if (!value) throw new Error('공통정보가 없습니다');
    deleteCommonInfoItem({ id: Number(value) })
      .then((res) => {
        toast({ title: '해당 상품 공통 정보를 삭제하였습니다.' });
      })
      .catch((error) => {
        toast({
          title: '해당 상품 공통 정보를 삭제하는데 오류가 발생하였습니다.',
          status: 'error',
        });
      });
  };
  if (!infoList)
    return (
      <Center>
        <Spinner />
      </Center>
    );
  return (
    <Box>
      {infoList.length > 0 ? (
        <Stack direction="row">
          <Select value={value} onChange={(e) => setValue(e.currentTarget.value)}>
            {infoList &&
              infoList.length > 0 &&
              infoList.map((info) => {
                const { id, info_name } = info;
                return (
                  <option key={id} value={id}>
                    {info_name} ( 고유번호 : {id} )
                  </option>
                );
              })}
          </Select>
          <IconButton onClick={onOpen} aria-label="상세정보 삭제" icon={<DeleteIcon />} />
        </Stack>
      ) : (
        <Text>등록된 상품 공통정보가 없습니다. 상품 공통 정보를 등록해주세요.</Text>
      )}

      {/* 상세정보 삭제 확인 모달 */}
      <ConfirmDialog
        title="상세정보 삭제"
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={deleteCommonInfo}
      >
        <Text>
          ( 고유번호 : {value} ) 상품 공통 정보를 삭제하시겠습니까? 삭제 후 복구가
          불가능합니다
        </Text>
      </ConfirmDialog>
    </Box>
  );
}

export function GoodsRegistCommonInfo(): JSX.Element {
  const { watch, setValue, register, getValues } = useFormContext<GoodsFormValues>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const editor = useRef<SunEditorCore>();
  const viewer = useRef<any>();
  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editor.current = sunEditor;
  };

  const toast = useToast();
  const setViewerContents = (contents: string) => {
    if (viewer.current) {
      viewer.current.innerHTML = contents;
    }
  };

  // 공통정보 신규 등록
  const registGoodsCommonInfo = async () => {
    if (!getValues('common_contents_name')) {
      toast({ title: '상품 공통 정보명을 입력해주세요.', status: 'warning' });
      return;
    }
    if (!editor.current) return;

    const textWithImages = editor.current.getContents(false);
    setViewerContents(textWithImages);
    setValue('common_contents', textWithImages);

    toast({ title: '상품 공통 정보가 임시 저장되었습니다.' });
    onClose();
  };

  // 기존 공통정보 사용 - Select 값 변경시 뷰어 데이터 변경 && goodsInfoId 변경
  const onCommonInfoChange = (data: GoodsInfo) => {
    const { id, info_value } = data;
    setViewerContents(info_value || '');
    setValue('goodsInfoId', id);
  };
  return (
    <SectionWithTitle title="상품 공통 정보 *">
      <Stack>
        <RadioGroup
          onChange={(value) => {
            if (value === 'new') {
              setViewerContents(getValues('common_contents') || '');
              setValue('goodsInfoId', undefined);
            }
          }}
          value={watch('common_contents_type', 'new')}
        >
          <Stack direction="row">
            <Radio {...register('common_contents_type')} value="new">
              신규 등록
            </Radio>
            <Radio {...register('common_contents_type')} value="load">
              기존 정보 불러오기
            </Radio>
          </Stack>
        </RadioGroup>

        <Box>
          {watch('common_contents_type') === 'new' ? (
            <Button
              aria-label="Search database"
              rightIcon={<EditIcon />}
              onClick={onOpen}
            >
              공통정보쓰기
            </Button>
          ) : (
            <GoodsCommonInfoList onCommonInfoChange={onCommonInfoChange} />
          )}
        </Box>

        <Box
          ref={viewer}
          className="sun-editor-editable"
          minH="100px"
          maxHeight="300px"
          overflowY="auto"
          {...boxStyle}
        />
      </Stack>

      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>상품 공통 정보 작성하기</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Stack direction="row">
              <Text wordBreak="keep-all">상품 공통 정보명</Text>
              <Input {...register('common_contents_name')} />
            </Stack>

            <SunEditor
              getSunEditorInstance={getSunEditorInstance}
              lang="ko"
              setOptions={{
                height: '500px',
                imageUploadSizeLimit: 20 * MB, // 퍼스트몰 최대 20mb
                buttonList: [['font', 'fontSize', 'align', 'list'], ['image']],
              }}
              defaultValue={watch('common_contents')}
            />
            <Button onClick={registGoodsCommonInfo}>등록</Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </SectionWithTitle>
  );
}

export default GoodsRegistCommonInfo;
