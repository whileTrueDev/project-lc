import {
  FormControl,
  FormErrorMessage,
  GridItem,
  Input,
  useColorModeValue,
} from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { BusinessRegistrationFormDto } from './BusinessRegistrationDialog';
import { useDialogHeaderConfig, useDialogValueConfig } from './GridTableItem';
import { ImageInput, ImageInputErrorTypes } from './ImageInput';

export function BusinessRegistrationMailOrderNumerSection(): JSX.Element {
  const {
    register,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
  } = useFormContext<BusinessRegistrationFormDto>();

  function handleSuccess(fileName: string, file: File): void {
    setValue('mailOrderSalesImage', file);
    setValue('mailOrderSalesImageName', fileName);
    clearErrors(['mailOrderSalesImage', 'mailOrderSalesImageName']);
  }

  function handleError(errorType?: ImageInputErrorTypes): void {
    switch (errorType) {
      case 'over-size': {
        setError('mailOrderSalesImage', {
          type: 'validate',
          message: '10MB 이하의 이미지를 업로드해주세요.',
        });
        break;
      }
      case 'invalid-format': {
        setError('mailOrderSalesImage', {
          type: 'error',
          message: '파일의 형식이 올바르지 않습니다.',
        });
        break;
      }
      default: {
        // only chrome
        setValue('mailOrderSalesImage', null);
        setValue('mailOrderSalesImageName', '');
        clearErrors(['mailOrderSalesImage', 'mailOrderSalesImageName']);
      }
    }
  }

  return (
    <>
      <GridItem {...useDialogHeaderConfig(useColorModeValue)}>
        통신판매업 신고번호*
      </GridItem>
      <GridItem {...useDialogValueConfig(useColorModeValue)}>
        <FormControl isInvalid={!!errors.mailOrderSalesNumber}>
          <Input
            id="mailOrderSalesNumber"
            m={[1, 3, 3, 3]}
            variant="flushed"
            maxW={['inherit', 300, 300, 300]}
            autoComplete="off"
            placeholder="통신판매업 신고번호를 입력해주세요('-' 포함)"
            {...register('mailOrderSalesNumber', {
              required: '통신판매업신고증의 좌측상단 신고번호를 입력해주세요.',
              minLength: {
                value: 10,
                message: '통신판매업 신고번호는 10글자 이상이어야 합니다.',
              },
            })}
          />
          <FormErrorMessage ml={3} mt={0}>
            {errors.mailOrderSalesNumber && errors.mailOrderSalesNumber.message}
          </FormErrorMessage>
        </FormControl>
      </GridItem>
      <GridItem {...useDialogHeaderConfig(useColorModeValue)}>
        통신판매업신고증 이미지 업로드
      </GridItem>
      <GridItem {...useDialogValueConfig(useColorModeValue)}>
        <FormControl isInvalid={!!errors.mailOrderSalesImage}>
          <ImageInput
            handleSuccess={handleSuccess}
            handleError={handleError}
            required={false}
          />
          <FormErrorMessage ml={3} mt={0}>
            {errors.mailOrderSalesImage && errors.mailOrderSalesImage.message}
          </FormErrorMessage>
        </FormControl>
      </GridItem>
    </>
  );
}
