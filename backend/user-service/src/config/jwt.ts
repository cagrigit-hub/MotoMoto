// config/jwt.ts
import envy from "./env";

export default {
  accessSecret: envy.jwt_access_secret, // Your access token secret
  refreshSecret: envy.jwt_refresh_secret, // Your refresh token secret
  accessExpiresIn: '15m', // Access token expiration (shorter)
  refreshExpiresIn: '30d', // Refresh token expiration (longer)
};