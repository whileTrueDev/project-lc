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
import { boxStyle } from '@project-lc/components-constants/commonStyleProps';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import { MB } from '@project-lc/components-core/ImageInput';
import SectionWithTitle from '@project-lc/components-layout/SectionWithTitle';
import {
  GoodsCommonInfo,
  useDeleteGoodsCommonInfo,
  useGoodsCommonInfoItem,
  useGoodsCommonInfoList,
  useProfile,
} from '@project-lc/hooks';
import { GoodsFormValues } from '@project-lc/shared-types';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import 'suneditor/dist/css/suneditor.min.css';
import SunEditorCore from 'suneditor/src/lib/core';

const SunEditor = dynamic(() => import('suneditor-react'), {
  ssr: false,
  loading: () => (
    <Center>
      <Spinner />
    </Center>
  ),
});

/** 상품공통정보목록 셀렉트박스 *********************** */
function GoodsCommonInfoList({
  onCommonInfoChange,
  goodsInfoId,
  onGoodsInfoDelete,
}: {
  onCommonInfoChange: (data: GoodsInfo) => void;
  goodsInfoId?: number;
  onGoodsInfoDelete: () => void;
}): JSX.Element {
  const { data: profileData } = useProfile();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // 공통정보 목록 불러오기
  const { data: infoList, isLoading } = useGoodsCommonInfoList({
    sellerId: profileData?.id || 0,
    enabled: !!profileData?.id,
    onSuccess: (data: GoodsCommonInfo[]) => {
      // 공통정보 불러온 후 goodsIdInfo 값이 있으면(수정) 해당 goodsInfo를 기본값으로 설정
      if (goodsInfoId) {
        setValue(goodsInfoId.toString());
      } else if (data.length > 0) {
        setValue(data[0].id.toString());
      }
    },
  });

  // 특정 공통정보 내용 불러오기
  const [value, setValue] = useState<string | undefined>(
    goodsInfoId ? goodsInfoId.toString() : undefined,
  );
  useGoodsCommonInfoItem({
    id: Number(value),
    enabled: !!value,
    onSuccess: (data: GoodsInfo) => {
      onCommonInfoChange(data);
    },
  });

  // goodsInfoId 가 undefined인 경우 공통정보 목록의 첫번째 데이터 표시처리
  const queryClient = useQueryClient();
  useEffect(() => {
    if (goodsInfoId || !profileData) return;
    const list = queryClient.getQueryData<GoodsCommonInfo[]>([
      'GoodsCommonInfoList',
      profileData.id,
    ]);

    if (list && list.length > 0) {
      setValue(list[0].id.toString());
    }
  }, [goodsInfoId, profileData, queryClient]);

  // 공통정보 삭제 요청
  const { mutateAsync: deleteCommonInfoItem } = useDeleteGoodsCommonInfo();

  const deleteCommonInfo = async (): Promise<void> => {
    if (!value) throw new Error('공통정보가 없습니다');
    deleteCommonInfoItem({ id: Number(value) })
      .then((res) => {
        onGoodsInfoDelete();
        toast({ title: '해당 상품 공통 정보를 삭제하였습니다.', status: 'success' });
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: '해당 상품 공통 정보를 삭제하는데 오류가 발생하였습니다.',
          status: 'error',
        });
      });
  };

  // 로딩중인 경우
  if (isLoading)
    return (
      <Center>
        <Spinner />
      </Center>
    );
  return (
    <Box>
      {infoList && infoList.length > 0 ? (
        // {/* 공통정보 목록이 존재하는 경우 */}
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
        // {/* 공통정보 목록이 없는 경우 */}
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

/** 상품공통정보 부분 컴포넌트 */
export function GoodsRegistCommonInfo(): JSX.Element {
  const { watch, setValue, register, getValues } = useFormContext<GoodsFormValues>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const editor = useRef<SunEditorCore>();
  const viewer = useRef<any>();
  const getSunEditorInstance = (sunEditor: SunEditorCore): void => {
    editor.current = sunEditor;
  };

  const toast = useToast();
  const setViewerContents = (contents: string): void => {
    if (viewer.current) {
      viewer.current.innerHTML = contents;
    }
  };

  // 공통정보 신규 등록
  const registGoodsCommonInfo = async (): Promise<void> => {
    if (!getValues('common_contents_name')) {
      toast({ title: '상품 공통 정보명을 입력해주세요.', status: 'warning' });
      return;
    }
    if (!editor.current) return;

    const textWithImages = editor.current.getContents(false);
    setViewerContents(textWithImages);
    setValue('common_contents', textWithImages);

    toast({ title: '상품 공통 정보가 임시 저장되었습니다.', status: 'success' });
    onClose();
  };

  // 기존 공통정보 사용 - Select 값 변경시 뷰어 데이터 변경 && goodsInfoId 변경
  const onCommonInfoChange = (data: GoodsInfo): void => {
    const { id, info_value } = data;
    setViewerContents(info_value || '');
    setValue('goodsInfoId', id);
  };

  // 신규등록으로 라디오버튼 이동시 공통정보 관련 정보 초기화
  const clearGoodsInfoForNewInfo = (): void => {
    setValue('common_contents_type', 'new');
    setValue('common_contents_name', '');
    setValue('common_contents', '');
    setValue('goodsInfoId', undefined);
    setViewerContents('');
  };
  const commonInfoId = watch('goodsInfoId');
  const commonContentsType = watch('common_contents_type');

  return (
    <SectionWithTitle title="상품 공통 정보 *" variant="outlined">
      <Stack>
        <RadioGroup
          onChange={(value) => {
            if (value === 'new') {
              clearGoodsInfoForNewInfo();
            }
          }}
          value={commonContentsType}
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

        {watch('common_contents_type') === 'new' ? (
          <Stack>
            <Text>
              ** 신규 등록 으로 작성한 상품 공통 정보는 상품 등록을 완료 할 시 기존 정보
              리스트에 자동 추가됩니다.
            </Text>
            <Box>
              <Button
                aria-label="Search database"
                rightIcon={<EditIcon />}
                onClick={onOpen}
              >
                공통정보쓰기
              </Button>
            </Box>
          </Stack>
        ) : (
          <GoodsCommonInfoList
            goodsInfoId={commonInfoId}
            onCommonInfoChange={onCommonInfoChange}
            onGoodsInfoDelete={clearGoodsInfoForNewInfo}
          />
        )}

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

            <Stack alignItems="flex-start">
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
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </SectionWithTitle>
  );
}

export default GoodsRegistCommonInfo;
