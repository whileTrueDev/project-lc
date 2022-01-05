import { Checkbox, FormControl, FormErrorMessage, VStack } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import {
  PERSONAL_INFO_TERM,
  SETTLEMENT_INFO_SUBMIT_TERM,
} from '@project-lc/components-constants/broadcastetSettlementTerms';
import { SectionHeading, TermBox } from './BroadcasterSettlementInfoDialog';

// 서비스 이용 및 정산등록 동의폼 데이터타입
export type BroadcasterAgreements = {
  personalInfoAgreement: boolean;
  settlementAgreement: boolean;
};
export function BroadcasterSettlementInfoTerms(): JSX.Element {
  const {
    register,
    formState: { errors },
  } = useFormContext<BroadcasterAgreements>();
  return (
    <VStack alignItems="flex-start">
      <SectionHeading>서비스 이용 및 정산등록 동의</SectionHeading>
      <VStack spacing={2}>
        <FormControl isInvalid={!!errors.personalInfoAgreement}>
          <TermBox text={PERSONAL_INFO_TERM} />

          <Checkbox
            {...register('personalInfoAgreement', {
              required: '개인정보 수집 및 이용방침을 읽고 동의해주세요.',
            })}
          >
            정산 등록에 따른 개인정보 수집 및 이용방침을 읽고 이해하였으며, 이에
            동의합니다
          </Checkbox>
          <FormErrorMessage ml={3} mt={0}>
            {errors.personalInfoAgreement && errors.personalInfoAgreement.message}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.settlementAgreement}>
          <TermBox text={SETTLEMENT_INFO_SUBMIT_TERM} />

          <Checkbox
            {...register('settlementAgreement', {
              required: '정산 등록 신청서 제출에 대한 확인 문구를 읽고 동의해주세요.',
            })}
          >
            정산 등록 신청서 제출에 관련한 문구를 읽고 이해하였으며,이에 동의합니다.
          </Checkbox>
          <FormErrorMessage ml={3} mt={0}>
            {errors.settlementAgreement && errors.settlementAgreement.message}
          </FormErrorMessage>
        </FormControl>
      </VStack>
    </VStack>
  );
}

export default BroadcasterSettlementInfoTerms;
