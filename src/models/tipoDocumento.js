import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

import { Trabajadores } from "./trabajadores.js";

export const TipoDocumento = sequelize.define('tipo_documento', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(50)
    },
    codSunat: {
        type: DataTypes.STRING(2)
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    freezeTableName: true,
    timestamps: true
});

Trabajadores.belongsTo(TipoDocumento, { foreignKey: 'tipo_documento_id' });
TipoDocumento.hasOne(Trabajadores, { foreignKey: 'tipo_documento_id' });