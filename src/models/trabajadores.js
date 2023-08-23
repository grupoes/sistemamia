import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

import { Usuario } from "./usuario.js";

export const Trabajadores = sequelize.define('trabajadores', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    numero_documento: {
        type: DataTypes.INTEGER
    },
    nombres: {
        type: DataTypes.STRING
    },
    apellidos: {
        type: DataTypes.STRING
    },
    fecha_nacimiento: {
        type: DataTypes.DATE
    },
    telefono: {
        type: DataTypes.INTEGER
    },
    direccion: {
        type: DataTypes.STRING
    },
    urbanizacion: {
        type: DataTypes.STRING
    },
    cuenta_bancaria: {
        type: DataTypes.STRING
    },
    area_id: {
        type: DataTypes.INTEGER
    },
    tipo_documento_id: {
        type: DataTypes.INTEGER
    },
    tipoTrabajoId: {
        type: DataTypes.INTEGER
    },
    ubigeoId: {
        type: DataTypes.INTEGER
    }
}, {
    freezeTableName: true,
    timestamps: true
});

Usuario.belongsTo(Trabajadores, { foreignKey: 'trabajador_id' });
Trabajadores.hasOne(Usuario, { foreignKey: 'trabajador_id' });