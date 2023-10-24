import { Plantilla } from "../models/plantilla.js";

import axios from 'axios';

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

        const mensajeJSON = {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": numero,
            "type": "template",
            "template": {
              "name": plantilla.nombre,
              "language": { "code": "es" },
              "components": [
                {
                  "type": "body",
                  "parameters": [
                    {
                      "type": "text",
                      "text": contentVariable
                    }
                  ]
                }
              ]
            }
        };

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: process.env.URL_MESSAGES,
            headers: { 
              'Authorization': 'Bearer '+process.env.TOKEN_WHATSAPP
            },
            data: mensajeJSON
        };

        try {
            // Realizar una solicitud POST a la API con el JSON y el token de autenticación
            const response = await axios(config);

            const data = response.data;

            return res.json(data);

        } catch (err) {
            return res.status(400).json({ message: err.message });
        }

        

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}