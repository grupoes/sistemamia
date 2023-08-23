import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

import { Institucion } from "./institucion.js";

export const TipoInstitucion = sequelize.define('tipo_institucion', {
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
        type: DataTypes.INTEGER
    }
}, {
    freezeTableName: true,
    timestamps: true
});

Institucion.belongsTo(TipoInstitucion, { foreignKey: 'tipoInstitucionId' });
TipoInstitucion.hasOne(Institucion, { foreignKey: 'tipoInstitucionId' });