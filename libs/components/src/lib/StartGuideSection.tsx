import {
  ModalProps,
  Modal,
  ModalOverlay,
  ModalCloseButton,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  ModalHeader,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Stepper, Step, StepLabel } from '@material-ui/core';
import { LiveShoppingMoniterSection } from './guide/LiveShoppingMoniterSection';
import { SettlementsSection } from './guide/SettlementsSection';
import { ContractionAgreementSection } from './guide/ContractionAgreementSection';
import { AddressSection } from './guide/AddressSection';
import { ChannelSection } from './guide/ChannelSection';
import { OverayUrlSection } from './guide/OverayUrlSection';
import { IntroSection } from './guide/IntroSection';

export function StartGuideSection({
  isOpen,
  onClose,
}: Pick<ModalProps, 'isOpen' | 'onClose'>): JSX.Element {
  // 다음 단계 가능여부
  const [condition, setCondition] = useState<boolean>(false);

  const [introduction, setIntroduction] = useState<boolean>(true);
  const handleIntroSkip = (): void => {
    setIntroduction(false);
  };
  const handleIntroReset = (): void => {
    setIntroduction(true);
  };

  const completeStep = (): void => {
    setCondition(true);
  };

  // 가이드 Stepper
  const [activeStep, setActiveStep] = useState(0);
  const handleNext = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setCondition(false);
  };
  const handleBack = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleStepReset = (): void => {
    setActiveStep(0);
  };

  // 각 단계 컴포넌트 목록
  const steps = [
    {
      label: '크크쇼 이용약관 동의하기',
      component: <ContractionAgreementSection completeStep={completeStep} />,
    },
    {
      label: '연락처 등록하기',
      component: <AddressSection completeStep={completeStep} />,
    },
    {
      label: '채널링크 등록하기',
      component: <ChannelSection completeStep={completeStep} />,
    },
    {
      label: '라이브 쇼핑 준비하기',
      component: <OverayUrlSection completeStep={completeStep} />,
    },
    {
      label: '라이브 쇼핑 화면',
      component: <LiveShoppingMoniterSection completeStep={completeStep} />,
    },
    {
      label: '수익금 출금하기',
      component: <SettlementsSection completeStep={completeStep} />,
    },
  ];

  function getStepComponent(step: number): React.ReactNode {
    return steps[step].component;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        handleIntroReset();
        handleStepReset();
      }}
      size="6xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>크크쇼 시작가이드</ModalHeader>
        <ModalCloseButton />
        <ModalBody mx="5">
          {/* 가이드 Stepper */}
          {introduction ? (
            <IntroSection completeStep={completeStep} />
          ) : (
            <>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((step) => (
                  <Step key={step.label}>
                    <StepLabel color="textPrimary">{step.label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              {/* 단계별 컴포넌트 */}
              {getStepComponent(activeStep)}
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            variant="contained"
            onClick={(): void => {
              if (activeStep === 0) {
                handleIntroReset();
                handleStepReset();
              } else handleBack();
            }}
          >
            이전
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={(): void => {
              if (introduction) {
                handleIntroSkip();
                return;
              }
              if (activeStep === steps.length - 1) {
                onClose();
                handleStepReset();
              } else {
                handleNext();
              }
            }}
            disabled={!condition}
          >
            다음
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
