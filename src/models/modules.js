import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Modulos = sequelize.define('modules', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fatherId: {
        type: DataTypes.INTEGER
    },
    name: {
        type: DataTypes.STRING
    },
    url: {
        type: DataTypes.STRING
    },
    icono: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true,
    timestamps: true
});