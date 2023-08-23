import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

import { Trabajadores } from "./trabajadores.js";

export const Ubigeo = sequelize.define('ubigeo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    codigo: {
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
    }
}, {
    freezeTableName: true,
    timestamps: false
});

Trabajadores.belongsTo(Ubigeo, { foreignKey: 'ubigeoId' });
Ubigeo.hasOne(Trabajadores, { foreignKey: 'ubigeoId' });