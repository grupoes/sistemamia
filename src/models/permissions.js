import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

import { Usuario } from "./usuario.js";
import { Actions } from "./actions.js";
import { Modulos } from "./modules.js";

export const Permissions = sequelize.define('permissions', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
}, {
    freezeTableName: true,
    timestamps: true
});

//relacion de usuarios a permisos
Usuario.hasMany(Permissions, {
    foreignKey: 'userId',
    sourceKey: 'id'
});

Permissions.belongsTo(Usuario, {
    foreignKey: 'userId',
    targetKey: 'id'
});

//relacion de actions a permisos
Actions.hasMany(Permissions, {
    foreignKey: 'actionId',
    sourceKey: 'id'
});

Permissions.belongsTo(Actions, {
    foreignKey: 'actionId',
    targetKey: 'id'
});

//relacion de modulos a permisos
Modulos.hasMany(Permissions, {
    foreignKey: 'moduleId',
    sourceKey: 'id'
});

Permissions.belongsTo(Modulos, {
    foreignKey: 'moduleId',
    targetKey: 'id'
});