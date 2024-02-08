import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Notification = sequelize.define('notification', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    description: {
        type: DataTypes.TEXT
    },
    status: {
        type: DataTypes.STRING
    },
    fecha: {
        type: DataTypes.DATE
    },
    url: {
        type: DataTypes.STRING
    },
    numero: {
        type: DataTypes.STRING
    },
    contacto: {
        type: DataTypes.STRING
    },
    estado: {
        type: DataTypes.STRING
    },
    id_user: {
        type: DataTypes.INTEGER
    }
}, {
    freezeTableName: true,
    timestamps: true
});