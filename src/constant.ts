import dotenv from 'dotenv';
dotenv.config();

export const port = process.env.PORT || 5000;
export const uri_mongo = process.env.URI_MONGO;
export const jwt_access_secret = process.env.JWT_ACCESS_SECRET || 'fsdff';
export const jwt_refresh_secret = process.env.JWT_REFRESH_SECRET || 'ed3er';
export const username_mailer = process.env.USERNAME_MAILER;
export const password_mailer = process.env.PASSWORD_MAILER;
