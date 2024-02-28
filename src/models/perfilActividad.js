import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

import { Actividades } from "./actividades.js";
import { Area } from "./area.js";

export const PerfilActividad = sequelize.define('perfilActividad', {
    
}, {
    freezeTableName: true,
    timestamps: true
});

Actividades.belongsToMany(Area, { through: PerfilActividad });
Area.belongsToMany(Actividades, { through: PerfilActividad });