import {
  Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from '@chakra-ui/react';
import { Step, StepLabel } from '@material-ui/core';
import { useState } from 'react';
import { ShopNameSection } from '@project-lc/components-seller/ShopNameSection';
import { AddressSection } from './guide/AddressSection';
import { ChakraStepper } from './guide/ChakraStepper';
import { ChannelSection } from './guide/ChannelSection';
import { ContractionAgreementSection } from './guide/ContractionAgreementSection';
import { IntroSection } from './guide/IntroSection';
import { LiveShoppingMonitorSection } from './guide/LiveShoppingMonitorSection';
import { OverayUrlSection } from './guide/OverayUrlSection';
import { SettlementsSection } from './guide/SettlementsSection';

export function StartGuideSection({
  isOpen,
  onClose,
  userType,
}: Pick<ModalProps, 'isOpen' | 'onClose'> & {
  userType: 'seller' | 'broadcaster';
}): JSX.Element {
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
  const steps =
    userType === 'seller'
      ? [
          {
            label: '크크쇼 이용약관 동의하기',
            component: (
              <ContractionAgreementSection
                completeStep={completeStep}
                userType={userType}
              />
            ),
          },
          {
            label: '상점명 등록하기',
            component: <ShopNameSection completeStep={completeStep} />,
          },
        ]
      : [
          {
            label: '크크쇼 이용약관 동의하기',
            component: (
              <ContractionAgreementSection
                completeStep={completeStep}
                userType={userType}
              />
            ),
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
            component: <LiveShoppingMonitorSection completeStep={completeStep} />,
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
              <ChakraStepper activeStep={activeStep} alternativeLabel>
                {steps.map((step) => (
                  <Step key={step.label}>
                    <StepLabel>{step.label}</StepLabel>
                  </Step>
                ))}
              </ChakraStepper>
              {/* 단계별 컴포넌트 */}
              {getStepComponent(activeStep)}
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button
              onClick={(): void => {
                if (introduction) onClose();
                if (activeStep === 0) {
                  handleIntroReset();
                  handleStepReset();
                } else handleBack();
              }}
            >
              {introduction ? '닫기' : '이전'}
            </Button>
            <Button
              colorScheme="blue"
              onClick={(): void => {
                if (introduction) {
                  handleIntroSkip();
                  setCondition(false);
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
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
