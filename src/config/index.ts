import dotenv from "dotenv";

dotenv.config({ quiet: true });

const config = {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL as string,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET as string,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET as string,
};

export default config;
