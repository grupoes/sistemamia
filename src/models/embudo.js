import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

import { Etiqueta } from "./etiquetas.js";

export const Embudo = sequelize.define('embudo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    descripcion: {
        type: DataTypes.STRING
    },
    color: {
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

Etiqueta.belongsTo(Embudo, { foreignKey: 'embudo_id' });
Embudo.hasOne(Etiqueta, { foreignKey: 'embudo_id' });