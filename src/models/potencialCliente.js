import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const PotencialCliente = sequelize.define('potencial_cliente', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombres: {
        type: DataTypes.STRING
    },
    apellidos: {
        type: DataTypes.STRING
    },
    fecha_ingreso: {
        type: DataTypes.DATE
    },
    fecha_registro: {
        type: DataTypes.DATE
    },
    prefijo_celular: {
        type: DataTypes.INTEGER
    },
    numero_celular: {
        type: DataTypes.INTEGER
    },
    prefijo_whatsapp: {
        type: DataTypes.STRING
    },
    numero_whatsapp: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true,
    timestamps: true
})