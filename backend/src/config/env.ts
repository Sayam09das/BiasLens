import dotenv from "dotenv";
import { cleanEnv, num, port, str } from "envalid";

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ["development", "test", "production"],
    default: "development",
  }),
  PORT: port({ default: 4000 }),
  CLIENT_ORIGIN: str({ default: "http://localhost:3000" }),
  MONGODB_URI: str(),
  JWT_ACCESS_SECRET: str(),
  JWT_REFRESH_SECRET: str(),
  SMTP_HOST: str(),
  SMTP_PORT: num({ default: 587 }),
  SMTP_USER: str(),
  SMTP_PASS: str(),
  MAIL_FROM: str(),
  CLOUDINARY_CLOUD_NAME: str(),
  CLOUDINARY_API_KEY: str(),
  CLOUDINARY_API_SECRET: str(),
});
