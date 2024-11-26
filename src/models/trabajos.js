import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

import { Actividades } from "../models/actividades.js"

export const Trabajos = sequelize.define('trabajos', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    actividad_id: {
        type: DataTypes.INTEGER
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
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    estado: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    entidad: {
        type: DataTypes.STRING
    },
    color: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true,
    timestamps: false
});

Actividades.hasMany(Trabajos, { foreignKey: 'actividad_id' });
Trabajos.belongsTo(Actividades, { foreignKey: 'actividad_id' });