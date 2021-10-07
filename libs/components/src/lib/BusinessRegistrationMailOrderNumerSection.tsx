import {
  GridItem,
  FormControl,
  FormErrorMessage,
  useColorModeValue,
  Input,
} from '@chakra-ui/react';
import { useDialogHeaderConfig, useDialogValueConfig } from './GridTableItem';
import { ImageInput, ImageInputErrorTypes } from './ImageInput';
import { BusinessRegistrationFormProps } from './BusinessRegistrationForm';

export function BusinessRegistrationMailOrderNumerSection(
  props: Omit<BusinessRegistrationFormProps, 'inputRef'>,
): JSX.Element {
  const { register, errors, setvalue, seterror, clearErrors } = props;

  function handleSuccess(fileName: string, file: File): void {
    setvalue('mailOrderSalesImage', file);
    setvalue('mailOrderSalesImageName', fileName);
    clearErrors(['mailOrderSalesImage', 'mailOrderSalesImageName']);
  }

  function handleError(errorType?: ImageInputErrorTypes): void {
    switch (errorType) {
      case 'over-size': {
        seterror('mailOrderSalesImage', {
          type: 'validate',
          message: '10MB 이하의 이미지를 업로드해주세요.',
        });
        break;
      }
      case 'invalid-format': {
        seterror('mailOrderSalesImage', {
          type: 'error',
          message: '파일의 형식이 올바르지 않습니다.',
        });
        break;
      }
      default: {
        // only chrome
        setvalue('mailOrderSalesImage', null);
        setvalue('mailOrderSalesImageName', null);
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
          <ImageInput handleSuccess={handleSuccess} handleError={handleError} />
          <FormErrorMessage ml={3} mt={0}>
            {errors.mailOrderSalesImage && errors.mailOrderSalesImage.message}
          </FormErrorMessage>
        </FormControl>
      </GridItem>
    </>
  );
}
