import { NumeroWhatsapp } from "../models/numerosWhatsapp.js";

export const addWhatsapp = async(req, res) => {
    const { from, nameContact } = req.body;
    try {
        const newWhatsapp = await NumeroWhatsapp.create({
            from,
            nameContact
        });

        return res.json(newWhatsapp);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}