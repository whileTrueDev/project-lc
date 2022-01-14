import { Box, Stack, Text } from '@chakra-ui/react';
import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';
import { motion } from 'framer-motion';
import { useState } from 'react';

export function Index(): JSX.Element {
  const [on, setOn] = useState<boolean>(false);
  return (
    <AdminPageLayout>
      <Stack justifyContent="center" alignItems="center">
        <Text>크크쇼 관리자 페이지에 오신것을 환영합니다</Text>
        <Box position="relative">
          <motion.p
            style={{ fontSize: '10rem', cursor: 'pointer' }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            onClick={() => {
              setOn(true);
            }}
          >
            🎁
          </motion.p>
          {on && (
            <motion.div
              style={{
                fontSize: '4.5rem',
                position: 'absolute',
                top: '20%',
                left: '50%',
              }}
              animate={{
                opacity: [0, 1],
                top: ['30%', '85%'],
                left: ['45%', '85%'],
              }}
              transition={{
                type: 'spring',
              }}
              onAnimationComplete={() => setTimeout(() => setOn(false), 1000)}
            >
              😄
            </motion.div>
          )}
        </Box>
        <Text>오늘도 화이팅!</Text>
      </Stack>
    </AdminPageLayout>
  );
}

export default Index;
