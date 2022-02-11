import * as dotenv from 'dotenv';

dotenv.config();

export const mailerConfig = {
  transport: {
    service: 'gmail',
    port: 465,
    // host: 'smtp.google.com',
    // port: 587,
    secure: true,
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS,
      // type: 'OAuth2',
      // clientId: process.env.GMAIL_OAUTH_CLIENT_ID,
      // clientSecret: process.env.GMAIL_OAUTH_CLIENT_SECRET,
      // refreshToken: process.env.GMAIL_OAUTH_REFRESH_TOKEN,
    },
  },
  defaults: {
    from: process.env.MAILER_USER,
  },
};
