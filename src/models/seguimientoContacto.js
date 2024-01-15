import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Actions = sequelize.define('', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true,
    timestamps: true
});