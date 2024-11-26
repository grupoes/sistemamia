import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

import { Usuario } from "../models/usuario.js";
import { Trabajos } from "../models/trabajos.js";

export const Horario = sequelize.define('horarios', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha_inicio: {
        type: DataTypes.DATE
    },
    fecha_fin: {
        type: DataTypes.DATE
    },
    trabajo_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
});

Usuario.hasMany(Horario, { foreignKey: 'usuario_id' });
Horario.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Trabajos.hasMany(Horario, { foreignKey: 'trabajo_id' });
Horario.belongsTo(Trabajos, { foreignKey: 'trabajo_id' });