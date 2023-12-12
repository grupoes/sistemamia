import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Registros = sequelize.define('registros', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
    },
    tipo_actividad: {
        type: DataTypes.STRING
    },
    descripcion_detallada: {
        type: DataTypes.STRING
    },
    fecha_hora: {
        type: DataTypes.DATE
    },
    direccion_ip: {
        type: DataTypes.STRING
    },
    dispositivo: {
        type: DataTypes.STRING
    },
    resultado_actividad: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true,
    timestamps: true
});

