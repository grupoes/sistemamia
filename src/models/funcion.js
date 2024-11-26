import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Funcion_modulo } from "./funcion_modulo.js";

export const Funcion = sequelize.define('funcion', {
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
    funcion: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    icono: {
        type: DataTypes.STRING(50),
    },
    clase: {
        type: DataTypes.STRING(50),
    },
    de_registro: {
        type: DataTypes.SMALLINT,
        allowNull: false,
    },
    orden: {
        type: DataTypes.SMALLINT,
    },
    estado : {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 1,
    }
    }, {
        tableName: 'funcion', 
        timestamps: true,        
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
); 

Funcion_modulo.belongsTo(Funcion, { foreignKey: 'idfuncion'});
Funcion.hasOne(Funcion_modulo, { foreignKey: 'idfuncion' });