import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Stack,
  Text,
  ListItem,
  UnorderedList,
  Box,
} from '@chakra-ui/react';
import { ChakraNextImage } from '..';

const SERVICE_NAME = '크크쇼';

/** 신분증 업로드 안내 */
export function IdCardImageUploadGuide(): JSX.Element {
  return (
    <Stack>
      <Text>
        {`대한민국 거주자의 경우 서비스 이용 관계 법령에 따라 본인 확인 및 ${SERVICE_NAME}로 발생하는
        소득에 대한 원천징수 및 원천징수 신고를 위해 신분증을 제출받습니다.`}
      </Text>
      <Box>
        <ChakraNextImage
          width="300"
          height="200"
          src="https://lc-project.s3.ap-northeast-2.amazonaws.com/public/idcard.png"
        />
      </Box>

      <Text>
        위의 샘플 이미지와 같이, 모든 정보가 명확히 보이도록 스캔 혹은 촬영하여 정산등록
        신청시 이미지 파일 업로드해주시면 됩니다.
      </Text>
      <UnorderedList pl={5}>
        <ListItem>주민등록증</ListItem>
        <ListItem>운전면허증</ListItem>
        <ListItem>여권(대한민국발행)</ListItem>
        <ListItem>
          주민등록증발급신청확인서 (유효기간 이내의 사진 및 주요 정보에 테이핑 처리 된
          것에 한함)
        </ListItem>
        <ListItem>청소년증, 청소년증 발급 확인서(청소년증 발급 신청서는 불가)</ListItem>
      </UnorderedList>
      <Text>
        위에 해당하는 신분증이더라도 이름 및 주민등록번호 13자리를 확인할 수 있어야 하며,
        해당 정보가 기재되어 있지 않거나 모자이크 처리 된 경우 신분증으로 인정되지
        않습니다.
      </Text>
      <Text color="red">이미지 크기는 5MB이하로 올려주시기 바랍니다.</Text>
    </Stack>
  );
}

/** 통장사본 업로드 안내 */
export function AccountImageUploadGuide(): JSX.Element {
  return (
    <Stack>
      <Text>
        {`${SERVICE_NAME}는 수익금을 소유하신 계좌로 지급해드립니다. 아래 두 가지 방법 중
        편한 방법으로 이미지를 업로드 해주시기 바랍니다.`}
      </Text>

      <Text>1. 실물 통장 사본</Text>
      <Box>
        <ChakraNextImage
          width="400"
          height="400"
          src="https://lc-project.s3.ap-northeast-2.amazonaws.com/public/real-account.png"
        />
      </Box>
      <Text>
        위와같이 계좌번호, 은행, 발급지점, 발급일등이 표시된 첫 번째 장을 카메라로
        촬영하거나 스캔한 뒤 이미지 파일로 업로드 해 주시면 됩니다.
      </Text>

      <Text>2. 인터넷 출력</Text>
      <Box>
        <ChakraNextImage
          width="400"
          height="400"
          src="https://lc-project.s3.ap-northeast-2.amazonaws.com/public/internet-account.png"
        />
      </Box>
      <Text>
        통장실물을 가지고 있지 않거나 온라인 전용계좌일 경우, 각 은행 인터넷 뱅킹 및 일부
        모바일 뱅킹 앱에서 제공하는 &apos;통장사본 출력&apos; 기능을 이용, 이미지 파일로
        업로드해주십시오.
      </Text>
      <Text>
        통장사본 출력의 경우 은행별로 조금씩 명칭이 상이하며, 계좌개설확인서 발급,
        통장앞면 인쇄, 통장표지출력, 통장 표제부출력 등의 메뉴를 확인하시면 됩니다.
      </Text>
      <Text color="red">
        인터넷뱅킹, 모바일 뱅킹 앱 등의 &apos;계좌목록&apos; 화면 캡쳐 이미지를 업로드
        하시는 경우 반려처리 되므로 업로드 전 확인 부탁드립니다.
      </Text>
      <Text color="red">이미지 크기는 5MB이하로 올려주시기 바랍니다.</Text>
    </Stack>
  );
}

export type ImageType = 'idCard' | 'account';

export interface BroadcasterImageUploadGuideDialogProps {
  type: ImageType;
  isOpen: boolean;
  onClose: () => void;
}

const TITLE: Record<ImageType, string> = {
  idCard: '신분증 업로드 안내',
  account: '통장사본 업로드 안내',
};

const BODY: Record<ImageType, JSX.Element> = {
  idCard: <IdCardImageUploadGuide />,
  account: <AccountImageUploadGuide />,
};
export function BroadcasterImageUploadGuideDialog({
  isOpen,
  onClose,
  type,
}: BroadcasterImageUploadGuideDialogProps): JSX.Element {
  const title = TITLE[type];
  const body = BODY[type];
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnEsc={false} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{body}</ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default BroadcasterImageUploadGuideDialog;
