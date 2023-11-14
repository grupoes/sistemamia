import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Chat = sequelize.define('chat', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    codigo: {
        type: DataTypes.STRING
    },
    from: {
        type: DataTypes.STRING
    },
    message: {
        type: DataTypes.TEXT
    },
    nameContact: {
        type: DataTypes.STRING
    },
    receipt: {
        type: DataTypes.STRING
    },
    timestamp: {
        type: DataTypes.STRING
    },
    typeMessage: {
        type: DataTypes.STRING
    },
    estadoMessage: {
        type: DataTypes.STRING,
        defaultValue: 'sent'
    },
    documentId: {
        type: DataTypes.STRING
    },
    id_document: {
        type: DataTypes.STRING
    },
    filename: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    description: {
        type: DataTypes.STRING
    },
    fromRes: {
        type: DataTypes.STRING
    },
    idRes: {
        type: DataTypes.STRING
    },
    source_url: {
        type: DataTypes.STRING
    },
    source_id: {
        type: DataTypes.STRING
    },
    source_type: {
        type: DataTypes.STRING
    },
    body: {
        type: DataTypes.TEXT
    },
    headline: {
        type: DataTypes.STRING
    },
    media_type: {
        type: DataTypes.STRING
    },
    media_url: {
        type: DataTypes.STRING
    },
    thumbnail_url: {
        type: DataTypes.TEXT
    },
    ctwa_clid: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true,
    timestamps: true
});