import dotenv from "dotenv";
dotenv.config();

const envy = {
  port: process.env.PORT || 3000,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET || "secret",
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET || "secret",
  db_url: process.env.DB_URL || "mongodb://localhost:27017/user-service",
};

export default envy;
