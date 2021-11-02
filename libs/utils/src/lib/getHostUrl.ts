export const getApiHost = (): string | undefined => {
  switch (process.env.NODE_ENV) {
    case 'production':
    case 'test':
      return process.env.NEXT_PUBLIC_API_HOST;
    case 'development':
    default:
      return 'http://localhost:3000';
  }
};

export const getWebHost = (): string => {
  switch (process.env.NODE_ENV) {
    case 'development':
    default:
      return 'http://localhost:4200';
  }
};
