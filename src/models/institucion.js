import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Institucion = sequelize.define('institucion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tipoInstitucionId: {
        type: DataTypes.INTEGER
    },
    nombreInstitucion: {
        type: DataTypes.STRING
    },
    departamento: {
        type: DataTypes.STRING
    },
    provincia: {
        type: DataTypes.STRING
    },
    distrito: {
        type: DataTypes.STRING
    },
    tipo_gestion: {
        type: DataTypes.STRING
    },
    estado: {
        type: DataTypes.INTEGER
    }
}, {
    freezeTableName: true,
    timestamps: true
});