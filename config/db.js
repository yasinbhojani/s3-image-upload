import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(process.env.PG_CONNECTION_STRING);

export const authSequelize = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection to sequelize has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export { sequelize };
