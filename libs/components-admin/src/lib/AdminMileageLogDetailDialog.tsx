import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  Text,
  HStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Link,
  Flex,
} from '@chakra-ui/react';
import { adminMileageManageStore } from '@project-lc/stores';
import { useOneReview } from '@project-lc/hooks';
import dayjs from 'dayjs';
import NextLink from 'next/link';
import { MileageActionTypeBadge } from './MileageActionTypeBadge';

type AdminMileageManageDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AdminMileageLogDetailDialog(
  props: AdminMileageManageDialogProps,
): JSX.Element {
  const { isOpen, onClose } = props;
  const { mileageLog } = adminMileageManageStore();
  const { data: reviewData } = useOneReview(mileageLog?.reviewId);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent as="form">
          <ModalHeader>로그 상세</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" minH={300} justifyContent="space-around">
              <HStack>
                <Text>이메일 :</Text>
                <Text fontWeight="bold">{mileageLog?.customer.email}</Text>
              </HStack>
              <HStack>
                <Text>유형</Text>
                <Text fontWeight="bold">
                  <MileageActionTypeBadge
                    actionType={mileageLog?.actionType}
                    lineHeight={2}
                  />
                </Text>
              </HStack>
              <HStack>
                <Text>{mileageLog?.actionType === 'earn' ? '적립 : ' : '사용: '}</Text>
                <Text fontWeight="bold">{mileageLog?.amount}</Text>
              </HStack>
              <HStack>
                <Text>생성일</Text>
                <Text fontWeight="bold">
                  {dayjs(mileageLog?.createDate).format('YYYY-MM-DD HH:mm:ss')}
                </Text>
              </HStack>
              <HStack>
                <Text>연결된 주문</Text>
                {/** //todo : 개별 주문서 조회 기능 이후, 해당 주문서로 이동하도록 변경 */}
                <NextLink href="*" passHref>
                  <Link href="*">
                    <Text fontWeight="bold" color="blue">
                      연결된 주문서 보기
                    </Text>
                  </Link>
                </NextLink>
              </HStack>
              <Accordion allowMultiple>
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        연결된 리뷰 보기
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Text>{reviewData?.content || '연결된 리뷰가 없습니다'}</Text>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AdminMileageLogDetailDialog;
