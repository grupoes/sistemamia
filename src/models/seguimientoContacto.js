import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const SeguimientoContacto = sequelize.define('seguimientoContacto', {
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
    notificado: {
        type: DataTypes.STRING
    },
    numero: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true,
    timestamps: true
});