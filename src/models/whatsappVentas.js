import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const WahtasappVentas = sequelize.define('whatsappVentas', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    numero: {
        type: DataTypes.STRING
    },
    nombre: {
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