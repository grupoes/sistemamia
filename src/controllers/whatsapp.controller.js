import { NumeroWhatsapp } from "../models/numerosWhatsapp.js";
import { PotencialCliente } from "../models/potencialCliente.js";
import { EtiquetaCliente } from "../models/etiquetaCliente.js";
import { Etiqueta } from "../models/etiquetas.js";
import { Asignacion } from "../models/asignacion.js";
import { Plantilla } from "../models/plantilla.js";
import { Chat } from "../models/chat.js";

import { asignarAsistente } from "./base.controller.js";

import { Op } from 'sequelize';

import axios from 'axios';
import { Trabajadores } from "../models/trabajadores.js";

export const addWhatsapp = async(req, res) => {
    const { from, nameContact } = req.body;
    try {

        const whatsapp = await NumeroWhatsapp.findOne({
            where: {
                from: from
            }
        });

        if(whatsapp) {
            return res.json({message: "from ya existe"});
        }

        const newWhatsapp = await NumeroWhatsapp.create({
            from,
            nameContact
        });

        return res.json(newWhatsapp);

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const addContact = async (req, res) => {
    const { numero, name, plataforma_contacto, tipo_contacto, clickAsignar, asignado, idPlantilla, variables } = req.body;
    try {
        const id = req.usuarioToken._id;
        const rol = req.usuarioToken._role;

        const whatsapp = await NumeroWhatsapp.findOne({
            where: {
                from: numero
            }
        });

        if(whatsapp) {
            return res.json({message: "existe", data: 'El número de whatsapp ya existe'});
        }

        let nameW = "";

        if(name === '') {
            nameW = numero
        } else {
            nameW = name;
        }

        let asistente = "";

        if(rol != 2) {
            if(clickAsignar == 1) {
                const asignar = await asignarAsistente();
                asistente = asignar.id;
            } else {
                asistente = asignado;
            }
        } else {
            asistente = id;
        }

        const newWhatsapp = await NumeroWhatsapp.create({
            from: numero,
            nameContact: nameW,
            asistente: asistente,
            plataforma_id: plataforma_contacto,
            tipo_contacto: tipo_contacto
        });

        const newPotencial = await PotencialCliente.create({
            nombres: name,
            apellidos: "",
            fecha_ingreso: new Date(),
            fecha_registro: new Date(),
            prefijo_celular: 51,
            numero_celular: 51,
            prefijo_whatsapp: 51,
            numero_whatsapp: numero
        });

        const potEtiqueta = await EtiquetaCliente.create({
            cliente_id: newPotencial.id,
            etiqueta_id: 1,
            estado: 1
        });

        const newAsignacion = await Asignacion.create({
            fecha_asignacion: new Date(),
            estado: 1,  // o el estado que corresponda
            trabajadoreId: asistente,
            potencialClienteId: newPotencial.id
            
        });

        const dataAsistente = await Trabajadores.findOne({
            where: {
                id: asistente
            }
        });

        //enviar la plantilla al numero

        try {
            let contenJson = "";
            let contenido = "";

            const plantilla = await Plantilla.findOne({
                where: {
                    id: idPlantilla
                }
            });

            if(variables.length == 0) {
                contenJson = {
                    "messaging_product": "whatsapp",
                    "recipient_type": "individual",
                    "to": numero,
                    "type": "template",
                    "template": {
                      "name": plantilla.nombre,
                      "language": { "code": "es" }
                    }
                };

                contenido = plantilla.contenido;
            } else {
                //aca validar cuando el id de la plantilla es 3, para sacar el nombre y el apellido dinamicamente

                let parametros_body = [];

                if(idPlantilla == 3) {

                    let dataNombre = {
                        type: "text",
                        text: dataAsistente.nombres
                    };

                    let dataApellidos = {
                        type: "text",
                        text: dataAsistente.apellidos
                    }

                    parametros_body.push(dataNombre);
                    parametros_body.push(dataApellidos);
                } else {
                    for (let i = 0; i < variables.length; i++) {
                        let parametro = {
                            type: "text",
                            text: variables[i],
                        };
    
                        parametros_body.push(parametro);
                        
                    }
                }

                contenJson = {
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

                const messageSend = plantilla.contenido;

                contenido = reemplazarMarcadoresConArray(messageSend, variables);

            }

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: process.env.URL_MESSAGES,
                headers: { 
                  'Authorization': 'Bearer '+process.env.TOKEN_WHATSAPP
                },
                data: contenJson
            };

            const response = await axios(config);

            const data = response.data;

            const messageStatus = data.messages[0].message_status;

            if(messageStatus === 'accepted') {

                const newMessage = await Chat.create({
                    codigo: data.messages[0].id,
                    from: process.env.NUMERO_WHATSAPP,
                    message: contenido,
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


        } catch (error) {
            return res.status(400).json({ message: error.message });
        }

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const getContacts = async (req, res) => {
    const { buscar } = req.body;
    try {
        const rol = req.usuarioToken._role;
        const id = req.usuarioToken._id;

        let contactos = "";

        if(rol === 2 || rol === 6) {
            contactos = await NumeroWhatsapp.findAll({
                where: {
                    asistente: id,
                    [Op.or]: [
                        {
                          nameContact: {
                            [Op.iLike]: `%${buscar}%`
                          }
                        },
                        {
                          from: {
                            [Op.like]: `%${buscar}%`
                          }
                        }
                    ]
                }
            });
        } else {
            contactos = await NumeroWhatsapp.findAll({
                where: {
                    [Op.or]: [
                        {
                          nameContact: {
                            [Op.iLike]: `%${buscar}%`
                          }
                        },
                        {
                          from: {
                            [Op.like]: `%${buscar}%`
                          }
                        }
                    ]
                }
            });
        }

        let arrayContact = [];

        for (const contacto of contactos) {

            const potencial = await PotencialCliente.findOne({
                where: {
                    numero_whatsapp: contacto.from
                }
            });

            const idp = potencial.id;

            const etiqueta = await EtiquetaCliente.findOne({
                where: {
                    cliente_id: idp,
                    estado: 1
                }
            });

            const eti = await Etiqueta.findOne({
                where: {
                    id: etiqueta.etiqueta_id
                }
            });

            let array = {
                numero: contacto.from,
                name: contacto.nameContact,
                nameEtiqueta: eti.descripcion,
                potencial: idp,
                etiqueta_id: etiqueta.etiqueta_id,
                rol: rol,
                asistente: contacto.asistente

            };

            arrayContact.push(array);
        }

        return res.json({ message: 'ok', data:arrayContact });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const editContact = async (req, res) => {
    const { nombre_contacto, whatsapp } = req.body;
    try {

        const rol = req.usuarioToken._role;
        const id = req.usuarioToken._id;

        const potencial = await PotencialCliente.findOne({
            where: {
                numero_whatsapp: whatsapp
            }
        });

        const idpotencial = potencial.id;

        const etiqCliente = await EtiquetaCliente.findOne({
            where: {
                cliente_id: idpotencial,
                estado: 1
            }
        });

        const etiqueta = await Etiqueta.findOne({
            where: {
                id: etiqCliente.etiqueta_id
            }
        });

        const updatePotencial = await PotencialCliente.update({ nombres: nombre_contacto }, {
            where: { id: idpotencial }
        });

        const actualizar = await NumeroWhatsapp.update({ nameContact: nombre_contacto }, {
            where: { from: whatsapp }
        });

        const contacto = await NumeroWhatsapp.findOne({
            where: {
                from: whatsapp
            }
        });

        const datos = {
            potencial_id: idpotencial,
            etiqueta: etiqueta.descripcion,
            etiqueta_id: etiqueta.id,
            rol: rol,
            idAsistente: contacto.asistente
        };

        return res.json({ message: 'ok', data:contacto, datos: datos });


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

//chatDetail('${contact.numero}','${nameContact}', '${contact.etiqueta}', ${contact.potencial_id}, ${contact.etiqueta_id}, ${rol}, ${contact.idAsistente})

/*let array = {
    numero: from,
    contact: name.nameContact,
    mensaje: mensa.message,
    estado: mensa.estadoMessage,
    time: time,
    cantidad: chatCount,
    asistente: nameAsistente,
    idAsistente: idAsis,
    rol: rol,
    etiqueta: eti.descripcion,
    potencial_id: idpotencial,
    etiqueta_id: idetiqueta
}*/