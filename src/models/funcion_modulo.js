import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Funcion_modulo = sequelize.define('funcion_modulo', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        idmodulo: {
            type: DataTypes.SMALLINT
        },
        idfuncion: {
            type: DataTypes.SMALLINT
        },
        estado: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            defaultValue: 1,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        }
    }, {
        tableName: 'funcion_modulo', 
        timestamps: true,        
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
); 