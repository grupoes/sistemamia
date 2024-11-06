import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Usuario } from "./usuario.js";
import { Perfil } from "./perfil.js";

export const UsuarioPerfil = sequelize.define('usuario_perfil', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Usuario,
            key: 'id'
        },
        allowNull: false
    },
    perfil_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Perfil,
            key: 'id'
        },
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
});

Usuario.belongsToMany(Perfil, { through: UsuarioPerfil, foreignKey: 'usuario_id' });
Perfil.belongsToMany(Usuario, { through: UsuarioPerfil, foreignKey: 'perfil_id' });