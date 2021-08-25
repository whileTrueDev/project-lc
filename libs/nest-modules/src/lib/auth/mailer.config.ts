import dotenv from 'dotenv';

dotenv.config();

export const mailerConfig = {
  transport: {
    host: 'smtp.mailplug.co.kr',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS,
    },
  },
  defaults: {
    from: 'support@mytruepoint.com',
  },
};
