import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

import { Trabajadores } from "./trabajadores.js";
import { Cargo } from "./cargos.js";

export const Area = sequelize.define('area', {
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

Trabajadores.belongsTo(Area, { foreignKey: 'area_id' });
Area.hasOne(Trabajadores, { foreignKey: 'area_id' });

Cargo.belongsTo(Area, { foreignKey: 'area_id' });
Area.hasOne(Cargo, { foreignKey: 'area_id' });

