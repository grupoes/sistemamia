import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

import { Trabajadores } from "./trabajadores.js";

export const TipoTrabajo = sequelize.define('tipo_trabajo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING
    },
    descripcion: {
        type: DataTypes.STRING
    },
    estado: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
}, {
    freezeTableName: true,
    timestamps: true
});

Trabajadores.belongsTo(TipoTrabajo, { foreignKey: 'tipoTrabajoId' });
TipoTrabajo.hasOne(Trabajadores, { foreignKey: 'tipoTrabajoId' });