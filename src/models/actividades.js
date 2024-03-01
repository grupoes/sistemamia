import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Actividades = sequelize.define('actividades', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true,
    timestamps: true
});