import Sequelize from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(process.env.DATABASE, process.env.USERDB, process.env.PASSWORDDB, {
    host: process.env.HOST,
    dialect: 'postgres',
    timezone: 'America/Lima'
});