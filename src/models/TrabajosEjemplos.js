import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Trabajos = sequelize.define('trabajo_ejemplos', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha: {
        type: DataTypes.DATE
    },
    horainicio: {
        type: DataTypes.TIME
    },
    horafin: {
        type: DataTypes.TIME
    },
    estado: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true,
    timestamps: false
});