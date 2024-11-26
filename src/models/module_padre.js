import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Modulo } from "./modulo.js";

export const Modulo_padre = sequelize.define('modulo_padre', {
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
    enlace: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    icono: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    orden: {
        type: DataTypes.SMALLINT,
        allowNull: true,
        unique: true,
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
}
    , {
        tableName: 'modulo_padre', 
        timestamps: true,        
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
); 

Modulo.belongsTo(Modulo_padre, { foreignKey: 'modulopadre_id' });
Modulo_padre.hasOne(Modulo, { foreignKey: 'modulopadre_id' });