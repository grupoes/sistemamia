import { Plantilla } from "../models/plantilla.js";

export const getPlantillas = async (req, res) => {
    try {
        const plantillas = await Plantilla.findAll({
            where: {
                estado: 'aceptado',
                habilitado: 'activo'
            }
        });

        return res.json({ message: 'ok', data: plantillas });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const sendPlantilla = async (req, res) => {
    const { idPlantilla, contentVariable, numero } = req.body;
    try {

        const plantilla = await Plantilla.findOne({
            where: {
                id: idPlantilla
            }
        });

        const dataFile = {
            messaging_product: "whatsapp",
            to: numero,
            type: "template",
            template: {
                name: plantilla.nombre,
                language: {
                    code: "es"
                }
            }
        };

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: process.env.URL_MESSAGES,
            headers: { 
              'Authorization': 'Bearer '+process.env.TOKEN_WHATSAPP
            },
            data: dataFile
        };
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}