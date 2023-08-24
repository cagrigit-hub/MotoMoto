// utils/authUtils.ts
import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt';

export const validateAccessToken = (token: string): boolean => {
  try {
    // console log get rid of Bearer
    jwt.verify(token, jwtConfig.accessSecret);
    return true;
  } catch (error) {
    return false;
  }
};

export const validateRefreshToken = (token: string): boolean => {
  try {
    jwt.verify(token, jwtConfig.refreshSecret);
    return true;
  } catch (error) {
    return false;
  }
};
