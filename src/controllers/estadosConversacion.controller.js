import { Chat_estados } from "../models/estadosConversacion.js";

export const addChatEstados = async(req, res) => {
    const { id, recienptaId, status, timestamp } = req.body;
    try {
        const newEstado = await Chat_estados.create({
            codigo: id,
            recienptaId: recienptaId,
            status: status,
            timestamp: timestamp
        });

        return res.json(newEstado);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}