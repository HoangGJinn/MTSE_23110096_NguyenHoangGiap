// src/config/database.ts
import { Sequelize } from "sequelize-typescript";
import { User } from "../models/User";
import dotenv from "dotenv";

dotenv.config();

const {
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASS
} = process.env;

export const sequelize = new Sequelize({
  dialect: "mysql",
  host: DB_HOST,
  port: DB_PORT ? Number(DB_PORT) : 3036,
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  models: [User], // load models here, or use path
  logging: false
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    // sync({ force: true }) nếu muốn recreate bảng
    await sequelize.sync(); //cho production bạn nên dùng migration tool.
    console.log("Database connected and synced");
  } catch (error) {
    console.error("Unable to connect to DB:", error);
    throw error;
  }
};
