import { sequelize } from "../database/database.js";

import { NumeroWhatsapp } from "../models/numerosWhatsapp.js";
import { PotencialCliente } from "../models/potencialCliente.js";
import { EtiquetaCliente } from "../models/etiquetaCliente.js";
import { Etiqueta } from "../models/etiquetas.js";
import { Asignacion } from "../models/asignacion.js";
import { Plantilla } from "../models/plantilla.js";
import { Chat } from "../models/chat.js";
import { Emojis } from "../models/emojis.js";

import { asignarAsistenteData } from "./base.controller.js";

import path from 'path';
import fs from 'fs';

import { promisify } from 'util';

import { exec } from 'child_process';

import { Op } from 'sequelize';

import axios from 'axios';
import { Trabajadores } from "../models/trabajadores.js";
import { Usuario } from "../models/usuario.js";

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
                const asignar = await asignarAsistenteData();
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
            tipo_contacto: tipo_contacto,
            user_register: id
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

            let tipoMensaje = "";

            if(variables.length == 0) {

                if(plantilla.cabecera === 'si') {
                    if(plantilla.tipoCabecera === 'video') {
                        contenJson = {
                            "messaging_product": "whatsapp",
                            "recipient_type": "individual",
                            "to": numero,
                            "type": "template",
                            "template": {
                              "name": plantilla.nombre,
                              "language": { "code": "es" },
                              "components" : [
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
                                }
                              ]
                            }
                        };

                        tipoMensaje = 'video';
                    }

                    if(plantilla.tipoCabecera === 'image') {
                        contenJson = {
                            "messaging_product": "whatsapp",
                            "recipient_type": "individual",
                            "to": numero,
                            "type": "template",
                            "template": {
                              "name": plantilla.nombre,
                              "language": { "code": "es" },
                              "components" : [
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
                                }
                              ]
                            }
                        };

                        tipoMensaje = 'image';
                    }

                } else {
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

                    tipoMensaje = 'text';
                }

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

                if(plantilla.cabecera === 'no') {
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

                    tipoMensaje = 'text';
                } else {
                    if(plantilla.cabecera === 'video') {
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

                    if(plantilla.cabecera === 'image') {
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
                }

                

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

                let descripcionChat = "";
                let contenidoChat = contenido;

                if(plantilla.cabecera === 'si') {
                    descripcionChat = contenido;
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
                    estadoMessage: "sent",
                    description: descripcionChat,
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
            let nombreAsistente = "";

            if(contacto.asistente == null) {
                
            } else {
                const nameUsuario = await Trabajadores.findOne({
                    where: {
                        id: contacto.asistente
                    }
                });

                nombreAsistente = nameUsuario.nombres+" "+nameUsuario.apellidos;
            }

            let array = {
                numero: contacto.from,
                name: contacto.nameContact,
                nameEtiqueta: eti.descripcion,
                potencial: idp,
                etiqueta_id: etiqueta.etiqueta_id,
                rol: rol,
                asistente: contacto.asistente,
                nameAsistente: nombreAsistente

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

        let nombreAsistente = "";

        if (contacto.asistente == null) {
            
        } else {
            const usuario = await Trabajadores.findOne({
                where: {
                    id: contacto.asistente
                }
            });

            nombreAsistente = usuario.nombres + " " + usuario.apellidos;
        }

        const datos = {
            potencial_id: idpotencial,
            etiqueta: etiqueta.descripcion,
            etiqueta_id: etiqueta.id,
            rol: rol,
            idAsistente: contacto.asistente,
            nameAsistente: nombreAsistente
        };

        return res.json({ message: 'ok', data:contacto, datos: datos });


    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const FiltroContact = async (req, res) => {
    const { dateInit, dateEnd, plataforma } = req.body;
    try {

        const rol = req.usuarioToken._role;
        const id = req.usuarioToken._id;
        
        let contactos = "";

        const user = await Usuario.findOne({
            where: {
                id: id
            }
        });

        if(plataforma == 0) {

            if(rol == 2 || rol == 6) {
                contactos = await NumeroWhatsapp.findAll({
                    where: {
                        asistente: user.trabajador_id,
                        [Op.and]: [
                            sequelize.where(sequelize.fn('DATE', sequelize.col('createdAt')), '>=', dateInit),
                            sequelize.where(sequelize.fn('DATE', sequelize.col('createdAt')), '<=', dateEnd)
                        ]
                    }
                });
            } else {
                contactos = await NumeroWhatsapp.findAll({
                    where: {
                        [Op.and]: [
                            sequelize.where(sequelize.fn('DATE', sequelize.col('createdAt')), '>=', dateInit),
                            sequelize.where(sequelize.fn('DATE', sequelize.col('createdAt')), '<=', dateEnd)
                        ]
                    }
                });
            }

            
        } else {

            if(rol == 2 || rol == 6) {
                contactos = await NumeroWhatsapp.findAll({
                    where: {
                        plataforma_id: plataforma,
                        asistente: user.trabajador_id,
                        [Op.and]: [
                            sequelize.where(sequelize.fn('DATE', sequelize.col('createdAt')), '>=', dateInit),
                            sequelize.where(sequelize.fn('DATE', sequelize.col('createdAt')), '<=', dateEnd)
                        ]
                    }
                });

            } else {
                contactos = await NumeroWhatsapp.findAll({
                    where: {
                        plataforma_id: plataforma,
                        [Op.and]: [
                            sequelize.where(sequelize.fn('DATE', sequelize.col('createdAt')), '>=', dateInit),
                            sequelize.where(sequelize.fn('DATE', sequelize.col('createdAt')), '<=', dateEnd)
                        ]
                    }
                });
            }

            
        }

        let datos = [];

        for(const contacto of contactos) {
            const potencial = await PotencialCliente.findOne({
                where: {
                    numero_whatsapp: contacto.from
                }
            });

            const idPotencial = potencial.id;

            const etiPotencial = await EtiquetaCliente.findOne({
                where: {
                    cliente_id: idPotencial,
                    estado: 1
                }
            });

            const idEtiqueta = etiPotencial.etiqueta_id;

            const etiqueta = await Etiqueta.findOne({
                where: {
                    id: idEtiqueta
                }
            });
            
            let nombreAsistente;

            if(contacto.asistente == null || contacto.asistente == "") {
                nombreAsistente = "";
            } else {
                const asistente = await Trabajadores.findOne({
                    where: {
                        id: contacto.asistente
                    }
                });

                nombreAsistente = asistente.nombres+" "+asistente.apellidos;
            }

            let usuario_register;

            if(contacto.user_register == null || contacto.user_register == "") {
                usuario_register = "";
            } else {
                const usuario = await Usuario.findOne({
                    where: {
                        id: contacto.user_register
                    }
                });

                const tra = await Trabajadores.findOne({
                    where: {
                        id: usuario.trabajador_id
                    }
                });

                usuario_register = tra.nombres+" "+tra.apellidos;
            }

            const arrayExtra = {
                nameEtiqueta: etiqueta.descripcion,
                potencial_id: idPotencial,
                etiqueta_id: idEtiqueta,
                rol: rol,
                asistente: nombreAsistente,
                user_register: usuario_register
            };

            let estadoObject = contacto.get({ plain: true });

            estadoObject.arrayExtra = arrayExtra;
        }

        return res.json({ message: 'ok', data: contactos });
        
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const getContactos = async (req, res) => {
    const { buscar } = req.body;
    try {
        const contactos = await NumeroWhatsapp.findAll({
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

        return res.json({ message: 'ok', data: contactos });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const execAsync = promisify(exec);

export const reenviarMensaje = async (req, res) => {
    const { codigo, contacto, sendType } = req.body;
    try {
        const mensaje = await Chat.findOne({
            where: {
                codigo: codigo
            }
        });

        const typeMessage = mensaje.typeMessage;

        const timestamp = Date.now();

        if(typeMessage === 'audio') {
            let inputPath = "";
            let fileName = "";
            if(sendType === 0) {
                inputPath = path.join(process.cwd(), 'src','public','audios','archivos', mensaje.id_document + '.ogg');

                // Definir la ruta de salida
                const outputPath = path.join(process.cwd(), 'src','public','audios','archivos', timestamp + '.mp3');

                // Ejecutar el comando ffmpeg
                await execAsync(`ffmpeg -i ${inputPath} ${outputPath}`);

                fileName = timestamp+".mp3";
            } else {
                inputPath = path.join(process.cwd(), 'src','public','audios','archivos', mensaje.filename);
                fileName = mensaje.filename;
            }

            let url_audio = "";

            if(sendType === 0) {
                url_audio = process.env.URL_APP+":"+process.env.PUERTO_APP_RED+"/audios/archivos/"+timestamp+".mp3";
            } else {
                url_audio = process.env.URL_APP+":"+process.env.PUERTO_APP_RED+"/audios/archivos/"+mensaje.filename;
            }

            const datos = {
                type: sendType,
                fileName: fileName,
                url_audio: url_audio
            };

            return res.json({ message: 'ok', data: datos });

        
            const dataFile = {
                messaging_product: "whatsapp",
                to: contacto,
                type: 'audio',
                audio: {
                    link: url_audio
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
    
            try {
                const response = await axios(config);
                const datos = response.data;
    
                const new_message = await Chat.create({
                    codigo: datos.messages[0].id,
                    from: process.env.NUMERO_WHATSAPP,
                    message: "",
                    nameContact: "",
                    receipt: contacto,
                    timestamp: Math.floor(Date.now() / 1000),
                    typeMessage: "audio",
                    estadoMessage: "sent",
                    documentId: "",
                    id_document: Math.floor(Date.now() / 1000),
                    filename: fileName
                });
    
                return res.json({ mensaje: 'ok',subido: 'Archivo subido con éxito.', datos: dataFile, api: datos, newMensaje: new_message });
            }
              catch (error) {
                console.error("Error in making request:", error.response.data || error.message);
                return res.json({message: error.message});
            }
        }

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

const eliminarContacto = async(req, res) => {
    const id = req.params.id;
    try {
        const contacto = await NumeroWhatsapp.findByPk(id);

        // Verificar que el usuario exista antes de eliminar
        if (!contacto) {
            throw new Error('Contacto no existe'); 
        }

        // Eliminar el registro
        await contacto.destroy();

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const emojisAll = async(req, res) => {

    try {
       
        const emojis = await Emojis.findAll({
            where: {
                estado: "1"
            }
        });

        return res.status(200).json({ message: 'ok', data: emojis });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
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