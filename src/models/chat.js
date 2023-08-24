import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Chat = sequelize.define('chat', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    codigo: {
        type: DataTypes.STRING
    },
    from: {
        type: DataTypes.STRING
    },
    message: {
        type: DataTypes.TEXT
    },
    nameContact: {
        type: DataTypes.STRING
    },
    receipt: {
        type: DataTypes.STRING
    },
    timestamp: {
        type: DataTypes.STRING
    },
    typeMessage: {
        type: DataTypes.STRING
    },
    estadoMessage: {
        type: DataTypes.STRING,
        defaultValue: 'sent'
    },
    documentId: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true,
    timestamps: true
});