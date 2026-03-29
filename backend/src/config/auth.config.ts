import dotenv from 'dotenv';

dotenv.config();

export const getAuthConfig = () => {
  return {
    jwt: {
      access: {
        secret: process.env.JWT_ACCESS_SECRET || 'open-brain-dev-secret',
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '7d',
      },
    },
  };
};
