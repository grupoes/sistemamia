import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Carrera } from "./carrera.js"; 
import { Trabajadores } from "./trabajadores.js";

export const Especialidad = sequelize.define('especialidad', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false 
    },
    descripcion: {
        type: DataTypes.STRING
    },
    estado: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    carreraid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Carrera,
            key: 'id'  
        }
    }
}, {
    freezeTableName: true,
    timestamps: true
});

Carrera.hasMany(Especialidad, { foreignKey: 'carreraid' });
Especialidad.belongsTo(Carrera, { foreignKey: 'carreraid' });
Trabajadores.belongsTo(Especialidad, { foreignKey: 'especialidadId' });
Especialidad.hasOne(Trabajadores, { foreignKey: 'especialidadId' });
