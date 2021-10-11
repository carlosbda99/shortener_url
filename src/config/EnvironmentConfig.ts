import dotenv from "dotenv";

dotenv.config();

const environment: {
  PORT: string
  JWT_SECRET: string
} = {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET
};

export default environment;
