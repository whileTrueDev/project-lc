import * as dotenv from 'dotenv';

dotenv.config();

export const mailerConfig = {
  transport: {
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS,
    },
  },
  defaults: {
    from: process.env.MAILER_USER,
  },
};
