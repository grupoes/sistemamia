import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Usuario = sequelize.define('usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    correo: {
        type: DataTypes.STRING,
        unique: true 
    },
    password: {
        type: DataTypes.STRING
    },
    estado: {
        type: DataTypes.INTEGER
    },
    trabajador_id: {
        type: DataTypes.INTEGER
    }
}, {
    freezeTableName: true,
    timestamps: true
});