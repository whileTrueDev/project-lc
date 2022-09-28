import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  SimpleGrid,
  Divider,
  useToast,
} from '@chakra-ui/react';
import { KkshowShoppingSectionItem } from '@prisma/client';
import {
  useAdminDeleteKkshowShoppingSectionData,
  useAdminKkshowShoppingSections,
  useAdminShoppingSectionOrder,
  useAdminUpdateKkshowShoppingSectionOrder,
} from '@project-lc/hooks';
import {
  layoutDesc,
  LAYOUT_AUTO_SLIDE,
  LAYOUT_BANNER,
  LAYOUT_BIG_SQUARE_LIST,
  LAYOUT_CAROUSEL,
  LAYOUT_RATING_DETAIL,
  LAYOUT_RECT_GRID,
  LAYOUT_SMALL_SQUARE_LIST,
} from '@project-lc/shared-types';
import { useCallback, useEffect, useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { DeleteIcon } from '@chakra-ui/icons';
import { PageManagerFieldItem } from './PageManagerFieldItem';
import { BannerDataManipulateContainer } from './AdminKkshowShoppingBanner';
import { CarouselDataManipulateContainer } from './AdminKkshowShoppingCarousel';
import { GoodsDataManipulateContainer } from './AdminKkshowShoppingGoods';
import { RatingDataManipulateContainer } from './AdminKkshowShoppingReviews';

type FormValues = {
  copyOrder: { sectionId: number }[];
};

export function AdminKkshowShoppingSectionOrderManage(): JSX.Element {
  const toast = useToast();
  const { data, isLoading } = useAdminKkshowShoppingSections();
  const { data: order, isLoading: orderLoading } = useAdminShoppingSectionOrder();

  const { control, formState, setValue, reset } = useForm<FormValues>({
    defaultValues: { copyOrder: [] },
  });
  const { fields, remove, move, append } = useFieldArray({
    control,
    name: 'copyOrder',
  });
  const moveUp = useCallback(
    (idx: number): void => {
      if (idx > 0) move(idx, idx - 1);
    },
    [move],
  );
  const moveDown = useCallback(
    (idx: number): void => {
      if (idx < fields.length - 1) move(idx, idx + 1);
    },
    [fields.length, move],
  );
  const addToDisplay = useCallback(
    (sectionId: number): void => {
      append({ sectionId });
    },
    [append],
  );

  useEffect(() => {
    if (order) {
      const sectionIdListCopy = order.map((id) => ({ sectionId: id }));
      setValue('copyOrder', sectionIdListCopy);
      reset({ copyOrder: sectionIdListCopy });
    }
  }, [order, reset, setValue]);

  // 쇼핑탭에 표시할 섹션
  const displaySectionList = useMemo(() => {
    if (!data || !order) return [];
    return fields
      .map((obj) => data.find((d) => d.id === obj.sectionId))
      .filter((val): val is KkshowShoppingSectionItem => {
        return val !== undefined;
      });
  }, [data, fields, order]);

  // 캐러셀은 쇼핑탭 최상단에 고정이므로 미표시섹션에 포함하지 않는다
  const fixedDisplaySection = useMemo(() => {
    if (!data || !order) return [];
    return data.filter((item) => item.layoutType === LAYOUT_CAROUSEL);
  }, [data, order]);

  // 표시되지 않은 섹션
  const notDisplaySectionList = useMemo(() => {
    if (!data || !order) return [];
    return data
      .filter((item) => !fields.map((obj) => obj.sectionId).includes(item.id))
      .filter((item) => !fixedDisplaySection.includes(item));
  }, [data, fields, fixedDisplaySection, order]);

  const { mutateAsync } = useAdminDeleteKkshowShoppingSectionData();
  const deleteSectionHandler = async (id: number): Promise<void> => {
    mutateAsync({ id })
      .then(() => toast({ title: '삭제 성공', status: 'success' }))
      .catch((e) => {
        console.error(e);
        toast({ title: '삭제 실패', description: e, status: 'error' });
      });
  };

  const orderMutation = useAdminUpdateKkshowShoppingSectionOrder();
  const updateOrderHandler = async (): Promise<void> => {
    const newOrder = fields.map((f) => f.sectionId);
    orderMutation
      .mutateAsync({ order: newOrder })
      .then(() => toast({ title: '변경사항이 반영되었습니다', status: 'success' }))
      .catch((e) => {
        console.error(e);
        toast({ title: '변경사항 반영 실패', description: e, status: 'error' });
      });
  };

  if (isLoading || orderLoading) return <Text>데이터 로딩중입니다</Text>;
  if (!data || !data.length) return <Text>섹션이 없습니다</Text>;
  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
      <Stack spacing={8} maxW="container.lg">
        <Stack>
          <Text>고정 표시 목록</Text>
          {fixedDisplaySection.map((item) => (
            <ShoppingSectionItemSimple key={item.id} section={item} />
          ))}
        </Stack>
        <Divider />
        <Stack>
          <Text>
            쇼핑탭에 표시되는 목록(삭제버튼을 누르면 미표시 목록으로 이동합니다)
          </Text>
          <Text color="red.400">
            표시되는 목록에서 순서 변경, 추가, 삭제 이후 반드시 변경사항을 저장해야 크크쇼
            쇼핑탭에 반영됩니다
          </Text>
          <Button
            colorScheme={formState.isDirty ? 'red' : 'blue'}
            onClick={updateOrderHandler}
            disabled={!formState.isDirty}
          >
            변경사항 저장하기
          </Button>
          {displaySectionList.map((item, index) => (
            <Stack key={item.id}>
              <PageManagerFieldItem
                isMoveUpDisabled={index === 0}
                isMoveDownDisabled={index === fields.length - 1}
                moveUp={() => moveUp(index)}
                moveDown={() => moveDown(index)}
                removeHandler={() => remove(index)}
              >
                <ShoppingSectionItemSimple section={item} />
              </PageManagerFieldItem>
            </Stack>
          ))}
        </Stack>
      </Stack>
      <Stack spacing={8} maxW="container.lg">
        <Button>새로운 섹션 생성하기</Button>
        <Divider />
        <Stack>
          <Text>미표시 목록</Text>
          <Text color="GrayText" size="sm">
            표시 버튼을 누르면 표시되는 목록으로 이동합니다
            <br />
            삭제 버튼을 누르면 해당 섹션 정보가 삭제됩니다
          </Text>
          <Stack>
            {notDisplaySectionList.map((item) => (
              <Stack
                direction="row"
                key={item.id}
                alignItems="center"
                rounded="lg"
                border="1px"
                p={2}
                px={4}
                mb={1}
                justifyContent="space-between"
              >
                <ShoppingSectionItemSimple section={item} />
                <Stack direction="row">
                  <Button
                    size="sm"
                    onClick={() => addToDisplay(item.id)}
                    colorScheme="blue"
                  >
                    표시
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => deleteSectionHandler(item.id)}
                    colorScheme="red"
                  >
                    삭제
                  </Button>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </SimpleGrid>
  );
}

export default AdminKkshowShoppingSectionOrderManage;

function ShoppingSectionItemSimple({
  section,
}: {
  section: KkshowShoppingSectionItem;
}): JSX.Element {
  const { id, title, layoutType } = section;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Stack direction="row">
      <Text>
        {id} {title} {layoutType}
      </Text>
      <Box>
        <Button onClick={onOpen} size="xs">
          데이터 수정
        </Button>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {layoutType} : {title}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {layoutType === LAYOUT_CAROUSEL && (
              <CarouselDataManipulateContainer item={section} onSuccess={onClose} />
            )}
            {(layoutType === LAYOUT_AUTO_SLIDE ||
              layoutType === LAYOUT_SMALL_SQUARE_LIST ||
              layoutType === LAYOUT_BIG_SQUARE_LIST ||
              layoutType === LAYOUT_RECT_GRID) && (
              <GoodsDataManipulateContainer
                item={section}
                onSuccess={onClose}
                buttonLabel={layoutDesc[layoutType].buttonLabel}
              />
            )}
            {layoutType === LAYOUT_RATING_DETAIL && (
              <RatingDataManipulateContainer
                item={section}
                onSuccess={onClose}
                buttonLabel={layoutDesc[layoutType].buttonLabel}
              />
            )}
            {layoutType === LAYOUT_BANNER && (
              <BannerDataManipulateContainer item={section} onSuccess={onClose} />
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
}
