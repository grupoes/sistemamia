import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const ModuleActions = sequelize.define('ModuleActions', {
    actionId: {
        type: DataTypes.INTEGER,
    },
    moduleId: {
        type: DataTypes.INTEGER,
    }
}, {
    freezeTableName: true,
    timestamps: true
});