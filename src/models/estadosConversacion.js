import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Chat_estados = sequelize.define('chat_estados', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    codigo: {
        type: DataTypes.STRING
    },
    recienptaId: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.STRING
    },
    timestamp: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true,
    timestamps: true
});