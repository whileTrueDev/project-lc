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
import { useOneReview } from '@project-lc/hooks';
import dayjs from 'dayjs';
import NextLink from 'next/link';
import { GridRowData } from '@material-ui/data-grid';
import { MileageActionTypeBadge } from '@project-lc/components-shared/MileageActionTypeBadge';

type AdminMileageManageDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  mileageLogDetail: GridRowData | undefined;
};

export function AdminMileageLogDetailDialog(
  props: AdminMileageManageDialogProps,
): JSX.Element {
  const { isOpen, onClose, mileageLogDetail } = props;
  const { data: reviewData } = useOneReview(mileageLogDetail?.reviewId);

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
                <Text fontWeight="bold">{mileageLogDetail?.customer.email}</Text>
              </HStack>
              <HStack>
                <Text>유형</Text>
                <Text fontWeight="bold">
                  <MileageActionTypeBadge
                    actionType={mileageLogDetail?.actionType}
                    lineHeight={2}
                  />
                </Text>
              </HStack>
              <HStack>
                <Text>
                  {mileageLogDetail?.actionType === 'earn' ? '적립 : ' : '사용: '}
                </Text>
                <Text fontWeight="bold">{mileageLogDetail?.amount.toLocaleString()}</Text>
              </HStack>
              <HStack>
                <Text>생성일</Text>
                <Text fontWeight="bold">
                  {dayjs(mileageLogDetail?.createDate).format('YYYY-MM-DD HH:mm:ss')}
                </Text>
              </HStack>
              <HStack>
                <Text>연결된 주문</Text>
                <NextLink href={`/order/list/${mileageLogDetail?.orderId}`} passHref>
                  <Link>
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
