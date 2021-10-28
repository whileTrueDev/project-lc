import dotenv from 'dotenv';

dotenv.config();

export const mailerConfig = {
  transport: {
    service: 'gmail',
    host: 'smtp.google.com',
    port: 587,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: process.env.MAILER_USER,
      clientId: process.env.GMAIL_OAUTH_CLIENT_ID,
      clientSecret: process.env.GMAIL_OAUTH_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_OAUTH_REFRESH_TOKEN,
    },
  },
  defaults: {
    from: process.env.MAILER_USER,
  },
};
