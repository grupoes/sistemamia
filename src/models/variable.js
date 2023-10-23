import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Variable = sequelize.define('variable', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING
    },
    descripcion: {
        type: DataTypes.STRING
    },
    estado: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true,
    timestamps: true
});
