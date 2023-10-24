import { Plantilla } from "../models/plantilla.js";
import { Chat } from "../models/chat.js";

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

            const messageStatus = data.messages[0].message_status;

            const messageSend = `¡${contentVariable} con excelentes noticias! 🎉

            En Grupo ES Consultores, estamos aquí para asesorarte en tu tesis de principio a fin. ¡Deja de preocuparte y disfruta del proceso! Estamos comprometidos en apoyarte hasta el último paso. 👩‍🎓🤝
            
            ¡Contáctanos hoy mismo! 📚✨`;

            if(messageStatus === 'accepted') {

                const newMessage = await Chat.create({
                    codigo: data.messages[0].id,
                    from: process.env.NUMERO_WHATSAPP,
                    message: messageSend,
                    nameContact: "Grupo Es Consultores",
                    receipt: numero,
                    timestamp: Math.floor(Date.now() / 1000),
                    typeMessage: "text",
                    estadoMessage: "sent",
                    documentId: "",
                    id_document: "",
                    filename: "",
                    fromRes: "",
                    idRes: ""
                });

                return res.json({ message: 'ok', data: newMessage });

            } else {
                return res.json({message: "No fue enviado la plantilla"});
            }

        } catch (err) {
            return res.status(400).json({ message: err.message });
        }

        

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}