import { NumeroWhatsapp } from "../models/numerosWhatsapp.js";

export const addWhatsapp = async(req, res) => {
    const { from, nameContact } = req.body;
    try {

        const whatsapp = await NumeroWhatsapp.findOne({
            where: {
                from: from
            }
        });

        if(whatsapp) {
            const newWhatsapp = await NumeroWhatsapp.create({
                from,
                nameContact
            });
    
            return res.json(newWhatsapp);
        }

        return res.json({message: "from ya existe"});

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}