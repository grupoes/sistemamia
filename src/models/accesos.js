import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Accesos = sequelize.define('accesos', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        idmodulo: {
            type: DataTypes.SMALLINT,
            references: {
                model: 'modulo', 
                key: 'id'
            },
        },
        idperfil: {
            type: DataTypes.SMALLINT,
            references: {
                model: 'perfiles', 
                key: 'id'
            },
        },
        estado : {
            type: DataTypes.SMALLINT,
            allowNull: false,
            defaultValue: 1,
        }
    }, {
        tableName: 'accesos', 
        timestamps: true,        
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
); 