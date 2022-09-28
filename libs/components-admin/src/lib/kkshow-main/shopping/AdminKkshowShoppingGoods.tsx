import { AddIcon } from '@chakra-ui/icons';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Image,
  Input,
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
  useToast,
} from '@chakra-ui/react';
import { KkshowShoppingSectionItem } from '@prisma/client';
import { ChakraAutoComplete } from '@project-lc/components-core/ChakraAutoComplete';
import ImageInputDialog, {
  ImageInputFileReadData,
} from '@project-lc/components-core/ImageInputDialog';
import {
  useAdminUpdateKkshowShoppingSectionData,
  useAllGoodsIds,
  useGoodsById,
} from '@project-lc/hooks';
import { KkshowShoppingTabGoodsData } from '@project-lc/shared-types';
import { parseJsonToGenericType } from '@project-lc/utils';
import { s3 } from '@project-lc/utils-s3';
import path from 'path';
import { memo, useEffect, useMemo, useState, useCallback } from 'react';
import { useForm, useFormContext, useFieldArray, FormProvider } from 'react-hook-form';
import { PageManagerFieldItem } from './PageManagerFieldItem';

export interface AdminKkshowShoppingGoodsProps {
  index: number;
  type: 'data';
}

export function AdminKkshowShoppingGoods({
  index,
  type,
}: AdminKkshowShoppingGoodsProps): JSX.Element {
  const imageUploadDialog = useDisclosure();
  const findGoodsDialog = useDisclosure();
  const { register, watch, setValue } = useFormContext<GoodsDataManipulateFormData>();

  const FieldHeader = memo(
    ({ header, isRequired }: { header: string; isRequired?: boolean }): JSX.Element => (
      <Heading fontSize="lg" fontWeight="bold">
        {header}
        {isRequired && (
          <Text as="span" color="red">
            *
          </Text>
        )}
      </Heading>
    ),
  );

  const handleImageUploadConfirm = async (
    imageData: ImageInputFileReadData,
  ): Promise<void> => {
    const timestamp = new Date().getTime();
    const s3KeyType = 'kkshow-shopping-goods';
    const key = path.join(s3KeyType, `${timestamp}_${imageData.filename}`);

    const { objectUrl } = await s3.sendPutObjectCommand({
      Key: key,
      Body: imageData.file,
      ContentType: imageData.file.type,
      ACL: 'public-read',
    });
    setValue(`${type}.${index}.imageUrl`, objectUrl, { shouldDirty: true });
  };

  return (
    <Box>
      <Button onClick={findGoodsDialog.onOpen}>상품정보 불러오기</Button>
      <AdminKkshowShoppingGoodsFindDialog
        index={index}
        type={type}
        isOpen={findGoodsDialog.isOpen}
        onClose={findGoodsDialog.onClose}
      />
      <Flex gap={3} mt={3}>
        <Box textAlign="center">
          <FieldHeader header="순서" />
          <Heading
            p={1}
            rounded="lg"
            as="p"
            fontSize="md"
            bgColor="blue.500"
            color="white"
          >
            {index + 1}
          </Heading>
        </Box>
        <Stack>
          <FieldHeader header="이미지" />
          <Image maxW={150} src={watch(`${type}.${index}.imageUrl`)} rounded="2xl" />
        </Stack>
        <Stack minW={300}>
          <Box>
            <FieldHeader header="이미지 주소" isRequired />
            <Text fontSize="xs" color="GrayText">
              이미지 주소를 입력하거나 새로운 이미지를 업로드할 수 있습니다.
            </Text>
          </Box>
          <Input
            minW={200}
            {...register(`${type}.${index}.imageUrl`, { required: true })}
            isRequired
          />
          <Button leftIcon={<AddIcon />} onClick={imageUploadDialog.onOpen}>
            이미지 업로드
          </Button>
        </Stack>
        <Stack minW={300}>
          <Box>
            <FieldHeader header="이동링크주소" isRequired />

            <Text fontSize="xs" color="GrayText">
              이미지 클릭시 이동될 링크 주소를 입력하세요.
            </Text>
          </Box>
          <Input
            {...register(`${type}.${index}.linkUrl`, { required: true })}
            isRequired
          />
        </Stack>
        <Stack minW={300}>
          <Box>
            <FieldHeader header="상품정보" isRequired />
            <Text fontSize="xs" color="GrayText">
              전시될 상품의 정보를 입력해주세요. 할인율은 자동 계산됩니다.
            </Text>
          </Box>
          <FormControl as={Flex} align="center" isRequired>
            <FormLabel minW={42} m={0} htmlFor="이름" fontSize="xs">
              이름
            </FormLabel>
            <Input {...register(`${type}.${index}.name`, { required: true })} />
          </FormControl>
          <FormControl as={Flex} align="center" isRequired>
            <FormLabel minW={42} m={0} htmlFor="정가" fontSize="xs">
              정가
            </FormLabel>
            <Input
              {...register(`${type}.${index}.normalPrice`, { required: true })}
              type="number"
            />
          </FormControl>
          <FormControl as={Flex} align="center">
            <FormLabel minW={42} m={0} htmlFor="할인가" fontSize="xs">
              할인가
            </FormLabel>
            <Input
              {...register(`${type}.${index}.discountedPrice`)}
              type="number"
              placeholder="할인하지 않는 경우 비워두세요"
            />
          </FormControl>
        </Stack>
      </Flex>

      <ImageInputDialog
        isOpen={imageUploadDialog.isOpen}
        onClose={imageUploadDialog.onClose}
        onConfirm={handleImageUploadConfirm}
      />
    </Box>
  );
}

export default AdminKkshowShoppingGoods;

interface AdminKkshowShoppingGoodsFindDialogProps extends AdminKkshowShoppingGoodsProps {
  isOpen: boolean;
  onClose: () => void;
}
function AdminKkshowShoppingGoodsFindDialog({
  isOpen,
  onClose,
  type,
  index,
}: AdminKkshowShoppingGoodsFindDialogProps): JSX.Element {
  const toast = useToast();
  // 상품 auto complete
  const goodsIdList = useAllGoodsIds();
  // 선택된 상품GoodsId
  const [selectedGoodsId, setSelectedGoodsId] = useState<number | null>(null);

  // 선택된 상품 데이터 조회
  const selectedGoodsData = useGoodsById(selectedGoodsId);
  // 선택된 상품 이미지
  const [selectedImage, setSelectedImage] = useState('');
  // 상품 변경시 상품이미지 초기화
  useEffect(() => {
    setSelectedImage('');
  }, [selectedGoodsId]);

  // 상품 선택 정보
  const selectedData = useMemo(() => {
    if (selectedGoodsData.data) {
      const goodsName = selectedGoodsData.data.goods_name;
      const linkUrl = `/goods/${selectedGoodsData.data.id}`;
      const imageUrl = selectedGoodsData.data.image.find(
        (i) => i.image === selectedImage,
      )?.image;
      const normalPrice = selectedGoodsData.data.options.find(
        (o) => o.default_option === 'y',
      )?.consumer_price;
      const discountedPrice = selectedGoodsData.data.options.find(
        (o) => o.default_option === 'y',
      )?.price;
      return {
        goodsName,
        linkUrl,
        imageUrl,
        normalPrice,
        discountedPrice,
      };
    }
    return null;
  }, [selectedGoodsData.data, selectedImage]);

  const { setValue } = useFormContext<GoodsDataManipulateFormData>();
  const onSelect = (): void => {
    if (selectedData) {
      setValue(`${type}.${index}.name`, selectedData.goodsName, { shouldDirty: true });
      setValue(`${type}.${index}.linkUrl`, selectedData.linkUrl, { shouldDirty: true });
      setValue(`${type}.${index}.imageUrl`, selectedData.imageUrl || '', {
        shouldDirty: true,
      });
      setValue(`${type}.${index}.normalPrice`, Number(selectedData.normalPrice), {
        shouldDirty: true,
      });
      if (!Number.isNaN(Number(selectedData.discountedPrice))) {
        setValue(
          `${type}.${index}.discountedPrice`,
          Number(selectedData.discountedPrice),
          { shouldDirty: true },
        );
      } else {
        setValue(`${type}.${index}.discountedPrice`, undefined, { shouldDirty: true });
      }
      onClose();
    } else {
      toast({
        description: '상품이 선택되지 않았거나 선택 과정에서 오류가 발생했습니다.',
        status: 'error',
      });
    }
  };

  const handleClose = (): void => {
    onClose();
    // 모달창 닫을 때 초기화
    setSelectedGoodsId(null);
    setSelectedImage('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      isCentered
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>상품정보 불러오기</ModalHeader>
        <ModalCloseButton />
        <ModalBody minH={300}>
          <Stack>
            <Text>상품 찾아보기</Text>
            <ChakraAutoComplete
              getOptionLabel={(opt) => opt?.goods_name || opt?.id.toString() || ''}
              onChange={(newV) => {
                setSelectedGoodsId(newV?.id || null);
              }}
              options={goodsIdList.data || []}
            />
            <Box>
              {selectedGoodsData.data && (
                <Grid templateColumns="repeat(4, 1fr)">
                  <GridItem>
                    <Text>
                      이미지{' '}
                      <Text fontSize="xx-small" as="span">
                        (이미지를 클릭해 선택)
                      </Text>
                    </Text>
                  </GridItem>
                  <GridItem colSpan={3}>
                    <Flex gap={2} flexWrap="wrap">
                      {selectedGoodsData.data.image.map((i) => (
                        <Image
                          key={i.id}
                          src={i.image}
                          w={50}
                          h={50}
                          outline={selectedImage === i.image ? '2px solid blue' : 'unset'}
                          rounded="md"
                          _hover={{
                            cursor: 'pointer',
                            outline: '2px solid red',
                          }}
                          onClick={() => {
                            setSelectedImage(i.image);
                          }}
                        />
                      ))}
                    </Flex>
                  </GridItem>

                  <GridItem>
                    <Text>이미지 주소</Text>
                  </GridItem>
                  <GridItem colSpan={3}>
                    <Text>{selectedData?.imageUrl || '빈 값'}</Text>
                  </GridItem>

                  <GridItem>
                    <Text>이동링크주소</Text>
                  </GridItem>
                  <GridItem colSpan={3}>
                    <Text>
                      {selectedData?.linkUrl
                        ? `/goods/${selectedData?.linkUrl}`
                        : '빈 값'}
                    </Text>
                  </GridItem>

                  <GridItem>
                    <Text>상품정보 - 이름</Text>
                  </GridItem>
                  <GridItem colSpan={3}>
                    <Text>이름: {selectedData?.goodsName || '빈 값'}</Text>
                  </GridItem>

                  <GridItem>
                    <Text>
                      상품정보 - 정가{' '}
                      <Text as="span" fontSize="xx-small">
                        (기본옵션)
                      </Text>
                    </Text>
                  </GridItem>
                  <GridItem colSpan={3}>
                    <Text>{selectedData?.normalPrice || '빈 값'}</Text>
                  </GridItem>

                  <GridItem>
                    <Text>
                      상품정보 - 할인가{' '}
                      <Text as="span" fontSize="xx-small">
                        (기본옵션)
                      </Text>
                    </Text>
                  </GridItem>
                  <GridItem colSpan={3}>
                    <Text>{selectedData?.discountedPrice || '빈 값'}</Text>
                  </GridItem>
                </Grid>
              )}
            </Box>
          </Stack>

          {selectedGoodsId && selectedData && !selectedData.imageUrl && (
            <Alert status="info" my={4}>
              <AlertIcon />
              <Box>
                <AlertTitle>이미지가 선택되지 않았습니다.</AlertTitle>
                <AlertDescription>
                  상품 이미지를 클릭하여 이미지를 선택해주세요. 만약 이미지가 업로드 되지
                  않은 상품이라면 선택하지 않고 상품정보를 불러온 후 이미지를 업로드하거나
                  업로드된 이미지 주소를 입력해주세요.
                </AlertDescription>
              </Box>
            </Alert>
          )}
        </ModalBody>

        <ModalFooter>
          <ButtonGroup>
            <Button onClick={handleClose}>닫기</Button>
            <Button onClick={onSelect} colorScheme="blue" isDisabled={!selectedGoodsId}>
              적용
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export interface GoodsDataManipulateContainerProps {
  item: KkshowShoppingSectionItem;
  buttonLabel?: string;
  onSuccess?: () => void;
}
export type GoodsDataManipulateFormData = Omit<KkshowShoppingSectionItem, 'data'> & {
  data: KkshowShoppingTabGoodsData[];
};
export function GoodsDataManipulateContainer(
  props: GoodsDataManipulateContainerProps,
): JSX.Element {
  const toast = useToast();
  const { item, onSuccess, buttonLabel } = props;
  const { data, title } = item;
  const typedData = parseJsonToGenericType<KkshowShoppingTabGoodsData[]>(data);
  const methods = useForm<GoodsDataManipulateFormData>({
    defaultValues: { ...item, data: typedData },
  });

  const { control, formState, reset, register } = methods;
  const saveButton = useMemo(() => {
    return (
      <Stack>
        <Button
          width="100%"
          type="submit"
          colorScheme={formState.isDirty ? 'red' : 'blue'}
        >
          저장
        </Button>
        {formState.isDirty && (
          <Text as="span" color="red">
            데이터 변경사항이 있습니다. 저장버튼을 눌러주세요!!!!
          </Text>
        )}
      </Stack>
    );
  }, [formState.isDirty]);

  const { mutateAsync } = useAdminUpdateKkshowShoppingSectionData();
  const onSubmit = async (formData: GoodsDataManipulateFormData): Promise<void> => {
    const { id, ...rest } = formData;
    mutateAsync({ id, dto: { ...rest, data: JSON.stringify(rest.data) } })
      .then((res) => {
        toast({ title: '데이터를 수정하였습니다', status: 'success' });
        if (onSuccess) onSuccess();
      })
      .catch((e) => {
        toast({ title: '오류발생으로 수정 실패', status: 'error' });
        console.error(e);
      });
  };

  const restoreData = useCallback(() => {
    if (!item) return;
    reset({
      ...item,
      data: parseJsonToGenericType<KkshowShoppingTabGoodsData[]>(data),
    });
  }, [data, item, reset]);

  useEffect(() => {
    if (!item) return;
    restoreData();
  }, [item, restoreData]);

  const { fields, append, remove, move } = useFieldArray({ control, name: 'data' });
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
  const buttons = [
    {
      label: buttonLabel || '추가',
      icon: <AddIcon />,
      onClick: () => append({}),
    },
  ];
  return (
    <FormProvider {...methods}>
      <Box as="form" onSubmit={methods.handleSubmit(onSubmit)}>
        <Stack minWidth="6xl" w="100%">
          <Text fontWeight="bold">{title}</Text>
          {saveButton}
          <Button onClick={restoreData}>저장하지 않은 수정사항 모두 되돌리기</Button>

          <Stack direction="row" alignItems="center">
            <Text>섹션명 : </Text>
            <Input {...register('title')} width="auto" />
          </Stack>

          <Stack>
            <ButtonGroup>
              {buttons.map((btn) => (
                <Button key={btn.label} leftIcon={btn.icon} onClick={() => btn.onClick()}>
                  {btn.label}
                </Button>
              ))}
            </ButtonGroup>

            {fields.map((field, index) => (
              <Stack key={field.id} w="100%" minH={150}>
                <PageManagerFieldItem
                  isMoveUpDisabled={index === 0}
                  isMoveDownDisabled={index === fields.length - 1}
                  moveUp={() => moveUp(index)}
                  moveDown={() => moveDown(index)}
                  removeHandler={() => remove(index)}
                >
                  <AdminKkshowShoppingGoods index={index} type="data" />
                </PageManagerFieldItem>
              </Stack>
            ))}
          </Stack>

          {saveButton}
        </Stack>
      </Box>
    </FormProvider>
  );
}
