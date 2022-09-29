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
  Select,
  Input,
  Heading,
  Collapse,
} from '@chakra-ui/react';
import { KkshowShoppingSectionItem } from '@prisma/client';
import {
  useAdminCreateKkshowShoppingSectionItem,
  useAdminDeleteKkshowShoppingSectionData,
  useAdminKkshowShoppingSections,
  useAdminShoppingSectionOrder,
  useAdminUpdateKkshowShoppingSectionOrder,
} from '@project-lc/hooks';
import {
  layoutDesc,
  layoutNames,
  LAYOUT_AUTO_SLIDE,
  LAYOUT_BANNER,
  LAYOUT_BIG_SQUARE_LIST,
  LAYOUT_CAROUSEL,
  LAYOUT_RATING_DETAIL,
  LAYOUT_RECT_GRID,
  LAYOUT_SMALL_SQUARE_LIST,
} from '@project-lc/shared-types';
import { useCallback, useEffect, useMemo } from 'react';
import {
  FieldArrayWithId,
  FormState,
  useFieldArray,
  UseFieldArrayAppend,
  UseFieldArrayMove,
  UseFieldArrayRemove,
  useForm,
} from 'react-hook-form';
import { ErrorText } from '@project-lc/components-core/ErrorText';
import { PageManagerFieldItem } from './PageManagerFieldItem';
import { BannerDataManipulateContainer } from './AdminKkshowShoppingBanner';
import { CarouselDataManipulateContainer } from './AdminKkshowShoppingCarousel';
import { GoodsDataManipulateContainer } from './AdminKkshowShoppingGoods';
import { RatingDataManipulateContainer } from './AdminKkshowShoppingReviews';

type FormValues = {
  copyOrder: { sectionId: number }[];
};

export function AdminKkshowShoppingSectionOrderManage(): JSX.Element {
  const { data, isLoading } = useAdminKkshowShoppingSections();
  const { data: order, isLoading: orderLoading } = useAdminShoppingSectionOrder();

  const { control, formState, setValue, reset } = useForm<FormValues>({
    defaultValues: { copyOrder: [] },
  });
  const { fields, remove, move, append } = useFieldArray({
    control,
    name: 'copyOrder',
  });

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

  if (isLoading || orderLoading) return <Text>데이터 로딩중입니다</Text>;
  if (!data || !data.length) return <Text>섹션이 없습니다</Text>;
  return (
    <Stack spacing={4}>
      <Heading size="md">쇼핑페이지 메인 관리</Heading>
      <Divider />
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        <Stack spacing={8} maxW="container.lg">
          <Stack>
            <Heading size="sm">고정 표시 섹션</Heading>
            <Text>(쇼핑페이지 상단에 고정으로 표시됩니다)</Text>
            {fixedDisplaySection.map((item) => (
              <ShoppingSectionItemSimple key={item.id} section={item} />
            ))}
          </Stack>
          <Divider variant="dashed" />
          <DisplaySectionListContainer
            move={move}
            remove={remove}
            fields={fields}
            formState={formState}
            displaySectionList={displaySectionList}
          />
        </Stack>
        <Stack spacing={8} maxW="container.lg">
          <NewSectionCreateForm />
          <Divider variant="dashed" />
          <Stack>
            <Heading size="sm">미표시 목록</Heading>
            <Text size="sm">표시 버튼을 누르면 표시되는 목록으로 이동합니다</Text>
            <Text color="red" size="sm">
              삭제 버튼을 누르면 해당 섹션 정보가 바로 삭제됩니다
            </Text>
            <Stack>
              {notDisplaySectionList.map((item) => (
                <NotDisplaySectionListItemContainer
                  key={item.id}
                  item={item}
                  append={append}
                >
                  <ShoppingSectionItemSimple section={item} />
                </NotDisplaySectionListItemContainer>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </SimpleGrid>
    </Stack>
  );
}

export default AdminKkshowShoppingSectionOrderManage;

/** 쇼핑탭에 표시되는 목록 컴포넌트. 섹션 순서 변경, 미표시목록으로 섹션을 이동시킬 수 있다 */
function DisplaySectionListContainer({
  move,
  remove,
  fields,
  formState,
  displaySectionList,
}: {
  move: UseFieldArrayMove;
  remove: UseFieldArrayRemove;
  fields: FieldArrayWithId<FormValues, 'copyOrder', 'id'>[];
  formState: FormState<FormValues>;
  displaySectionList: KkshowShoppingSectionItem[];
}): JSX.Element {
  const toast = useToast();

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
  return (
    <Stack>
      <Heading size="sm">쇼핑탭에 표시되는 목록</Heading>
      <Text>(삭제버튼을 누르면 미표시 목록으로 이동합니다)</Text>
      {formState.isDirty && (
        <Text color="red.400">
          표시되는 목록에서 순서 변경, 추가, 삭제 이후 반드시 변경사항을 저장해야 크크쇼
          쇼핑탭에 반영됩니다
        </Text>
      )}

      <Button
        colorScheme={formState.isDirty ? 'red' : undefined}
        onClick={updateOrderHandler}
        disabled={!formState.isDirty}
      >
        순서 변경사항 저장하기
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
  );
}

type NewSectionCreateFormData = { layoutType: keyof typeof layoutDesc; title: string };
/** 새로운 섹션 생성하기 컴포넌트, 섹션 레이아웃을 선택하고 섹션명을 입력하여 섹션을 생성할 수 있다 */
function NewSectionCreateForm(): JSX.Element {
  const { isOpen, onToggle } = useDisclosure();
  const toast = useToast();
  const { register, watch, handleSubmit, formState, reset } =
    useForm<NewSectionCreateFormData>();
  // 캐러셀은 쇼핑탭 상단에 고정으로 표시하므로 추가할 수 있는 섹션에서 제외한다
  const sections = layoutNames
    .filter((layout) => layout !== LAYOUT_CAROUSEL)
    .map((layout) => {
      return layoutDesc[layout];
    });

  const { mutateAsync } = useAdminCreateKkshowShoppingSectionItem();
  const onSubmit = (formData: NewSectionCreateFormData): void => {
    const dto = {
      layoutType: formData.layoutType,
      title: formData.title,
      data: layoutDesc[formData.layoutType].defaultValue,
    };
    mutateAsync(dto)
      .then(() => {
        toast({
          title: '생성 성공. 미표시 목록에서 생성된 섹션의 데이터를 수정할 수 있습니다',
          status: 'success',
        });
        if (isOpen) onToggle();
        reset();
      })
      .catch((e) => {
        console.error(e);
        toast({ title: '생성 실패', description: e, status: 'error' });
      });
  };

  return (
    <Stack>
      <Stack direction="row" alignItems="center">
        <Heading size="sm">새로운 섹션 생성하기</Heading>
        <Button size="xs" onClick={onToggle}>
          {isOpen ? '닫기' : '열기'}
        </Button>
      </Stack>
      <Collapse in={isOpen} animateOpacity>
        <Stack as="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="row" alignItems="center">
            <Text>레이아웃 선택</Text>
            <Select
              placeholder="Select option"
              {...register('layoutType', { required: '레이아웃을 선택해주세요' })}
              width="auto"
            >
              {sections.map((section) => {
                return (
                  <option key={section.key} value={section.key}>
                    {section.name}
                  </option>
                );
              })}
            </Select>
          </Stack>
          {formState.errors.layoutType && (
            <ErrorText>{formState.errors.layoutType.message}</ErrorText>
          )}

          {watch('layoutType') && (
            <Text color="GrayText">{layoutDesc[watch('layoutType')].desc}</Text>
          )}
          <Stack direction="row" alignItems="center">
            <Text>섹션명</Text>
            <Input
              {...register('title', {
                required: '섹션명을 입력해주세요. 나중에 수정할 수 있습니다',
              })}
              width="auto"
            />
          </Stack>
          {formState.errors.title && (
            <ErrorText>{formState.errors.title.message}</ErrorText>
          )}
          <Button type="submit">생성</Button>
        </Stack>
      </Collapse>
    </Stack>
  );
}

/** 미표시목록 컨테이너 컴포넌트. 데이터 수정 외의 버튼을 표시한다 */
function NotDisplaySectionListItemContainer({
  item,
  children,
  append,
}: {
  append: UseFieldArrayAppend<FormValues, 'copyOrder'>;
  item: KkshowShoppingSectionItem;
  children: React.ReactNode;
}): JSX.Element {
  const toast = useToast();
  const buttons = [
    {
      label: '표시',
      handler: (section: KkshowShoppingSectionItem) => append({ sectionId: section.id }),
      colorScheme: 'blue',
    },
    {
      label: '삭제',
      handler: (section: KkshowShoppingSectionItem) => deleteSectionHandler(section.id),
      colorScheme: 'red',
    },
  ];
  const { mutateAsync } = useAdminDeleteKkshowShoppingSectionData();
  const deleteSectionHandler = async (id: number): Promise<void> => {
    mutateAsync({ id })
      .then(() => toast({ title: '삭제 성공', status: 'success' }))
      .catch((e) => {
        console.error(e);
        toast({ title: '삭제 실패', description: e, status: 'error' });
      });
  };
  return (
    <Stack
      direction="row"
      alignItems="center"
      rounded="lg"
      border="1px"
      p={2}
      px={4}
      mb={1}
      justifyContent="space-between"
    >
      {children}

      <Stack direction="row">
        {buttons.map((btn) => (
          <Button
            key={btn.label}
            size="sm"
            onClick={() => btn.handler(item)}
            colorScheme={btn.colorScheme}
          >
            {btn.label}
          </Button>
        ))}
      </Stack>
    </Stack>
  );
}

/** 섹션아이템 컴포넌트. 데이터 수정 다이얼로그를 포함하고 있다
 * 레이아웃타입에 따라 다른 다이얼로그를 표시한다
 */
function ShoppingSectionItemSimple({
  section,
}: {
  section: KkshowShoppingSectionItem;
}): JSX.Element {
  const { title, layoutType } = section;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Stack direction="row">
      <Text>
        {title}{' '}
        <Text as="span" color="grayText" fontSize="sm">
          [{layoutDesc[layoutType as keyof typeof layoutDesc].name}]
        </Text>
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
            [{layoutDesc[layoutType as keyof typeof layoutDesc].name}] : {title}
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
              닫기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
}
