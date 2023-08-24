// utils/authUtils.ts
import jwt from 'jsonwebtoken';
import envy from '../config/env';

export const validateAccessToken = (token: string): boolean => {
  try {
    jwt.verify(token, envy.jwt_access_secret);
    return true;
  } catch (error) {
    return false;
  }
};

export const validateRefreshToken = (token: string): boolean => {
  try {
    jwt.verify(token, envy.jwt_refresh_secret);
    return true;
  } catch (error) {
    return false;
  }
};
