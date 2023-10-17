import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const EtiquetaCliente = sequelize.define('etiquetaCliente', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cliente_id: {
        type: DataTypes.INTEGER,
    },
    etiqueta_id: {
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