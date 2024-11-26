import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { PerfilesPermisos } from "./perfiles_permisos.js";

export const Permisos = sequelize.define('permisos', {
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
        estado : {
            type: DataTypes.SMALLINT,
            allowNull: false,
            defaultValue: 1,
        }
    }, {
        tableName: 'permisos', 
        timestamps: true,        
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
); 

PerfilesPermisos.belongsTo(Permisos, { foreignKey: 'idpermiso' });
Permisos.hasOne(PerfilesPermisos, { foreignKey: 'idpermiso' });