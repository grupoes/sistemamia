import { sequelize } from "../database/database.js";

import { NumeroWhatsapp } from "../models/numerosWhatsapp.js";
import { PotencialCliente } from "../models/potencialCliente.js";
import { EtiquetaCliente } from "../models/etiquetaCliente.js";
import { Etiqueta } from "../models/etiquetas.js";
import { Asignacion } from "../models/asignacion.js";
import { Plantilla } from "../models/plantilla.js";
import { Chat } from "../models/chat.js";
import { Emojis } from "../models/emojis.js";
import { Publicidad } from "../models/publicidad.js";
import { WahtasappVentas } from "../models/whatsappVentas.js";
import { SeguimientoContacto } from "../models/seguimientoContacto.js";
import { Notification } from "../models/notification.js";

import { asignarAsistenteData } from "./base.controller.js";
import { jsonTemplate } from "./apisWhatsapp.controller.js";

import path from 'path';
import fs from 'fs';

import { promisify } from 'util';

import { exec } from 'child_process';

import { Op } from 'sequelize';

import axios from 'axios';
import { Trabajadores } from "../models/trabajadores.js";
import { Usuario } from "../models/usuario.js";

export const addWhatsapp = async (req, res) => {
    const { from, nameContact } = req.body;
    try {

        const whatsapp = await NumeroWhatsapp.findOne({
            where: {
                from: from
            }
        });

        if (whatsapp) {
            return res.json({ message: "from ya existe" });
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
    const { numero, name, plataforma_contacto, tipo_contacto, clickAsignar, asignado, idPlantilla, variables, numerosWht, tipoW, tipoPublicidad, publicidad, carrera, plantillaCheck, etiquetaCliente } = req.body;

    try {
        const id = req.usuarioToken._id;
        const rol = req.usuarioToken._role;

        const whatsapp = await NumeroWhatsapp.findOne({
            where: {
                from: numero
            }
        });

        if (whatsapp) {
            return res.json({ message: "existe", data: 'El número de whatsapp ya existe' });
        }

        let nameW = "";

        if (name === '') {
            nameW = numero
        } else {
            nameW = name;
        }

        let asistente = "";

        if (rol != 2) {
            if (clickAsignar == 1) {
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
            user_register: id,
            tipo_publicidad: tipoPublicidad,
            publicidad: publicidad,
            numberWhatsapp: numerosWht,
            tipoWhatsapp: tipoW
        });

        const newPotencial = await PotencialCliente.create({
            nombres: name,
            apellidos: "",
            fecha_ingreso: new Date(),
            fecha_registro: new Date(),
            prefijo_celular: 51,
            numero_celular: 51,
            prefijo_whatsapp: 51,
            numero_whatsapp: numero,
            carrera: carrera
        });

        const potEtiqueta = await EtiquetaCliente.create({
            cliente_id: newPotencial.id,
            etiqueta_id: etiquetaCliente,
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

        if(plantillaCheck == 1) {
            //enviar la plantilla al numero
            let contenJson = "";
            let contenido = "";

            const plantilla = await Plantilla.findOne({
                where: {
                    id: idPlantilla
                }
            });

            let tipoMensaje = "";

            if(plantilla.tipoCabecera === 'no') {
                tipoMensaje = "text";
            } else if(plantilla.tipoCabecera === 'image') {
                tipoMensaje = "image";
            } else if(plantilla.tipoCabecera === 'video') {
                tipoMensaje = "video";
            } else {
                tipoMensaje = "document";
            }

            let parametros_body = [];

            if (idPlantilla == 3) {

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

                if(variables.length > 0) {
                    for (let i = 0; i < variables.length; i++) {
                        let parametro = {
                            type: "text",
                            text: variables[i],
                        };
        
                        parametros_body.push(parametro);
        
                    }
                }

            }

            const messageSend = plantilla.contenido;

            contenido = reemplazarMarcadoresConArray(messageSend, variables);

            let descripcionChat = "";
            let contenidoChat = contenido;

            if (plantilla.cabecera === 'si') {
                descripcionChat = contenido;
                contenidoChat = "";
            }

            const jsonData = jsonTemplate(plantilla.tipoCabecera, numero, plantilla.nombre, plantilla.url_cabecera, parametros_body);

            const newMessage = await Chat.create({
                codigo: "",
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
                idRes: "",
                dataJson: jsonData
            });

            try {

                //return res.json({ data: jsonData });

                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: process.env.URL_MESSAGES,
                    headers: {
                        'Authorization': 'Bearer ' + process.env.TOKEN_WHATSAPP
                    },
                    data: jsonData
                };

                const response = await axios(config);

                const data = response.data;

                //return res.json(data);

                //const messageStatus = data.messages[0].message_status;

                if (data.messages[0]) {

                    const updateChat = await Chat.update({ codigo: data.messages[0].id }, {
                        where: { id: newMessage.id }
                    });

                    return res.json({ message: 'ok', data: newMessage });

                } else {
                    return res.json({ message: "No fue enviado la plantilla" });
                }


            } catch (error) {
                const updateChat = await Chat.update({ estadoMessage: "tmpNo" }, {
                    where: { id: newMessage.id }
                });

                return res.status(400).json({ message: error.message });
            }
        } else {
            return res.json({ message: 'ok', data: "" });
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

        let sql = "";

        if(rol === 2 || rol === 6) {
            sql = `and nw.asistente = ${id}`;
        }

        const query = `
        select nw."from", nw."nameContact", concat(t.nombres, ' ', t.apellidos) as asistente 
        from numeros_whatsapp nw inner join trabajadores t on t.id = nw.asistente
        where (nw."from" like '%${buscar}%' or nw."nameContact" ilike '%${buscar}%') ${sql}
        order by nw."createdAt" desc
        `;

        const results = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT,
            raw: true,
            nest: true,
        });

        return res.json({ message: 'ok', data: results });

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

        return res.json({ message: 'ok', data: contacto, datos: datos });


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

        if (plataforma == 0) {

            if (rol == 2 || rol == 6) {
                contactos = await NumeroWhatsapp.findAll({
                    where: {
                        asistente: user.trabajador_id,
                        [Op.and]: [
                            sequelize.where(sequelize.fn('DATE', sequelize.col('createdAt')), '>=', dateInit),
                            sequelize.where(sequelize.fn('DATE', sequelize.col('createdAt')), '<=', dateEnd)
                        ]
                    },
                    order: [
                        ['createdAt', 'ASC']
                    ]
                });
            } else {
                contactos = await NumeroWhatsapp.findAll({
                    where: {
                        [Op.and]: [
                            sequelize.where(sequelize.fn('DATE', sequelize.col('createdAt')), '>=', dateInit),
                            sequelize.where(sequelize.fn('DATE', sequelize.col('createdAt')), '<=', dateEnd)
                        ]
                    },
                    order: [
                        ['createdAt', 'ASC']
                    ]
                });
            }


        } else {

            if (rol == 2 || rol == 6) {
                contactos = await NumeroWhatsapp.findAll({
                    where: {
                        plataforma_id: plataforma,
                        asistente: user.trabajador_id,
                        [Op.and]: [
                            sequelize.where(sequelize.fn('DATE', sequelize.col('createdAt')), '>=', dateInit),
                            sequelize.where(sequelize.fn('DATE', sequelize.col('createdAt')), '<=', dateEnd)
                        ]
                    },
                    order: [
                        ['createdAt', 'ASC']
                    ]
                });

            } else {
                contactos = await NumeroWhatsapp.findAll({
                    where: {
                        plataforma_id: plataforma,
                        [Op.and]: [
                            sequelize.where(sequelize.fn('DATE', sequelize.col('createdAt')), '>=', dateInit),
                            sequelize.where(sequelize.fn('DATE', sequelize.col('createdAt')), '<=', dateEnd)
                        ]
                    },
                    order: [
                        ['createdAt', 'ASC']
                    ]
                });
            }


        }

        let datos = [];

        for (const contacto of contactos) {
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

            if (contacto.asistente == null || contacto.asistente == "") {
                nombreAsistente = "";
            } else {
                const asistente = await Trabajadores.findOne({
                    where: {
                        id: contacto.asistente
                    }
                });

                nombreAsistente = asistente.nombres + " " + asistente.apellidos;
            }

            let usuario_register;

            if (contacto.user_register == null || contacto.user_register == "") {
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

                usuario_register = tra.nombres + " " + tra.apellidos;
            }

            let origen = "";
            let tipo_origen = "";

            if (contacto.plataforma_id == 4) {
                if (contacto.tipo_publicidad != null && contacto.tipo_publicidad != 0) {
                    if (contacto.tipo_publicidad == "1") {
                        tipo_origen = "Publicidad Paga Facebook";

                        const publi = await Publicidad.findOne({
                            where: {
                                id: contacto.publicidad
                            }
                        });

                        origen = publi.nombre;

                    } else {
                        tipo_origen = "Publicidad Orgánica Facebook";
                    }
                }
            }

            if (contacto.numberWhatsapp != null && contacto.numberWhatsapp != 0) {
                const nameWhatsapp = await WahtasappVentas.findOne({
                    where: {
                        id: contacto.numberWhatsapp
                    }
                });

                tipo_origen = nameWhatsapp.numero + " - " + nameWhatsapp.nombre;

                if (contacto.tipoWhatsapp == 1) {
                    origen = "Recomendados";
                } else if (contacto.tipoWhatsapp == 2) {
                    origen = "Recompra";
                } else if (contacto.tipoWhatsapp == 3) {
                    origen = "Directo";
                } else if (contacto.tipoWhatsapp == 4) {
                    origen = "Publicidad Online";
                } else {
                    origen = "Otros";
                }
            }

            const arrayExtra = {
                nameEtiqueta: etiqueta.descripcion,
                potencial_id: idPotencial,
                etiqueta_id: idEtiqueta,
                rol: rol,
                asistente: nombreAsistente,
                user_register: usuario_register,
                tipo_origen: tipo_origen,
                origen: origen
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

        if (typeMessage === 'audio') {
            let inputPath = "";
            let fileName = "";
            if (sendType === "0") {
                inputPath = path.join(process.cwd(), 'src', 'public', 'audios', 'archivos', mensaje.id_document + '.ogg');

                // Definir la ruta de salida
                const outputPath = path.join(process.cwd(), 'src', 'public', 'audios', 'archivos', timestamp + '.mp3');

                // Ejecutar el comando ffmpeg
                await execAsync(`ffmpeg -i ${inputPath} ${outputPath}`);

                fileName = timestamp + ".mp3";
            } else {
                inputPath = path.join(process.cwd(), 'src', 'public', 'audios', 'archivos', mensaje.filename);
                fileName = mensaje.filename;
            }

            let url_audio = "";

            if (sendType === "0") {
                url_audio = process.env.URL_APP + ":" + process.env.PUERTO_APP_RED + "/audios/archivos/" + timestamp + ".mp3";
            } else {
                url_audio = process.env.URL_APP + ":" + process.env.PUERTO_APP_RED + "/audios/archivos/" + mensaje.filename;
            }

            /* const datos = {
                type: sendType,
                fileName: fileName,
                url_audio: url_audio
            };

            return res.json({ message: 'ok', data: datos }); */


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
                    'Authorization': 'Bearer ' + process.env.TOKEN_WHATSAPP
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

                return res.json({ mensaje: 'ok', subido: 'Archivo subido con éxito.', datos: dataFile, api: datos, newMensaje: new_message });
            }
            catch (error) {
                console.error("Error in making request:", error.response.data || error.message);
                return res.json({ message: error.message });
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

const eliminarContacto = async (req, res) => {
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

export const emojisAll = async (req, res) => {

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

export const addSeguimiento = async (req, res) => {
    const { numeroContacto, descripcion_seguimiento } = req.body;
    try {

        let fecha = "1970-01-01 19:00:00";
        let notificado = "";

        if (req.body.notificarSeguimiento) {
            fecha = req.body.notificar_fecha;
            notificado = "SI";

        }

        const add = {
            description: descripcion_seguimiento,
            status: "activo",
            fecha: new Date(fecha).toISOString(),
            notificado: notificado,
            numero: numeroContacto
        };

        //return res.json(add);

        const newSeguimiento = await SeguimientoContacto.create(add);

        if (notificado === 'SI') {
            const dataContacto = await NumeroWhatsapp.findOne({
                where: {
                    from: numeroContacto
                }
            });

            const notificacion = {
                description: descripcion_seguimiento,
                status: "activo",
                fecha: new Date(fecha).toISOString(),
                url: "",
                numero: numeroContacto,
                contacto: dataContacto.nameContact,
                estado: "activo",
                id_user: dataContacto.asistente
            };

            const addNotification = await Notification.create(notificacion);
        }

        return res.json({ message: 'ok', response: newSeguimiento });

    } catch (error) {
        return res.status(400).json({ message: 'error', response: error.message });
    }
}

export const allSeguimiento = async (req, res) => {
    try {
        const numero = req.params.id;

        const all = await SeguimientoContacto.findAll({
            where: {
                numero: numero
            }
        });

        return res.json({ message: 'ok', response: all });

    } catch (error) {
        return res.status(400).json({ message: 'error', response: error.message });
    }
}

export const listaSeguimientos = async (req, res) => {
    try {
        const contactos = await NumeroWhatsapp.findAll();

        for (const contacto of contactos) {
            let numero = contacto.from;

            let potencial = await PotencialCliente.findOne({
                where: {
                    numero_whatsapp: numero
                }
            });

            let carrera = potencial.carrera;

            let seguimientos = await SeguimientoContacto.findAll({
                where: {
                    numero: numero
                }
            });

            let trabajador = "";

            if (contacto.asistente === null) {
                trabajador = "";
            } else {
                let asistente = await Trabajadores.findOne({
                    where: {
                        id: contacto.asistente
                    }
                });

                trabajador = asistente.nombres + " " + asistente.apellidos;
            }

            const etiquetaActual = await EtiquetaCliente.findOne({
                where: {
                    estado: 1,
                    cliente_id: potencial.id
                }
            });

            let nameEtiqueta = "";

            if(etiquetaActual) {
                const etiqueta = etiquetaActual.etiqueta_id;

                const dataEtiqueta = await Etiqueta.findOne({
                    where: {
                        id: etiqueta
                    }
                });

                nameEtiqueta = dataEtiqueta.descripcion;
            }

            const arrayExtra = {
                carrera: carrera,
                seguimientos: seguimientos,
                asistente: trabajador,
                nameEtiqueta: nameEtiqueta
            };

            let estadoObject = contacto.get({ plain: true });

            estadoObject.arrayExtra = arrayExtra;
        }

        return res.json({ message: 'ok', response: contactos });

    } catch (error) {
        return res.status(400).json({ message: 'error', response: error.message });
    }
    
}


export const deleteSeguimiento = async (req, res) => {
    try {
        const id = req.params.id;

        const seg = await SeguimientoContacto.findByPk(id);

        const del = await seg.destroy();

        return res.json({ message: 'ok', response: del });

    } catch (error) {
        return res.status(400).json({ message: 'error', response: error.message });
    }
}

export const notificationContacto = async (req, res) => {
    try {
        const id = req.usuarioToken._id;
        const role = req.usuarioToken._role;

        let fecha_actual = new Date();

        fecha_actual = fecha_actual.toISOString().split('T');

        fecha_actual = fecha_actual[0];

        let array = [];

        const notificaciones = await Notification.findAll();

        //return res.json(fecha_actual);

        for (const notificacion of notificaciones) {
            let fecha_noti = notificacion.fecha;
            fecha_noti = fecha_noti.toISOString().split('T');

            fecha_noti = fecha_noti[0];

            let dataAsist = await Trabajadores.findOne({
                where: {
                    id: notificacion.id_user
                }
            });

            let potencial = await PotencialCliente.findOne({
                where: {
                    numero_whatsapp: notificacion.numero
                }
            });

            let idpotencial = potencial.id;

            let etiquetaC = await EtiquetaCliente.findOne({
                where: {
                    cliente_id: idpotencial,
                    estado: 1
                }
            });

            let idetiqueta = etiquetaC.etiqueta_id;

            let eti = await Etiqueta.findOne({
                where: {
                    id: idetiqueta
                }
            });

            //chatDetail(numero, name, etiqueta, potencial, etiqueta_id, rol, asignado, asistente)

            let add = {
                descripcion: notificacion.description,
                fecha: fecha_noti,
                contacto: notificacion.contacto,
                user: notificacion.id_user,
                numero: notificacion.numero,
                nombre: dataAsist.nombres + " " + dataAsist.apellidos,
                role: role,
                etiquetaName: eti.descripcion,
                potencial: idpotencial,
                etiqueta_id: idetiqueta
            };

            array.push(add);
        }

        let contactos = "";

        if (role == 1 || role == 3) {
            contactos = array.filter(item => item.fecha === fecha_actual);
        } else {
            contactos = array.filter(item => item.fecha === fecha_actual && item.user == id);
        }

        return res.json(contactos);

    } catch (error) {
        return res.status(400).json({ message: 'error', response: error.message });
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