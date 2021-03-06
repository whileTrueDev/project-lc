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
import { ChakraAutoComplete } from '@project-lc/components-core/ChakraAutoComplete';
import ImageInputDialog, {
  ImageInputFileReadData,
} from '@project-lc/components-core/ImageInputDialog';
import { useAllGoodsIds, useGoodsById } from '@project-lc/hooks';
import { KkshowShoppingTabResData } from '@project-lc/shared-types';
import { s3 } from '@project-lc/utils-s3';
import path from 'path';
import { memo, useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';

export interface AdminKkshowShoppingGoodsProps {
  index: number;
  type: Exclude<
    keyof KkshowShoppingTabResData,
    'carousel' | 'reviews' | 'keywords' | 'banner'
  >;
}

export function AdminKkshowShoppingGoods({
  index,
  type,
}: AdminKkshowShoppingGoodsProps): JSX.Element {
  const imageUploadDialog = useDisclosure();
  const findGoodsDialog = useDisclosure();
  const { register, watch, setValue } = useFormContext<KkshowShoppingTabResData>();

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
      <Button onClick={findGoodsDialog.onOpen}>???????????? ????????????</Button>
      <AdminKkshowShoppingGoodsFindDialog
        index={index}
        type={type}
        isOpen={findGoodsDialog.isOpen}
        onClose={findGoodsDialog.onClose}
      />
      <Flex gap={3} mt={3}>
        <Box textAlign="center">
          <FieldHeader header="??????" />
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
          <FieldHeader header="?????????" />
          <Image maxW={150} src={watch(`${type}.${index}.imageUrl`)} rounded="2xl" />
        </Stack>
        <Stack minW={300}>
          <Box>
            <FieldHeader header="????????? ??????" isRequired />
            <Text fontSize="xs" color="GrayText">
              ????????? ????????? ??????????????? ????????? ???????????? ???????????? ??? ????????????.
            </Text>
          </Box>
          <Input
            minW={200}
            {...register(`${type}.${index}.imageUrl`, { required: true })}
            isRequired
          />
          <Button leftIcon={<AddIcon />} onClick={imageUploadDialog.onOpen}>
            ????????? ?????????
          </Button>
        </Stack>
        <Stack minW={300}>
          <Box>
            <FieldHeader header="??????????????????" isRequired />

            <Text fontSize="xs" color="GrayText">
              ????????? ????????? ????????? ?????? ????????? ???????????????.
            </Text>
          </Box>
          <Input
            {...register(`${type}.${index}.linkUrl`, { required: true })}
            isRequired
          />
        </Stack>
        <Stack minW={300}>
          <Box>
            <FieldHeader header="????????????" isRequired />
            <Text fontSize="xs" color="GrayText">
              ????????? ????????? ????????? ??????????????????. ???????????? ?????? ???????????????.
            </Text>
          </Box>
          <FormControl as={Flex} align="center" isRequired>
            <FormLabel minW={42} m={0} htmlFor="??????" fontSize="xs">
              ??????
            </FormLabel>
            <Input {...register(`${type}.${index}.name`, { required: true })} />
          </FormControl>
          <FormControl as={Flex} align="center" isRequired>
            <FormLabel minW={42} m={0} htmlFor="??????" fontSize="xs">
              ??????
            </FormLabel>
            <Input
              {...register(`${type}.${index}.normalPrice`, { required: true })}
              type="number"
            />
          </FormControl>
          <FormControl as={Flex} align="center">
            <FormLabel minW={42} m={0} htmlFor="?????????" fontSize="xs">
              ?????????
            </FormLabel>
            <Input
              {...register(`${type}.${index}.discountedPrice`)}
              type="number"
              placeholder="???????????? ?????? ?????? ???????????????"
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
  // ?????? auto complete
  const goodsIdList = useAllGoodsIds();
  // ????????? ??????GoodsId
  const [selectedGoodsId, setSelectedGoodsId] = useState<number | null>(null);

  // ????????? ?????? ????????? ??????
  const selectedGoodsData = useGoodsById(selectedGoodsId);
  // ????????? ?????? ?????????
  const [selectedImage, setSelectedImage] = useState('');
  // ?????? ????????? ??????????????? ?????????
  useEffect(() => {
    setSelectedImage('');
  }, [selectedGoodsId]);

  // ?????? ?????? ??????
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

  const { setValue } = useFormContext<KkshowShoppingTabResData>();
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
        description: '????????? ???????????? ???????????? ?????? ???????????? ????????? ??????????????????.',
        status: 'error',
      });
    }
  };

  const handleClose = (): void => {
    onClose();
    // ????????? ?????? ??? ?????????
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
        <ModalHeader>???????????? ????????????</ModalHeader>
        <ModalCloseButton />
        <ModalBody minH={300}>
          <Stack>
            <Text>?????? ????????????</Text>
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
                      ?????????{' '}
                      <Text fontSize="xx-small" as="span">
                        (???????????? ????????? ??????)
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
                    <Text>????????? ??????</Text>
                  </GridItem>
                  <GridItem colSpan={3}>
                    <Text>{selectedData?.imageUrl || '??? ???'}</Text>
                  </GridItem>

                  <GridItem>
                    <Text>??????????????????</Text>
                  </GridItem>
                  <GridItem colSpan={3}>
                    <Text>
                      {selectedData?.linkUrl
                        ? `/goods/${selectedData?.linkUrl}`
                        : '??? ???'}
                    </Text>
                  </GridItem>

                  <GridItem>
                    <Text>???????????? - ??????</Text>
                  </GridItem>
                  <GridItem colSpan={3}>
                    <Text>??????: {selectedData?.goodsName || '??? ???'}</Text>
                  </GridItem>

                  <GridItem>
                    <Text>
                      ???????????? - ??????{' '}
                      <Text as="span" fontSize="xx-small">
                        (????????????)
                      </Text>
                    </Text>
                  </GridItem>
                  <GridItem colSpan={3}>
                    <Text>{selectedData?.normalPrice || '??? ???'}</Text>
                  </GridItem>

                  <GridItem>
                    <Text>
                      ???????????? - ?????????{' '}
                      <Text as="span" fontSize="xx-small">
                        (????????????)
                      </Text>
                    </Text>
                  </GridItem>
                  <GridItem colSpan={3}>
                    <Text>{selectedData?.discountedPrice || '??? ???'}</Text>
                  </GridItem>
                </Grid>
              )}
            </Box>
          </Stack>

          {selectedGoodsId && selectedData && !selectedData.imageUrl && (
            <Alert status="info" my={4}>
              <AlertIcon />
              <Box>
                <AlertTitle>???????????? ???????????? ???????????????.</AlertTitle>
                <AlertDescription>
                  ?????? ???????????? ???????????? ???????????? ??????????????????. ?????? ???????????? ????????? ??????
                  ?????? ??????????????? ???????????? ?????? ??????????????? ????????? ??? ???????????? ??????????????????
                  ???????????? ????????? ????????? ??????????????????.
                </AlertDescription>
              </Box>
            </Alert>
          )}
        </ModalBody>

        <ModalFooter>
          <ButtonGroup>
            <Button onClick={handleClose}>??????</Button>
            <Button onClick={onSelect} colorScheme="blue" isDisabled={!selectedGoodsId}>
              ??????
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
