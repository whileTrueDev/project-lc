import { DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  IconButton,
  Select,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { GoodsInfo } from '@prisma/client';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import {
  getGoodsCommonInfoItem,
  GoodsCommonInfo,
  useDeleteGoodsCommonInfo,
  useGoodsCommonInfoList,
  useProfile,
  useUpdateGoodsCommonInfo,
} from '@project-lc/hooks';
import { GoodsFormValues } from '@project-lc/shared-types';
import { saveContentsImageToS3 } from '@project-lc/utils-frontend';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import 'suneditor/dist/css/suneditor.min.css';
import SunEditorCore from 'suneditor/src/lib/core';
import GoodsCommonInfoModal from './GoodsCommonInfoModal';

/** 상품공통정보목록 셀렉트박스 *********************** */
export function GoodsCommonInfoList({
  onCommonInfoChange,
  onGoodsInfoDelete,
  getSunEditorInstance,
  getEditorContents,
  setViewerContents,
}: {
  onCommonInfoChange: (data: GoodsInfo) => void;
  onGoodsInfoDelete: () => void;
  getSunEditorInstance: (sunEditor: SunEditorCore) => void;
  getEditorContents: () => string;
  setViewerContents: (contents: string) => void;
}): JSX.Element {
  const { data: profileData } = useProfile();
  const deleteDialog = useDisclosure();
  const editDialog = useDisclosure();
  const toast = useToast();
  const { setValue, getValues, watch } = useFormContext<GoodsFormValues>();

  // formProvider에 저장된 goodsInfoId. number | undefined
  const goodsInfoId = watch('goodsInfoId');

  // 불러온 특정 공통정보 id 저장
  const [_goodsInfoId, setGoodsInfoId] = useState<number | undefined>(goodsInfoId);

  // 공통정보 목록 불러오기
  const { data: infoList, isLoading: infoListLoading } = useGoodsCommonInfoList({
    sellerId: profileData?.id,
    enabled: !!profileData?.id,
    onSuccess: (data: GoodsCommonInfo[]) => {
      // 공통정보 불러온 후 goodsIdInfo 값이 없으면 첫번째 공통정보를 선택
      if (!goodsInfoId && data.length > 0) {
        setGoodsInfoId(data[0].id);
      }
    },
  });

  // watch('goodsInfoId') 가 변경되는 경우 => 이 컴포넌트 내부에서 사용하는 _goodsInfoId 값도 업데이트
  useEffect(() => {
    setGoodsInfoId(goodsInfoId);
  }, [goodsInfoId]);

  // 공통정보 선택시(이 컴포넌트 내부에서 사용하는 _goodsInfoId 값 변경시) 해당 공통정보 id의 내용 가져옴
  useEffect(() => {
    if (_goodsInfoId) {
      getGoodsCommonInfoItem(_goodsInfoId)
        .then((goodsInfoData) => {
          onCommonInfoChange(goodsInfoData);
        })
        .catch((e) => {
          console.error(e);
          toast({
            title: '공통정보 내용을 불러오는 중 오류가 발생했습니다.',
            status: 'error',
          });
        });
    } else if (infoList && infoList.length > 0) {
      setGoodsInfoId(infoList[0].id);
    }
    // 다른 dep 값은 추가하지 않는다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_goodsInfoId, infoList]);

  /** 공통정보 삭제 요청 */
  const { mutateAsync: deleteCommonInfoItem } = useDeleteGoodsCommonInfo();
  const deleteCommonInfo = async (): Promise<void> => {
    if (!_goodsInfoId || !infoList) {
      toast({ title: '공통정보가 없습니다', status: 'error' });
      return;
    }

    if (infoList.length <= 1) {
      // 남아있는 공통정보가 1개 이하인 경우 삭제못하도록
      toast({ title: '최소 하나의 공통정보가 남아있어야 합니다', status: 'error' });
      return;
    }

    deleteCommonInfoItem({ id: Number(_goodsInfoId) })
      .then(() => {
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

  /** db에 저장된 공통정보 수정 요청 */
  const { mutateAsync: updateCommonInfoItem, isLoading: updateLoading } =
    useUpdateGoodsCommonInfo();

  const updateCommonInfo = async (): Promise<void> => {
    // 유저가 수정한 상품공통정보명, 내용 가져오기
    const newGoodsCommonInfoName = getValues('common_contents_name');
    const newGoodsCommonInfoContents = getEditorContents().trim();

    if (!profileData?.email) return;
    if (!_goodsInfoId) throw new Error('공통정보가 없습니다');

    if (!newGoodsCommonInfoContents || newGoodsCommonInfoContents === '<p><br></p>') {
      toast({ title: '수정된 공통정보 내용을 입력해주세요', status: 'warning' });
      return;
    }
    // s3에 저장되지 않은 이미지 저장처리
    const commonInfoBody = await saveContentsImageToS3(
      newGoodsCommonInfoContents,
      profileData.email,
    );

    // 업데이트 요청 => 새로 변경된 내용으로 표시
    await updateCommonInfoItem(
      {
        id: _goodsInfoId,
        dto: {
          info_name: newGoodsCommonInfoName || '',
          info_value: commonInfoBody,
        },
      },
      {
        onSuccess: (data) => {
          toast({ title: '공통정보를 수정하였습니다', status: 'success' });
          // => 새로 변경된 내용으로 표시
          setValue('common_contents', data.info_value);
          setViewerContents(data.info_value);
          editDialog.onClose();
        },
        onError: (e) => {
          console.error(e);
          toast({
            title: '공통정보를 수정하는 중 오류가 발생했습니다',
            status: 'error',
            description: e?.response?.data?.messsage,
          });
        },
      },
    );
  };

  // 로딩중인 경우
  if (infoListLoading)
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
          <Select
            value={_goodsInfoId}
            onChange={(e) => setGoodsInfoId(Number(e.currentTarget.value))}
          >
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
          <Button onClick={editDialog.onOpen}>수정하기</Button>
          <IconButton
            onClick={deleteDialog.onOpen}
            aria-label="상세정보 삭제"
            icon={<DeleteIcon />}
          />
        </Stack>
      ) : (
        // {/* 공통정보 목록이 없는 경우 */}
        <Text>등록된 상품 공통정보가 없습니다. 상품 공통 정보를 등록해주세요.</Text>
      )}

      {/* 상세정보 삭제 확인 모달 */}
      <ConfirmDialog
        title="상세정보 삭제"
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.onClose}
        onConfirm={deleteCommonInfo}
      >
        <Stack>
          <Text>( 고유번호 : {_goodsInfoId} ) 상품 공통 정보를 삭제하시겠습니까?</Text>
          <Text>삭제 후 복구가 불가능합니다</Text>
          <Text>연결된 공통 정보가 없는 상품에는 기본 내용이 표시됩니다</Text>
          <Text>
            다른 상품 공통 정보를 표시하고 싶으시면 다른 상품 공통정보를 선택하거나 새로
            작성해주세요
          </Text>
        </Stack>
      </ConfirmDialog>

      {/* 공통정보 수정 모달 => onButtonClick에 이미 저장된 공통정보 수정 핸들러 전달 */}
      <GoodsCommonInfoModal
        isOpen={editDialog.isOpen}
        onClose={editDialog.onClose}
        buttonProps={{
          onClick: updateCommonInfo,
          isLoading: updateLoading,
        }}
        getSunEditorInstance={getSunEditorInstance}
      />
    </Box>
  );
}
