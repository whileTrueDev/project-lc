export interface InquiryInput {
  name: string;
  email: string;
  phoneNumber: string;
  brandName: string;
  homepage: string;
  content: string;
  type: 'seller' | 'broadcaster';
}
