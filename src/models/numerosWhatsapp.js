import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const NumeroWhatsapp = sequelize.define('numeros_whatsapp', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    from: {
        type: DataTypes.STRING
    },
    nameContact: {
        type: DataTypes.STRING
    },
    estado: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    asistente: {
        type: DataTypes.INTEGER
    },
    plataforma_id: {
        type: DataTypes.INTEGER
    },
    tipo_contacto: {
        type: DataTypes.INTEGER
    },
    user_register: {
        type: DataTypes.INTEGER
    },
    tipo_publicidad: {
        type: DataTypes.INTEGER
    },
    publicidad: {
        type: DataTypes.INTEGER
    }
}, {
    freezeTableName: true,
    timestamps: true
});