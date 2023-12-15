import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const ResponseNotificationChat = sequelize.define('responseNotification', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    numberWhatsapp: {
        type: DataTypes.STRING
    },
    nameContact: {
        type: DataTypes.STRING
    },
    estado: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
}, {
    freezeTableName: true,
    timestamps: true
});

