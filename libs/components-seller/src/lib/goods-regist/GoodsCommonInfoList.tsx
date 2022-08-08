import { DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
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
  GoodsCommonInfo,
  useDeleteGoodsCommonInfo,
  useGoodsCommonInfoItem,
  useGoodsCommonInfoList,
  useProfile,
} from '@project-lc/hooks';
import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import 'suneditor/dist/css/suneditor.min.css';

/** 상품공통정보목록 셀렉트박스 *********************** */
export function GoodsCommonInfoList({
  onCommonInfoChange,
  goodsInfoId = 1, // 판매자 생성시 기본 상품정보가 id:1 로 생성됨
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
    enabled: !!profileData?.id && !!goodsInfoId,
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
