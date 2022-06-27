import {
  Box,
  Collapse,
  ListItem,
  Text,
  UnorderedList,
  useDisclosure,
} from '@chakra-ui/react';
import { useDisplaySize } from '@project-lc/hooks';
import { useEffect, useMemo, useRef } from 'react';

export interface ReviewPolicyProps {
  defaultOpen?: boolean;
}
export function ReviewPolicy({ defaultOpen = false }: ReviewPolicyProps): JSX.Element {
  const { isMobileSize } = useDisplaySize();
  const policyList = useDisclosure();

  const firstRender = useRef(true);
  const defaultIsOpen = useMemo(
    () => (isMobileSize ? false : defaultOpen),
    [defaultOpen, isMobileSize],
  );
  useEffect(() => {
    if (firstRender.current && defaultIsOpen) {
      policyList.onOpen();
      firstRender.current = false;
    }
  }, [defaultIsOpen, policyList]);

  return (
    <Box>
      <Text
        as="span"
        textDecor="underline"
        fontSize="sm"
        cursor="pointer"
        role="button"
        onClick={policyList.onToggle}
      >
        상품 후기 원칙 {policyList.isOpen ? '숨기기' : '보기'}
      </Text>
      <Collapse in={policyList.isOpen}>
        <UnorderedList fontSize="xs" my={2}>
          <ListItem>
            작성된 글과 첨부된 멀티미디어 파일 등으로 이루어진 각 상품 후기는 개인의
            의견을 반영하므로 게시된 내용에 대한 모든 책임은 작성자에게 있습니다.
          </ListItem>
          <ListItem>
            상품평은 상품의 사용 관련 후기인바, 배송 주문취소 재배송 등에 관한 문의 사항을
            고객센터로 제기하기를 바랍니다.
          </ListItem>
          <ListItem whiteSpace="break-spaces">
            다음과 같은 내용은 상품 후기에 허용되지 않는 부류인바, 상품평 작성 시
            주의하시기 바랍니다.
            <UnorderedList>
              <ListItem>
                주관적인 의견으로 인해 상품의 기능 및 효과에 대하여 오해의 소지가 있는
                내용
              </ListItem>
              <ListItem>
                식품/건강식품과 관련하여 질병의 예방 및 치료, 체중감량에 효능/효과가
                있다는 내용
              </ListItem>
              <ListItem>
                비방, 욕설, 도배 등의 게시물 또는 반복되는 동일 단어나 문장
              </ListItem>
              <ListItem>
                타인 또는 기타 기관이 작성, 공개한 정보를 복사하여 기재한 부분
              </ListItem>
              <ListItem>상업적 목적의 광고성 내용</ListItem>
              <ListItem>
                그 밖에 상품 후기 운영원칙에 위배되거나 그러하다고 사료되는 내용
              </ListItem>
            </UnorderedList>
            {/* {`\n- 주관적인 의견으로 인해 상품의 기능 및 효과에 대하여 오해의 소지가 있는 내용\n- 식품/건강식품과 관련하여 질병의 예방 및 치료, 체중감량에 효능/효과가 있다는 내용\n- 비방, 욕설, 도배 등의 게시물 또는 방복되는 동일 단어나 문장\n- 타인 또는 기타 기관이 작성, 공개한 정보를 복사하여 기재한 부분\n- 상업적 목적의 광고성 내용\n- 그 밖에 상품후기 운영원칙에 위배되거나 그러하다고 사료되는 내용`} */}
          </ListItem>
          <ListItem>
            해당 상품 자체와 관계없는 글, 양도, 광고성, 욕설, 비방, 도배 등의 글은 예고
            없이 이동, 노출 제한, 삭제 등의 조치가 취해질 수 있습니다.
          </ListItem>
          <ListItem>
            상품 후기로 인해 다른 회원 또는 제삼자에게 손해가 끼쳐질 경우, 법적인 책임이
            따를 수 있으며, 이에 대한 책임은 상품 후기를 게시한 당사자에게 있습니다.
          </ListItem>
          <ListItem>
            개인정보 보호와 관련된 피해를 방지하기 위해 주민등록번호, 전화번호, 이메일,
            연락처 등의 내용 기재는 삼가시기를 바랍니다. 해당 내용이 발견되는 경우, 제삼자
            노출을 방지하기 위해 관리자에 의해 삭제 처리될 수 있습니다.
          </ListItem>
          <ListItem>
            이 외 상품 후기의 성격에 맞지 않는 내용은 관리자에 의해 삭제 처리될 수
            있습니다.
          </ListItem>
        </UnorderedList>
      </Collapse>
    </Box>
  );
}
