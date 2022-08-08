import { EditIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { GoodsInfo } from '@prisma/client';
import { boxStyle } from '@project-lc/components-constants/commonStyleProps';
import SectionWithTitle from '@project-lc/components-layout/SectionWithTitle';
import { GoodsFormValues } from '@project-lc/shared-types';
import { useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import 'suneditor/dist/css/suneditor.min.css';
import SunEditorCore from 'suneditor/src/lib/core';
import { GoodsCommonInfoList } from './common-info/GoodsCommonInfoList';
import GoodsCommonInfoModal from './common-info/GoodsCommonInfoModal';

/** 상품공통정보 부분 컴포넌트 */
export function GoodsRegistCommonInfo(): JSX.Element {
  const { watch, setValue, register, getValues } = useFormContext<GoodsFormValues>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const prevGoodsInfoId = useRef<number | undefined>(getValues('goodsInfoId')); // 상품 수정시 기존공통정보 id 저장
  const editor = useRef<SunEditorCore>();
  const viewer = useRef<any>();
  const getSunEditorInstance = (sunEditor: SunEditorCore): void => {
    editor.current = sunEditor;
  };

  const toast = useToast();
  /** 뷰어에 공통정보 내용 표시 */
  const setViewerContents = (contents: string): void => {
    if (viewer.current) {
      viewer.current.innerHTML = contents;
    }
  };
  /**  에디터에 입력된 공통정보 값 가져오기 */
  const getEditorContents = (): string => {
    if (editor.current) {
      return editor.current.getContents(false);
    }
    return '';
  };

  // 공통정보 신규 등록
  const registGoodsCommonInfo = async (): Promise<void> => {
    if (!getValues('common_contents_name')) {
      toast({ title: '상품 공통 정보명을 입력해주세요.', status: 'warning' });
      return;
    }
    if (!editor.current) return;

    const textWithImages = getEditorContents();
    setViewerContents(textWithImages);
    setValue('common_contents', textWithImages);

    toast({ title: '상품 공통 정보가 임시 저장되었습니다.', status: 'success' });
    onClose();
  };

  // 기존 공통정보 사용 - Select 값 변경시 뷰어 데이터 변경 && goodsInfoId 변경
  const onCommonInfoChange = (data: GoodsInfo): void => {
    const { id, info_value, info_name } = data;
    setViewerContents(info_value || '');
    setValue('common_contents', info_value);
    setValue('common_contents_name', info_name);
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
    <SectionWithTitle title="상품 공통 정보" variant="outlined">
      <RadioGroup
        onChange={(value) => {
          if (value === 'new') {
            clearGoodsInfoForNewInfo();
          } else {
            setValue('goodsInfoId', prevGoodsInfoId.current);
          }
        }}
        value={commonContentsType}
      >
        <Stack direction="row">
          <Radio {...register('common_contents_type')} value="load">
            기존 정보 불러오기
          </Radio>
          <Radio {...register('common_contents_type')} value="new">
            신규 등록
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
        // 기존정보 불러오기 컴포넌트
        <GoodsCommonInfoList
          goodsInfoId={commonInfoId}
          onCommonInfoChange={onCommonInfoChange}
          onGoodsInfoDelete={clearGoodsInfoForNewInfo}
          getSunEditorInstance={getSunEditorInstance}
          getEditorContents={getEditorContents}
          setViewerContents={setViewerContents}
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

      {/* 공통정보 생성(새로 작성) 모달 => onButtonClick 에 registGoodsCommonInfo 전달 */}
      <GoodsCommonInfoModal
        isOpen={isOpen}
        onClose={onClose}
        getSunEditorInstance={getSunEditorInstance}
        buttonProps={{
          onClick: registGoodsCommonInfo,
        }}
      />
    </SectionWithTitle>
  );
}

export default GoodsRegistCommonInfo;
