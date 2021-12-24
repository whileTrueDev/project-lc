import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  Grid,
  Input,
  InputGroup,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { TAX_MANAGEMENT_TERM } from '../constants/broadcastetSettlementTerms';
import BroadcasterImageUploadGuideDialog from './BroadcasterImageUploadGuideDialog';
import { SectionHeading, TermBox } from './BroadcasterSettlementInfoDialog';
import { GridTableItem } from './GridTableItem';
import { ImageInput, ImageInputErrorTypes } from './ImageInput';

type PhoneNumber = {
  phone1: number;
  phone2: number;
  phone3: number;
};
type IdCardNumber = {
  idCardNumber1: number;
  idCardNumber2: number;
};
type IdCardImage = {
  idCardImageFile: File | null;
  idCardImageName: string | null;
};
// 계약자 정보 입력폼 데이터 타입
export type BroadcasterContractorData = {
  taxType: string;
  taxManageAgreement: boolean;
  name: string;
} & PhoneNumber &
  IdCardNumber &
  IdCardImage;

export function BroadcasterSettlementInfoContractor(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    register,
    formState: { errors },
    setValue,
    clearErrors,
    setError,
    watch,
  } = useFormContext<BroadcasterContractorData>();

  const handleSuccess = useCallback(
    (fileName: string, file: File): void => {
      setValue('idCardImageFile', file);
      setValue('idCardImageName', fileName);
      clearErrors(['idCardImageFile', 'idCardImageName']);
    },
    [clearErrors, setValue],
  );

  const handleError = useCallback(
    (errorType?: ImageInputErrorTypes): void => {
      switch (errorType) {
        case 'over-size': {
          setError('idCardImageFile', {
            type: 'validate',
            message: '10MB 이하의 이미지를 업로드해주세요.',
          });
          break;
        }
        case 'invalid-format': {
          setError('idCardImageFile', {
            type: 'error',
            message: '파일의 형식이 올바르지 않습니다.',
          });
          break;
        }
        default: {
          // only chrome
          setValue('idCardImageFile', null);
          setValue('idCardImageName', '');
          clearErrors(['idCardImageFile', 'idCardImageName']);
        }
      }
    },
    [clearErrors, setError, setValue],
  );
  return (
    <VStack alignItems="stretch">
      <SectionHeading>계약자 정보</SectionHeading>
      <Grid templateColumns="1fr 3fr" borderTopColor="gray.500" borderTopWidth={1.5}>
        <GridTableItem
          title="과세 유형"
          value={
            <RadioGroup
              onChange={(value) => {
                setValue('taxType', value);
              }}
              defaultValue="naturalPerson"
            >
              <Stack spacing={3} direction="row">
                <Radio {...register('taxType')} value="naturalPerson">
                  개인(사업소득)
                </Radio>
                <Radio {...register('taxType')} value="selfEmployedBusiness">
                  개인사업자
                </Radio>
              </Stack>
            </RadioGroup>
          }
        />
        {/* 개인사업자 (taxType === selfEmployedBusiness) 인 경우만 세무처리 관련 동의 받음 */}
        {watch('taxType') === 'selfEmployedBusiness' && (
          <GridTableItem
            title="세무처리 관련 설명"
            value={
              <FormControl isInvalid={!!errors.taxManageAgreement}>
                <TermBox text={TAX_MANAGEMENT_TERM} />

                <Checkbox
                  {...register('taxManageAgreement', {
                    required: '세무처리 관련 설명을 읽고 동의해주세요.',
                  })}
                >
                  세무처리와 관련된 설명을 읽고 이해하였으며, 이에 동의합니다
                </Checkbox>
                <FormErrorMessage ml={3} mt={0}>
                  {errors.taxManageAgreement && errors.taxManageAgreement.message}
                </FormErrorMessage>
              </FormControl>
            }
          />
        )}

        <GridTableItem
          title="성명"
          value={
            <FormControl isInvalid={!!errors.name}>
              <Input
                id="name"
                variant="flushed"
                placeholder="실명을 입력해주세요."
                autoComplete="off"
                maxW={200}
                {...register('name', {
                  required: '실명 입력이 필요합니다.',
                })}
              />
              <FormErrorMessage ml={3} mt={0}>
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>
          }
        />
        <GridTableItem
          title="휴대전화번호"
          value={
            <FormControl
              isInvalid={!!errors.phone1 || !!errors.phone2 || !!errors.phone3}
            >
              <InputGroup alignItems="center">
                <Input
                  type="number"
                  variant="flushed"
                  autoComplete="off"
                  maxW={45}
                  placeholder="010"
                  maxLength={3}
                  {...register('phone1', {
                    required: {
                      value: true,
                      message: '휴대전화를 올바르게 입력해주세요.',
                    },
                    minLength: 3,
                    maxLength: 4,
                  })}
                />
                <Text as="span" mx={1}>
                  -
                </Text>
                <Input
                  type="number"
                  variant="flushed"
                  autoComplete="off"
                  maxW={45}
                  maxLength={4}
                  placeholder="0000"
                  {...register('phone2', {
                    required: {
                      value: true,
                      message: '휴대전화를 올바르게 입력해주세요.',
                    },
                    minLength: 4,
                    maxLength: 4,
                  })}
                />
                <Text as="span" mx={1}>
                  -
                </Text>
                <Input
                  type="number"
                  variant="flushed"
                  autoComplete="off"
                  maxW={45}
                  maxLength={4}
                  placeholder="0000"
                  {...register('phone3', {
                    required: {
                      value: true,
                      message: '휴대전화를 올바르게 입력해주세요.',
                    },
                    minLength: 4,
                    maxLength: 4,
                  })}
                />
              </InputGroup>
              <FormErrorMessage>휴대전화를 올바르게 입력해주세요</FormErrorMessage>
            </FormControl>
          }
        />

        <GridTableItem
          title="주민등록번호"
          value={
            <FormControl isInvalid={!!errors.idCardNumber1 || !!errors.idCardNumber2}>
              <InputGroup alignItems="center">
                <Input
                  type="number"
                  variant="flushed"
                  autoComplete="off"
                  maxW={70}
                  placeholder="991231"
                  maxLength={6}
                  {...register('idCardNumber1', {
                    required: {
                      value: true,
                      message: '주민등록번호를 올바르게 입력해주세요.',
                    },
                    minLength: 6,
                    maxLength: 6,
                  })}
                />
                <Text as="span" mx={1}>
                  -
                </Text>
                <Input
                  type="number"
                  variant="flushed"
                  autoComplete="off"
                  maxW={70}
                  maxLength={4}
                  placeholder="1234567"
                  {...register('idCardNumber2', {
                    required: {
                      value: true,
                      message: '주민등록번호를 올바르게 입력해주세요.',
                    },
                    minLength: 7,
                    maxLength: 7,
                  })}
                />
              </InputGroup>
              <FormErrorMessage>주민등록번호를 올바르게 입력해주세요</FormErrorMessage>
            </FormControl>
          }
        />
        <GridTableItem
          title="신분증 업로드"
          value={
            <Flex alignItems="center">
              <FormControl isInvalid={!!errors.idCardImageFile} maxW="60%">
                <ImageInput
                  size="sm"
                  handleSuccess={handleSuccess}
                  handleError={handleError}
                />
                <FormErrorMessage ml={3} mt={0}>
                  {errors.idCardImageFile && errors.idCardImageFile.message}
                </FormErrorMessage>
              </FormControl>

              <Button size="xs" onClick={onOpen}>
                신분증 업로드 안내
              </Button>
            </Flex>
          }
        />
      </Grid>
      <BroadcasterImageUploadGuideDialog
        isOpen={isOpen}
        onClose={onClose}
        type="idCard"
      />
    </VStack>
  );
}

export default BroadcasterSettlementInfoContractor;
