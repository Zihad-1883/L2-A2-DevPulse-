import dotenv from "dotenv";

dotenv.config({ quiet: true });

const config = {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL as string,
  jwt_secret: process.env.JWT_SECRET as string,
};

export default config;
