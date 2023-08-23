import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

import { Cargo } from "./cargos.js";
import { Trabajadores } from "./trabajadores.js";

export const TrabajadorCargo = sequelize.define('trabajador_cargo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha_ascenso: {
        type: DataTypes.DATE
    },
    estado: {
        type: DataTypes.INTEGER
    }
}, {
    freezeTableName: true,
    timestamps: true
});

Trabajadores.belongsToMany(Cargo, { through: TrabajadorCargo });
Cargo.belongsToMany(Trabajadores, { through: TrabajadorCargo });