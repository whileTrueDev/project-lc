import {
  Box,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  ListItem,
  Select,
  Spinner,
  Stack,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import SectionWithTitle from '@project-lc/components-layout/SectionWithTitle';
import {
  useGoodsInformationSubject,
  useGoodsInformationSubjectById,
} from '@project-lc/hooks';
import { goodsRegistStore } from '@project-lc/stores';
import { useEffect, useMemo, useState } from 'react';

export function GoodsRegistInformationNotice(): JSX.Element | null {
  // 선택된 상품필수정보 품목
  const [informationSubjectId, setInformationSubjectId] = useState<null | number>(null);

  // 상품필수정보 품목 목록 조회
  const { data: subjectList, isLoading: subjectListLoading } =
    useGoodsInformationSubject();
  // 선택된 품목에 따른 항목정보 조회
  const { data, isLoading: informationSubjectLoading } =
    useGoodsInformationSubjectById(informationSubjectId);

  const { initializeNotice, informationNotice, handleChange } = goodsRegistStore();

  // 기본 품목 = '가공식품'
  const defaultSubject = useMemo(
    () => subjectList?.find((subject) => subject.subject === '가공식품'),
    [subjectList],
  );

  // 맨처음 품목 선택 안된 경우 가공식품을 기본항목으로 선택함
  useEffect(() => {
    if (!informationSubjectId && !data && defaultSubject) {
      setInformationSubjectId(defaultSubject.id);
    }
  }, [defaultSubject, informationSubjectId, data]);

  useEffect(() => {
    if (data) initializeNotice(data.items);
  }, [data, initializeNotice]);

  if (subjectListLoading) {
    return (
      <SectionWithTitle title="상품정보제공고시" variant="outlined">
        <Spinner />
      </SectionWithTitle>
    );
  }
  if (!subjectList) {
    return (
      <SectionWithTitle title="상품정보제공고시" variant="outlined">
        <Box>상품정보제공고시 품목을 불러올 수 없습니다</Box>
      </SectionWithTitle>
    );
  }

  return (
    <SectionWithTitle title="상품정보제공고시" variant="outlined">
      <Box>
        <FormControl>
          <FormLabel>카테고리 품목</FormLabel>
          <Select
            placeholder="상품정보제공고시 품목을 선택해주세요"
            value={informationSubjectId || undefined}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
              const { value } = event.target;
              setInformationSubjectId(Number(value));
            }}
          >
            {subjectList &&
              subjectList.map((subject) => (
                <option
                  key={subject.id}
                  value={subject.id}
                  selected={subject.id === informationSubjectId}
                >
                  {subject.subject}
                </option>
              ))}
          </Select>
        </FormControl>
      </Box>

      <Box mb={2}>
        <Text fontSize="xl" fontWeight="bold">
          품목별 필수 정보
          {data && (
            <Text as="span" fontSize="sm">
              {` (${data.subject})`}
            </Text>
          )}
        </Text>

        <UnorderedList fontSize="xs" color="GrayText">
          <ListItem>
            항목을 비워두는 경우 상세설명 및 상세이미지 참조로 작성됩니다.
          </ListItem>
        </UnorderedList>
      </Box>

      {/* 선택된 품목에 따른 필수정보항목 */}
      <Stack>
        {informationSubjectLoading && <Spinner />}
        {informationNotice &&
          data &&
          Object.keys(data.items as object).map((key) => (
            <FormControl key={key}>
              <Grid templateColumns="repeat(4, 1fr)" gap={2} mb={2}>
                <GridItem colSpan={[4, 4, 1]}>
                  <FormLabel fontSize="sm" fontWeight="normal">
                    {key}
                  </FormLabel>
                </GridItem>
                <GridItem colSpan={[4, 4, 3]}>
                  <Input
                    size="sm"
                    placeholder="상세설명 및 상세이미지 참조"
                    value={
                      key === '소비자상담 관련 전화번호'
                        ? data.items[key]
                        : informationNotice[key]
                    }
                    isReadOnly={key === '소비자상담 관련 전화번호'}
                    onChange={(e) => handleChange(key, e.target.value)}
                  />
                </GridItem>
              </Grid>
            </FormControl>
          ))}
      </Stack>
    </SectionWithTitle>
  );
}
