export const getApiHost = () => {
  switch (process.env.NODE_ENV) {
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
