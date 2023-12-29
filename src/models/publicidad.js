import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Publicidad = sequelize.define('publicidad', {
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
    codigo: {
        type: DataTypes.INTEGER
    },
    imagen: {
        type: DataTypes.STRING
    },
    estado: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
}, {
    freezeTableName: true,
    timestamps: true
});