import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Proyecto = sequelize.define('proyecto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    descripcion: {
        type: DataTypes.STRING
    },
    titulo: {
        type: DataTypes.STRING
    },
    alumno: {
        type: DataTypes.STRING
    },
    fecha_limite: {
        type: DataTypes.DATE
    },
    duracion: {
        type: DataTypes.INTEGER
    },
    fecha_registro: {
        type: DataTypes.DATE
    },
    es_cliente: {
        type: DataTypes.INTEGER
    },
    color: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true,
    timestamps: true
});

