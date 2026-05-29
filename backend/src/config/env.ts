import dotenv from "dotenv";
import { bool, cleanEnv, num, port, str } from "envalid";

dotenv.config();

if (!process.env.DATABASE_URL && process.env.MONGODB_URI) {
  process.env.DATABASE_URL = process.env.MONGODB_URI;
}

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ["development", "test", "production"],
    default: "development",
  }),
  PORT: port({ default: 4000 }),
  CLIENT_ORIGIN: str({ default: "http://localhost:3000" }),
  DATABASE_URL: str(),
  MONGODB_URI: str(),
  JWT_ACCESS_SECRET: str(),
  JWT_REFRESH_SECRET: str(),
  SMTP_HOST: str(),
  SMTP_PORT: num({ default: 587 }),
  SMTP_USER: str(),
  SMTP_PASS: str(),
  MAIL_FROM: str(),
  REDIS_URL: str({ default: "" }),
  FEATURE_ENABLE_EMAIL: bool({ default: true }),
  FEATURE_ENABLE_FILE_UPLOADS: bool({ default: true }),
  CLOUDINARY_CLOUD_NAME: str({ default: "" }),
  CLOUDINARY_API_KEY: str({ default: "" }),
  CLOUDINARY_API_SECRET: str({ default: "" }),
});
