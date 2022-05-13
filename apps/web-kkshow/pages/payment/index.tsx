import { KkshowLayout } from '@project-lc/components-web-kkshow/KkshowLayout';
import { OrderPaymentForm } from '@project-lc/components-web-kkshow/payment/OrderPaymentForm';

export function Payment(): JSX.Element {
  return (
    <KkshowLayout>
      <OrderPaymentForm />
    </KkshowLayout>
  );
}

export default Payment;
