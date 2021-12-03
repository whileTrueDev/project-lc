import { Stack } from '@chakra-ui/layout';
import SettingSectionLayout from './SettingSectionLayout';

export function BroadcasterAddress(): JSX.Element {
  return (
    <SettingSectionLayout title="샘플 및 선물 수령 주소">
      <BroadcasterAddressForm />
    </SettingSectionLayout>
  );
}

export function BroadcasterAddressForm(): JSX.Element {
  return <Stack as="form">form</Stack>;
}
