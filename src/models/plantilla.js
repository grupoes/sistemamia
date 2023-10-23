import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Plantilla = sequelize.define('plantilla', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING
    },
    contenido: {
        type: DataTypes.TEXT
    },
    cabecera: {
        type: DataTypes.STRING
    },
    tipoCabecera: {
        type: DataTypes.STRING
    },
    estado: {
        type: DataTypes.STRING
    },
    habilitado: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true,
    timestamps: true
});