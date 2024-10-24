import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Perfil = sequelize.define('perfiles', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    descripcion: {
        type: DataTypes.STRING
    },
    estado: {
        type: DataTypes.INTEGER,
        defaultValue: 1 
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW 
    }
}, {
    freezeTableName: true,
    timestamps: true,  
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});
