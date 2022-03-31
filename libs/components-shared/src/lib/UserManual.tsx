import {
  Box,
  Button,
  Center,
  Container,
  Heading,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Manual } from '@prisma/client';
import SettingSectionLayout from '@project-lc/components-layout/SettingSectionLayout';
import { useManualDetail, useManualMainCategories } from '@project-lc/hooks';
import { useRouter } from 'next/router';
import React from 'react';
import 'suneditor/dist/css/suneditor.min.css';

export interface UserManualProps {
  id: number;
}
export function UserManual({ id }: UserManualProps): JSX.Element {
  const { data, isLoading, isError } = useManualDetail(id);
  if (isLoading) {
    return (
      <Container maxW="container.xl">
        <Center>
          <Spinner />
        </Center>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container maxW="container.xl">
        <Text>오류가 발생하였습니다</Text>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container maxW="container.xl">
        <Text>데이터가 없습니다</Text>
      </Container>
    );
  }
  return (
    <Container maxW="container.xl">
      <SettingSectionLayout title="이용안내">
        <UserManualDisplay data={data} />
      </SettingSectionLayout>
    </Container>
  );
}

export default UserManual;

function UserManualDisplay({ data }: { data: Manual }): JSX.Element {
  const router = useRouter();
  const { mainCategories } = useManualMainCategories(data.target);

  const mainCategoryName =
    mainCategories.find((cat) => cat.key === data.mainCategory)?.label || '';

  return (
    <Stack spacing={4}>
      <Stack px={4} direction="row" alignItems="center">
        {mainCategoryName && (
          <Box>
            <Button
              size="md"
              variant="link"
              onClick={() => router.push('/mypage/manual')}
            >{`${mainCategoryName} >`}</Button>
          </Box>
        )}
        <Heading size="sm">{data.title}</Heading>
      </Stack>

      {data.description.trim() && <Text>{data.description}</Text>}

      <Box
        width="100%"
        rounded="md"
        className="sun-editor-editable"
        minH="100px"
        overflowY="auto"
        dangerouslySetInnerHTML={{ __html: data.contents }}
        style={{
          fontSize: '1rem',
          fontFamily: 'Noto Sans KR, sans-serif',
        }}
      />
    </Stack>
  );
}
