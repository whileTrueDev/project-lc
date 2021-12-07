export const getApiHost = (): string | undefined => {
  switch (process.env.NODE_ENV) {
    case 'production':
    case 'test':
      return process.env.NEXT_PUBLIC_API_HOST || process.env.API_HOST;
    case 'development':
    default:
      return 'http://localhost:3000';
  }
};

export const getWebHost = (): string => {
  switch (process.env.NODE_ENV) {
    case 'production':
    case 'test':
      return process.env.NEXT_PUBLIC_WEB_HOST || process.env.SELLER_WEB_HOST;
    case 'development':
    default:
      return 'http://localhost:4200';
  }
};

export const getBroadcasterCenterHost = (): string => {
  switch (process.env.NODE_ENV) {
    case 'production':
    case 'test': // return process.env.NEXT_PUBLIC_WEB_HOST || process.env.SELLER_WEB_HOST;
    case 'development':
    default:
      return 'http://localhost:4300';
  }
};

export const getAdminHost = (): string => {
  switch (process.env.NODE_ENV) {
    case 'production':
    case 'test':
      return process.env.NEXT_PUBLIC_ADMIN_HOST;
    case 'development':
    default:
      return 'http://localhost:4250';
  }
};

export const getBroadcasterWebHost = (): string => {
  switch (process.env.NODE_ENV) {
    case 'production':
    case 'test':
    case 'development':
    default:
      return 'http://localhost:4300';
  }
};
