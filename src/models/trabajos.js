import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Trabajos = sequelize.define('trabajos', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    actividad_id: {
        type: DataTypes.INTEGER
    },
    nombre: {
        type: DataTypes.STRING
    },
    descripcion: {
        type: DataTypes.TEXT
    },
    duracion: {
        type: DataTypes.STRING
    },
    nivel_academico: {
        type: DataTypes.STRING
    },
    prioridad: {
        type: DataTypes.STRING
    },
    fecha_limite: {
        type: DataTypes.DATE
    },
    fecha_entrega: {
        type: DataTypes.DATE
    },
    padre_trabajo_id: {
        type: DataTypes.INTEGER
    },
    estado: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
}, {
    freezeTableName: true,
    timestamps: true
});