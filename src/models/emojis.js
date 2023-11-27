import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Emojis = sequelize.define('emojis', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    slug: {
        type: DataTypes.STRING
    },
    character: {
        type: DataTypes.STRING
    },
    unicodeName: {
        type: DataTypes.STRING
    },
    codePoint: {
        type: DataTypes.STRING
    },
    group: {
        type: DataTypes.STRING
    },
    subGroup: {
        type: DataTypes.STRING
    },
    estado: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true,
    timestamps: true
});

