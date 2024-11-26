import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Funcion_modulo } from "./funcion_modulo.js";

export const Modulo = sequelize.define('modulo', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    url: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    orden: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    estado: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 1,
    },
    modulopadre_id: {
        type: DataTypes.INTEGER
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
}, 
 {
    tableName: 'modulo', 
    timestamps: true,        
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
 }
); 

Funcion_modulo.belongsTo(Modulo, { foreignKey: 'idmodulo'});
Modulo.hasOne(Funcion_modulo, { foreignKey: 'idmodulo' });