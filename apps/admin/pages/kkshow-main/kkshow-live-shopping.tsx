import { DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { LiveShoppingEmbed, StreamingService } from '@prisma/client';
import AdminPageLayout from '@project-lc/components-admin/AdminPageLayout';
import { ChakraAutoComplete } from '@project-lc/components-core/ChakraAutoComplete';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import {
  useAdminLiveEmbedDeleteMutation,
  useAdminLiveEmbedMutation,
  useAdminLiveShoppingList,
  useLiveEmbedList,
} from '@project-lc/hooks';
import {
  CreateKkshowLiveEmbedDto,
  LiveShoppingWithGoods,
} from '@project-lc/shared-types';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

export function KkshowLiveShopping(): JSX.Element {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <AdminPageLayout>
      <Box my={2}>
        <Button onClick={onOpen}>라이브 임베드 등록하기</Button>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>라이브임베드 등록</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <KkshowLiveEmbedForm onSuccess={onClose} onFail={onClose} />
            </ModalBody>
            <ModalFooter>
              <ButtonGroup>
                <Button form="kkshow-live-embed-form" type="submit" colorScheme="blue">
                  등록
                </Button>
                <Button onClick={onClose}>닫기</Button>
              </ButtonGroup>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>

      <Box>
        <Text fontWeight="bold" fontSize="xl">
          현재 등록된 라이브 임베드
        </Text>

        <Text color="GrayText">
          가장 최근에 등록된 (번호가 가장 높은) 라이브를 기준으로 크크쇼 라이브 페이지가
          구성됩니다.
        </Text>

        <KkshowLiveEmbedList />
      </Box>
    </AdminPageLayout>
  );
}

export default KkshowLiveShopping;

function KkshowLiveEmbedList(): JSX.Element | null {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data, isLoading } = useLiveEmbedList();
  const { mutateAsync: deleteLiveEmbed } = useAdminLiveEmbedDeleteMutation();

  const [selected, setSelected] = useState<LiveShoppingEmbed | null>(null);
  const onSelect = (_selected: LiveShoppingEmbed): void => {
    setSelected(_selected);
  };

  const onDelete = async (id: number): Promise<void> => {
    return deleteLiveEmbed(id)
      .then(() => {
        toast({ title: '성공적으로 삭제하였습니다', status: 'success' });
      })
      .catch((err) => {
        toast({
          title: '삭제에 실패하였습니다',
          description: err?.response?.data?.message,
          status: 'error',
        });
      });
  };

  if (isLoading) return <Spinner />;
  if (!data) return null;
  return (
    <Box>
      {data?.map((liveEmbed, idx) => (
        <Stack direction="row" key={liveEmbed.id}>
          <Text
            textDecoration={idx === data.length - 1 ? 'underline' : 'none'}
            textDecorationColor={idx === data.length - 1 ? 'red' : 'none'}
          >
            {liveEmbed.liveShoppingId}. {liveEmbed.streamingService} {liveEmbed.UID}
          </Text>
          <IconButton
            aria-label="remove-live-embed-btn"
            size="xs"
            onClick={() => {
              onSelect(liveEmbed);
              onOpen();
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      ))}

      {selected && (
        <ConfirmDialog
          title="삭제하시겠습니까?"
          isOpen={isOpen}
          onClose={onClose}
          onConfirm={() => onDelete(selected.id)}
        >
          {selected.liveShoppingId}. {selected.streamingService} {selected.UID}{' '}
          삭제합니까?
        </ConfirmDialog>
      )}
    </Box>
  );
}

interface KkshowLiveEmbedFormData extends CreateKkshowLiveEmbedDto {
  UID_2: string;
}
interface KkshowLiveEmbedFormProps {
  onSuccess?: () => void;
  onFail?: () => void;
}
function KkshowLiveEmbedForm({
  onSuccess,
  onFail,
}: KkshowLiveEmbedFormProps): JSX.Element {
  const toast = useToast();
  const { data: liveShoppings } = useAdminLiveShoppingList({});

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<KkshowLiveEmbedFormData>({
    defaultValues: { streamingService: 'twitch' },
  });

  const { mutateAsync: createLiveEmbed } = useAdminLiveEmbedMutation();
  const onSubmit: SubmitHandler<KkshowLiveEmbedFormData> = async (data) => {
    if (!data.liveShoppingId) {
      setError('liveShoppingId', {
        message: '라이브쇼핑을 선택해주세요.',
        type: 'required',
      });
      toast({ title: '라이브쇼핑을 선택해주세요', status: 'error' });
      return null;
    }
    return createLiveEmbed({
      liveShoppingId: data.liveShoppingId,
      streamingService: data.streamingService,
      UID: !data.UID_2 ? data.UID : `${data.UID}/${data.UID_2}`,
    })
      .then((res) => {
        console.log(res);
        toast({ title: '라이브임베드 등록 성공', status: 'success' });
        if (onSuccess) onSuccess();
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: '라이브임베드 등록 실패',
          description: err.response?.data?.message,
          status: 'error',
        });
        if (onFail) onFail();
      });
  };

  const getOptionLabel = (opt: LiveShoppingWithGoods): string => {
    if (!opt.liveShoppingName) return `${opt.id}`;
    if (!opt.broadcaster) return opt.liveShoppingName;
    if (!opt.seller) return `${opt.liveShoppingName} (${opt.broadcaster.userNickname})`;
    return `${opt.liveShoppingName} (${opt.broadcaster.userNickname}+${opt.seller.sellerShop.shopName})`;
  };
  const handleLiveShoppingChange = (v: LiveShoppingWithGoods): void => {
    if (v) {
      setValue('liveShoppingId', v.id);
      clearErrors('liveShoppingId');
    } else {
      setValue('liveShoppingId', null);
    }
  };
  return (
    <Stack as="form" id="kkshow-live-embed-form" onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={!!errors.liveShoppingId}>
        <FormLabel>*라이브쇼핑</FormLabel>
        <ChakraAutoComplete<LiveShoppingWithGoods>
          width="100%"
          getOptionLabel={getOptionLabel}
          options={liveShoppings || []}
          onChange={handleLiveShoppingChange}
        />
        <FormErrorMessage>{errors.liveShoppingId?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.streamingService}>
        <Flex direction="column">
          <FormLabel>*방송플랫폼</FormLabel>
          <Controller
            name="streamingService"
            control={control}
            render={({ field }) => (
              <RadioGroup defaultValue="twitch" {...field}>
                <Stack direction="row">
                  {Object.keys(StreamingService).map((streamingService) => (
                    <Radio key={streamingService} value={streamingService}>
                      {streamingService}
                    </Radio>
                  ))}
                </Stack>
              </RadioGroup>
            )}
            rules={{ required: '방송플랫폼을 선택해주세요' }}
          />
        </Flex>
        <FormErrorMessage>{errors.streamingService?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.UID}>
        <FormLabel>*방송인 아이디</FormLabel>
        <Input
          placeholder="(트위치아이디) chodan_"
          {...register('UID', {
            required: '방송인 아이디를 입력해주세요.',
          })}
        />
        <FormErrorMessage>{errors.UID?.message}</FormErrorMessage>
      </FormControl>

      {watch('streamingService') === 'afreeca' ? (
        <FormControl isInvalid={!!errors.UID_2}>
          <FormLabel>스트리밍 아이디 (afreeca only)</FormLabel>
          <Input
            placeholder="방송 고유 ID"
            {...register('UID_2', {
              validate: (v) => {
                if (watch('streamingService') === 'afreeca')
                  return !!v || '방송 고유 ID를 입력해주세요.';
                return true;
              },
            })}
          />
          <FormErrorMessage>{errors.UID_2?.message}</FormErrorMessage>
        </FormControl>
      ) : null}
    </Stack>
  );
}
