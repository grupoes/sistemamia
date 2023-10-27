import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const TipoContacto = sequelize.define('tipo_contacto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING
    },
    estado: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true,
    timestamps: true
});