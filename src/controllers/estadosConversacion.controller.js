import { Chat_estados } from "../models/estadosConversacion.js";

import { Op, literal } from 'sequelize';

export const addChatEstados = async(req, res) => {
    const { id, recienptaId, status, timestamp } = req.body;
    try {

        const registro = await Chat_estados.findOne({
            where: {
                codigo: id,
                recienptaId: recienptaId,
                status: status,
            },
        });

        if (!registro) {
            const newEstado = await Chat_estados.create({
                codigo: id,
                recienptaId: recienptaId,
                status: status,
                timestamp: timestamp
            });

            return res.json({ message: 'ok', data: newEstado });
        }

        return res.json({ message: 'ya existe estos registros' })

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const orderEstatus = async (req, res) => {
    const codigo = req.params.id;
    try {
        const estados = await Chat_estados.findOne({
            where: {
                codigo: codigo
            },
            order: literal("CASE WHEN status = 'sent' THEN 1 WHEN status = 'delivered' THEN 2 WHEN status = 'read' THEN 3 END DESC")
        });

        return res.json({ message: 'ok', data: estados });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}