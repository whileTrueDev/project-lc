import React, { useState } from 'react';
import {
  Box,
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
  Text,
} from '@chakra-ui/react';
import { Step, StepLabel } from '@material-ui/core';
import { guideConditionStore } from '@project-lc/stores';
import { ChakraStepper } from './guide/ChakraStepper';
import { IntroSection } from './guide/IntroSection';

interface StartGuideStep {
  label: string;
  component: JSX.Element;
}
type StartGuideSteps = StartGuideStep[];

export function StartGuide({
  isOpen,
  onClose,
  steps,
}: Pick<ModalProps, 'isOpen' | 'onClose'> & {
  steps: StartGuideSteps;
}): JSX.Element {
  // 다음 단계 가능여부
  const { condition, setCondition } = guideConditionStore();

  const [introduction, setIntroduction] = useState<boolean>(true);
  const handleIntroSkip = (): void => {
    setIntroduction(false);
  };
  const handleIntroReset = (): void => {
    setIntroduction(true);
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
      size="2xl"
      scrollBehavior="inside"
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>크크쇼 시작가이드</ModalHeader>
        <ModalCloseButton />
        <ModalBody mx="5" position="relative" pt={0}>
          {/* 가이드 Stepper */}
          {introduction ? (
            <IntroSection />
          ) : (
            <>
              <Box position="sticky" top={0} bg="white" zIndex="docked">
                <ChakraStepper
                  activeStep={activeStep}
                  alternativeLabel
                  style={{ paddingLeft: 0, paddingRight: 0 }}
                >
                  {steps.map((step) => (
                    <Step key={step.label}>
                      <StepLabel>
                        <Text fontSize="sm">{step.label}</Text>
                      </StepLabel>
                    </Step>
                  ))}
                </ChakraStepper>
              </Box>

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
