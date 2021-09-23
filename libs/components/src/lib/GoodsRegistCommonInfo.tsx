/* eslint-disable camelcase */
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
import { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import SunEditorCore from 'suneditor/src/lib/core';
import 'suneditor/dist/css/suneditor.min.css';
import { useFormContext } from 'react-hook-form';
import {
  GoodsCommonInfo,
  useCreateGoodsCommonInfo,
  useDeleteGoodsCommonInfo,
  useGoodsCommonInfoItem,
  useGoodsCommonInfoList,
  useProfile,
} from '@project-lc/hooks';
import { GoodsInfo } from '@prisma/client';
import { DeleteIcon } from '@chakra-ui/icons';
import { MB } from './ImageInput';
import SectionWithTitle from './SectionWithTitle';
import { GoodsFormValues, saveContentsImageToS3 } from './GoodsRegistForm';
import { ConfirmDialog } from './ConfirmDialog';

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
      console.log(data, 'load item success. id', value);
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
    console.log('id', value);
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
  const [loadType, setLoadType] = useState('new');
  const [commonTitle, setCommonTitle] = useState('');
  const { watch, setValue } = useFormContext<GoodsFormValues>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const editor = useRef<SunEditorCore>();
  const viewer = useRef<any>();
  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editor.current = sunEditor;
  };

  const toast = useToast();
  const { data: profileData } = useProfile();
  const { mutateAsync: createGoodsCommonInfo, isLoading } = useCreateGoodsCommonInfo();

  const clearCommonInfoForm = () => {
    if (!editor.current) return;
    editor.current.setContents('');
    setCommonTitle('');
  };
  const setViewerContents = (contents: string) => {
    if (viewer.current) {
      viewer.current.innerHTML = contents;
    }
  };

  // 공통정보 신규 등록
  const registGoodsCommonInfo = async () => {
    if (!editor.current || !profileData) return;
    if (!commonTitle) {
      toast({ title: '상품 공통 정보명을 입력해주세요', status: 'warning' });
      return;
    }

    const textWithImages = editor.current.getContents(false);

    // 이미지가 포함된 경우 s3에 이미지 저장 & url 변경
    const infoBody = await saveContentsImageToS3(textWithImages, profileData.email);

    // 공통정보 생성 요청
    createGoodsCommonInfo({
      info_name: commonTitle,
      info_value: infoBody,
    })
      .then((res) => {
        clearCommonInfoForm(); // 제목, 에디터 본문 초기화
        setViewerContents(textWithImages); // 미리보기 화면 변경
        setValue('goodsInfoId', res.data.id); // form 데이터에 생성된 공통정보 id 추가
        toast({ title: '상품 공통 정보를 생성하였습니다.' });
        onClose();
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: '상품 공통 정보를 생성하던 중 오류가 발생하였습니다.',
          status: 'error',
        });
      });
  };

  // 기존 공통정보 사용 - Select 값 변경시 뷰어 데이터 변경 && goodsInfoId 변경
  const onCommonInfoChange = (data: GoodsInfo) => {
    const { id, info_value } = data;
    setViewerContents(info_value || '');
    setValue('goodsInfoId', id);
  };
  return (
    <SectionWithTitle title="상품 공통 정보">
      <Text>공통정보</Text>
      <RadioGroup
        onChange={(value) => {
          setLoadType(value);
          if (value === 'new') {
            setViewerContents('');
            setValue('goodsInfoId', undefined);
          }
        }}
        value={loadType}
      >
        <Stack direction="row">
          <Radio value="new">신규 등록</Radio>
          <Radio value="load">기존 정보 불러오기</Radio>
        </Stack>
      </RadioGroup>
      {loadType === 'new' ? (
        <Button onClick={onOpen}>설명 쓰기</Button>
      ) : (
        <GoodsCommonInfoList onCommonInfoChange={onCommonInfoChange} />
      )}

      <Box ref={viewer} className="sun-editor-editable" minHeight="500px" />

      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>상품 공통 정보 작성하기</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Stack direction="row">
              <Text wordBreak="keep-all">상품 공통 정보명</Text>
              <Input
                value={commonTitle}
                onChange={(e) => setCommonTitle(e.currentTarget.value)}
              />
            </Stack>

            <SunEditor
              getSunEditorInstance={getSunEditorInstance}
              lang="ko"
              setOptions={{
                height: '500px',
                imageUploadSizeLimit: 20 * MB, // 퍼스트몰 최대 20mb
                buttonList: [['font', 'fontSize', 'align'], ['image']],
              }}
              defaultValue={watch('common_contents')}
            />
            <Button onClick={registGoodsCommonInfo} isLoading={isLoading}>
              등록
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </SectionWithTitle>
  );
}

export default GoodsRegistCommonInfo;
