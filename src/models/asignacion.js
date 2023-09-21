import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

import { Trabajadores } from "./trabajadores.js";
import { PotencialCliente } from "./potencialCliente.js";

export const Asignacion = sequelize.define('asignacion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha_asignacion: {
        type: DataTypes.DATE
    },
    estado: {
        type: DataTypes.INTEGER
    }
}, {
    indexes: [
        {
          unique: false,
          fields: ['trabajadoreId', 'potencialClienteId']
        }
    ],
    freezeTableName: true,
    timestamps: true
});

Trabajadores.belongsToMany(PotencialCliente, { through: Asignacion, unique: false });
PotencialCliente.belongsToMany(Trabajadores, { through: Asignacion, unique: false });