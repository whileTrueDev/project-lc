import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { PrivacyApproachHistoryDto } from '@project-lc/shared-types';
import { useAdminPrivacyApproachHistoryMutation } from './mutation/useAdminPrivacyApproadchHistoryMutation';
import { useProfile } from './queries/useProfile';

interface PrivacyApproachHistoryDtoAndClasses extends PrivacyApproachHistoryDto {
  adminClasses: string[];
}

export function useCheckAdminClass(dto: PrivacyApproachHistoryDtoAndClasses): void {
  const { mutateAsync } = useAdminPrivacyApproachHistoryMutation();
  const { data: profile, isLoading } = useProfile();
  const router = useRouter();
  const toast = useToast();

  if (!isLoading && !dto.adminClasses.includes(profile?.adminClass)) {
    toast({
      title: '권한없는 계정',
      status: 'error',
    });
    router.push('/admin');
  }

  useEffect(() => {
    if (!isLoading && dto.adminClasses.includes(profile?.adminClass)) {
      mutateAsync(dto);
    }
  }, [isLoading]);
}
