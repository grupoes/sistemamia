import { Plantilla } from "../models/plantilla.js";
import { Chat } from "../models/chat.js";
import { PlantillaVariable } from "../models/plantilla_variable.js";
import { Variable } from "../models/variable.js";

import axios from 'axios';

export const viewIndex = (req, res) => {

    const timestamp = Date.now();

    const css = [
        'assets/libs/datatables.net-bs4/css/dataTables.bootstrap4.min.css',
        'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.min.css',
        'https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css'
    ];

    const js = [
        'assets/libs/datatables.net/js/jquery.dataTables.min.js',
        'assets/libs/datatables.net-bs4/js/dataTables.bootstrap4.min.js',
        'https://cdn.jsdelivr.net/npm/toastify-js',
        '/js/plantilla.js'+ '?t=' + timestamp,
        'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.all.min.js'
    ];

    res.render('plantilla/index', { layout: 'partials/main', css, js });
}

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

            //const messageStatus = data.messages[0].message_status;

            if(data.messages[0]) {

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

export const apiGetTemplateAll = async (req, res) => {
    try {

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: process.env.WHATSAPP_MESSAGE_TEMPLATE,
            headers: { 
              'Authorization': 'Bearer '+process.env.TOKEN_WHATSAPP
            },
            data: ''
        };

        const response = await axios(config);

        const data = response.data;

        return res.json({ message: 'ok', data: data });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const createTemplate = async (req, res) => {
    const { categoryTemplate, editorTemplate, languageTemplate, nameTemplate, typeHeaderTemplate } = req.body;
    try {

        let dataTemplate = "";

        if(typeHeaderTemplate === 'NINGUNA') {
            const datos = {
                name: nameTemplate,
                category: categoryTemplate,
                allow_category_change: true,
                language: languageTemplate,
                bodyText: editorTemplate
            };

            dataTemplate = body_without_variable_none(datos);
        }

        if(typeHeaderTemplate === 'MENSAJE_TEXTO') {
            const datos = {
                name: nameTemplate,
                category: categoryTemplate,
                allow_category_change: true,
                language: languageTemplate,
                bodyText: editorTemplate,
                textHeader: req.body.text_header
            };

            dataTemplate = body_without_variable_none_text_header(datos);
        }

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: process.env.WHATSAPP_MESSAGE_TEMPLATE,
            headers: { 
              'Authorization': 'Bearer '+process.env.TOKEN_WHATSAPP
            },
            data: dataTemplate
        };

        const response = await axios(config);

        const data = response.data;

        return res.json({ message: 'ok', data: data });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const body_without_variable_none = (data) => {
    const dataTemplate = {
        "name": data.name,
        "language": data.language,
        "category": data.category,
        "components": [
            {
                "type": "BODY",
                "text": data.bodyText
            }
        ]
    };

    return dataTemplate;
}

const body_without_variable_none_text_header = (data) => {
    const dataTemplate = {
        "name": data.name,
        "language": data.language,
        "category": data.category,
        "components": [
            {
                "type": "HEADER",
                "format": "TEXT",
                "text": data.textHeader,
                "example": {
                  "header_text": [
                    "Summer Sale"
                  ]
                }
            },
            {
                "type": "BODY",
                "text": data.bodyText
            }
        ]
    };

    return dataTemplate;
}