import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Clientes = sequelize.define('clientes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tipoDocumentoId: {
        type: DataTypes.INTEGER
    },
    numero_documento: {
        type: DataTypes.INTEGER
    },
    fecha_registro: {
        type: DataTypes.DATE
    }
}, {
    freezeTableName: true,
    timestamps: true
});