import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const PlantillaVariable = sequelize.define('plantilla_variable', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    platillaId: {
        type: DataTypes.INTEGER
    },
    variableId: {
        type: DataTypes.INTEGER
    }
}, {
    freezeTableName: true,
    timestamps: true
});
