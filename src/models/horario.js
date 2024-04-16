import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

import { Usuario } from "../models/usuario.js";
import { Proyecto } from "../models/proyecto.js";

export const Horario = sequelize.define('horario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha_inicio: {
        type: DataTypes.DATE
    },
    fecha_fin: {
        type: DataTypes.DATE
    },
    estado: {
        type: DataTypes.STRING
    },
    proyectoId: {
        type: DataTypes.INTEGER,
        references: {
          model: Proyecto,
          key: 'id'
        }
    },
    usuarioId: {
        type: DataTypes.INTEGER,
        references: {
          model: Usuario,
          key: 'id'
        }
    }

}, {
    freezeTableName: true,
    timestamps: true,
    uniqueKeys: {
        keys: {
          uniqueKey: {
            fields: ['proyectoId', 'usuarioId', 'fecha_inicio']
          }
        }
    }
});

Horario.belongsTo(Proyecto, { foreignKey: 'proyectoId' });
Horario.belongsTo(Usuario, { foreignKey: 'usuarioId' });

Proyecto.belongsToMany(Usuario, { through: Horario });
Usuario.belongsToMany(Proyecto, { through: Horario });

