import { Plataforma } from "../models/plataforma.js";

export const getPlataformas = async (req, res) => {
    try {
        const plataformas = await Plataforma.findAll({
            where: {
                estado: 1
            }
        });

        return res.json({ message: 'ok', data: plataformas });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}