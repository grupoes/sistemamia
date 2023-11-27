import { Plantilla } from "../models/plantilla.js";
import { Chat } from "../models/chat.js";
import { PlantillaVariable } from "../models/plantilla_variable.js";
import { Variable } from "../models/variable.js";

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

export const getPlantilla = async (req, res) => {
    const id = req.params.id;
    try {
        const plantilla = await Plantilla.findOne({
            where: {
                id: id
            }
        });

        const plantVars = await PlantillaVariable.findAll({
            where: {
                platillaId: id
            }
        });

        let variables = [];

        for (const plantVar of plantVars) {
            let variable = await Variable.findOne({
                where: {
                    id: plantVar.variableId
                }
            });

            variables.push(variable);
        }

        return res.json({ message: 'ok', plantilla: plantilla, variables: variables });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const reemplazarMarcadoresConArray = (str, array) => {
    return str.replace(/\{\{\{(\w+)\}\}\}/g, (match, variable) => {
        const valor = array.shift();
        return valor || match; // Si no hay valor en el array, deja el marcador intacto
    });
}

export const sendPlantilla = async (req, res) => {
    const { idPlantilla, numero, variables } = req.body;
    try {

        const plantilla = await Plantilla.findOne({
            where: {
                id: idPlantilla
            }
        });

        let parametros_body = [];

        for (let i = 0; i < variables.length; i++) {
            let parametro = {
                type: "text",
                text: variables[i],
            };

            parametros_body.push(parametro);
            
        }

        let mensajeJSON = "";
        let tipoMensaje = "";

        if(plantilla.cabecera === 'si') {

            if(plantilla.tipoCabecera === 'video') {
                mensajeJSON = {
                    "messaging_product": "whatsapp",
                    "recipient_type": "individual",
                    "to": numero,
                    "type": "template",
                    "template": {
                      "name": plantilla.nombre,
                      "language": { "code": "es" },
                      "components": [
                        {
                            "type": "header",
                            "parameters": [
                                {
                                    "type": "video",
                                    "video": {
                                        "link": plantilla.url_cabecera
                                    }
                                }
                            ]
                        },
                        {
                          "type": "body",
                          "parameters": parametros_body
                        }
                      ]
                    }
                };

                tipoMensaje = 'video';
            }

            if(plantilla.tipoCabecera === 'image') {
                mensajeJSON = {
                    "messaging_product": "whatsapp",
                    "recipient_type": "individual",
                    "to": numero,
                    "type": "template",
                    "template": {
                      "name": plantilla.nombre,
                      "language": { "code": "es" },
                      "components": [
                        {
                            "type": "header",
                            "parameters": [
                                {
                                    "type": "image",
                                    "image": {
                                        "link": plantilla.url_cabecera
                                    }
                                }
                            ]
                        },
                        {
                          "type": "body",
                          "parameters": parametros_body
                        }
                      ]
                    }
                };

                tipoMensaje = 'image';
            }

        } else {
            mensajeJSON = {
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
                      "parameters": parametros_body
                    }
                  ]
                }
            };

            tipoMensaje = 'text';
        }

        const messageSend = plantilla.contenido;

        const contenido = reemplazarMarcadoresConArray(messageSend, variables);

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

            if(messageStatus === 'accepted') {

                let descriptionChat = "";
                let contenidoChat = contenido;

                if(plantilla.cabecera === 'si') {
                    descriptionChat = contenido,
                    contenidoChat = "";
                }

                const newMessage = await Chat.create({
                    codigo: data.messages[0].id,
                    from: process.env.NUMERO_WHATSAPP,
                    message: contenidoChat,
                    nameContact: "Grupo Es Consultores",
                    receipt: numero,
                    timestamp: Math.floor(Date.now() / 1000),
                    typeMessage: tipoMensaje,
                    description: descriptionChat,
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