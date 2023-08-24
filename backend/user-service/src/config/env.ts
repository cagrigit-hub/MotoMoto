import dotenv from 'dotenv';
dotenv.config();

export const env = {
    port: process.env.PORT || 3000,
    jwt_secret: process.env.JWT_SECRET || 'secret',
    db_url: process.env.DB_URL || 'mongodb://localhost:27017/user-service',
}
