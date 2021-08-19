export const getApiHost = () => {
  switch (process.env.NODE_ENV) {
    case 'production':
    case 'test':
      return process.env.NEXT_PUBLIC_API_HOST;
    case 'development':
    default:
      return 'http://localhost:3000';
  }
};

export const getWebHost = () => {
  switch (process.env.NODE_ENV) {
    case 'development':
    default:
      return 'http://localhost:4200';
  }
};
