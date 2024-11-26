import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const PerfilesPermisos = sequelize.define('perfiles_permisos', {
    idpermiso: {
        type: DataTypes.SMALLINT,
        references: {
            model: 'permisos', 
            key: 'id'
        },
        allowNull: false,
        primaryKey: true
    },
    idperfil: {
        type: DataTypes.SMALLINT,
        references: {
            model: 'perfiles',
            key: 'id'
        },
        allowNull: false,
        primaryKey: true
    }
}, {
    tableName: 'perfiles_permisos',
    timestamps: false,
});
