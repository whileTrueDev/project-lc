import { ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Center, Container, Link, Spinner, Stack, Text } from '@chakra-ui/react';
import { Manual } from '@prisma/client';
import SettingSectionLayout from '@project-lc/components-layout/SettingSectionLayout';
import { useManualDetail, useManualMainCategories } from '@project-lc/hooks';
import NextLink from 'next/link';
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
  const { mainCategories } = useManualMainCategories(data.target);

  const mainCategoryName =
    mainCategories.find((cat) => cat.key === data.mainCategory)?.label || '';

  return (
    <Stack spacing={4}>
      <Stack direction="row" alignItems="center">
        {mainCategoryName && (
          <>
            <NextLink href="/mypage/manual" passHref>
              <Link color="blue.500" fontWeight="bold">
                {mainCategoryName}
              </Link>
            </NextLink>
            <ChevronRightIcon />
          </>
        )}
        <Text fontWeight="bold" size="sm">
          {data.title}
        </Text>
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
