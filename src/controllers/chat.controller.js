import { sequelize } from "../database/database.js";
import { Chat } from "../models/chat.js";
import { NumeroWhatsapp } from "../models/numerosWhatsapp.js";
import { PotencialCliente } from "../models/potencialCliente.js";
import { Trabajadores } from "../models/trabajadores.js";
import { Asignacion } from "../models/asignacion.js";
import { EtiquetaCliente } from "../models/etiquetaCliente.js";
import { Etiqueta } from "../models/etiquetas.js";
import { Embudo } from "../models/embudo.js";
import { Chat_estados } from "../models/estadosConversacion.js";
import { Plataforma } from "../models/plataforma.js";
import { FraseFinChat } from "../models/fraseFinChat.js";

import { asignarAsistenteData, registroActividad } from "./base.controller.js";

import { Op, literal } from 'sequelize';

import axios from 'axios';
import path from 'path';
import fs from 'fs';

import { exec } from 'child_process';
import { promisify } from 'util';

import ffmpeg from 'fluent-ffmpeg';

import { createWriteStream } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import multer from 'multer';

const storageAudio = multer.memoryStorage();
const uploadVoz = multer({ storage: storageAudio });

import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


dotenv.config();

export const chatView = async (req, res) => {
    const timestamp = Date.now();
    const url_chat = process.env.URL_APP+":"+process.env.SOCKET_RED;
    const dominio = process.env.URL_APP+":"+process.env.PUERTO_APP_RED;
    const js = [
        'assets/libs/datatables.net/js/jquery.dataTables.min.js',
        'assets/libs/datatables.net-bs4/js/dataTables.bootstrap4.min.js',
        'assets/libs/datatables.net-buttons/js/dataTables.buttons.min.js',
        'assets/libs/datatables.net-buttons-bs4/js/buttons.bootstrap4.min.js',
        'assets/libs/datatables.net-buttons/js/buttons.html5.min.js',
        'assets/libs/datatables.net-buttons/js/buttons.print.min.js',
        'https://cdn.datatables.net/buttons/2.4.2/js/dataTables.buttons.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js',
        'https://cdn.datatables.net/buttons/2.4.2/js/buttons.html5.min.js',
        'https://cdn.jsdelivr.net/npm/toastify-js',
        url_chat+'/socket.io/socket.io.js',
        url_chat+'/js/chat.js'+ '?t=' + timestamp,
        'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.all.min.js'
    ];

    const css = [
        'assets/libs/datatables.net-bs4/css/dataTables.bootstrap4.min.css',
        'https://cdn.datatables.net/buttons/2.4.2/css/buttons.dataTables.min.css',
        'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.min.css',
        'https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css'
    ];

    const embudo = await Embudo.findAll();
    const plataforma = await Plataforma.findAll();

    res.render('chat/index', { layout: 'partials/main', css, js, urlchat: url_chat, dominio: dominio, embudo: embudo, plataforma: plataforma });
}

const execAsync = promisify(exec);

export const getChatCodigo = async(req, res) => {
    const codigo = req.params.id;
    try {
        const chat = await Chat.findOne({
            where: {
                codigo: codigo
            }
        });

        return res.json(chat);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const mensajes_numero = async (req, res) => {
    const numero = req.params.id;

    try {
        const mensajes = await Chat.findAll({
            where: {
                id: {
                    [Op.in]: sequelize.literal(`(SELECT id FROM chat WHERE "from"='${numero}' OR receipt='${numero}' ORDER BY timestamp DESC)`)
                }
              },
            order: [
                ['timestamp', 'ASC'],
            ],
        });

        if (mensajes.length === 0) {
            return res.status(404).json({ message: 'No_hay', data: 'No se encontraron mensajes' });
        }

        for (let mensaje of mensajes) {
            if (mensaje.idRes) {
                const mensajeIdRes = await Chat.findOne({ where: { codigo: mensaje.idRes } });
                if (mensajeIdRes) {
                    let plainObject = mensaje.get({ plain: true });
                    // Agrega el mensajeIdRes como un nuevo campo 'mensajeRelacionado' en el objeto plainObject
                    plainObject.mensajeRelacionado = mensajeIdRes.get({ plain: true });
                }
            }

            if(mensaje.from === numero) {
                await Chat.update({ estadoMessage: 'read' }, {
                    where: { id: mensaje.id }
                });
            }

            if(mensaje.from == process.env.NUMERO_WHATSAPP) {
                const estadoMensaje = await Chat_estados.findOne({
                    where: {
                        codigo: mensaje.codigo
                    },
                    order: literal("CASE WHEN status = 'sent' THEN 1 WHEN status = 'delivered' THEN 2 WHEN status = 'read' THEN 3 END DESC")
                });

                if(estadoMensaje) {
                    let estadoObject = mensaje.get({ plain: true });
                    // Agrega el mensajeIdRes como un nuevo campo 'mensajeRelacionado' en el objeto plainObject
                    estadoObject.estadoMensaje = estadoMensaje.get({ plain: true });
                }
            }


        }

        return res.json({ message: 'ok', data: mensajes });

    } catch (error) {
        console.error('Error obteniendo los documentos', error);
        return res.status(500).json({ message: "error", data: 'Error interno del servidor.' });
    }
};

export const addMessageFirestore = async(req, res) => {
    const {from, id, message, nameContact, receipt, timestamp, type, documentId, id_document, filename, description, fromRes, idRes, source_url, source_id, source_type, body, headline, media_type, media_url, thumbnail_url, ctwa_clid} = req.body;
    try {

        console.log(req.body);

        if (type == 'image' || type == 'video' || type == 'document' || type == 'audio') {
            console.log("aca ")
            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: process.env.URL_META+""+id_document,
                headers: { 
                  'Authorization': 'Bearer '+process.env.TOKEN_WHATSAPP
                }
            };

            try {
                const response = await axios.request(config);
                const datos = response.data;

                const urlMedia = datos.url;

                let configu = {
                    method: 'get',
                    responseType: 'stream',
                    maxBodyLength: Infinity,
                    url: urlMedia,
                    headers: { 
                      'Authorization': 'Bearer '+process.env.TOKEN_WHATSAPP
                    }
                };

                try {
                    const resp = await axios.request(configu);

                    let rutaFile;

                    if(type == 'image') {
                        rutaFile = "./src/public/img/archivos/"+id_document+'.jpg';
                    }

                    if(type == 'video') {
                        rutaFile = "./src/public/videos/archivos/"+id_document+'.mp4';
                    }

                    if(type == 'document') {
                        rutaFile = "./src/public/documentos/archivos/"+filename;
                    }

                    if(type == 'audio') {
                        rutaFile = "./src/public/audios/archivos/"+id_document+'.ogg';
                    }

                    // Crea un write stream para guardar la respuesta en un archivo
                    const writer = createWriteStream(rutaFile); // Cambia 'output_file.ext' por el nombre y extensión adecuados

                    // Usa el stream de la respuesta para escribir en el archivo
                    resp.data.pipe(writer);

                    // Maneja los eventos del stream
                    writer.on('finish', () => {
                        console.log('Archivo guardado exitosamente.');
                    });

                    writer.on('error', (error) => {
                        console.error('Error al guardar el archivo:', error);
                    });

                    
                } catch (error) {
                    console.log(error);
                    return res.json(error.message + " fue aca");
                }

            } catch (error) {
                console.log(error.message);
                return res.json(error.message);
            }
        }

        const existe = await NumeroWhatsapp.findOne({
            where: {
                from: String(from)
            }
        });

        if(!existe) {
            const addN = await NumeroWhatsapp.create({
                from: from,
                nameContact: nameContact,
                plataforma_id: 1,
                tipo_contacto: 1,
                user_register: 0
            });
    
            const pot = await PotencialCliente.create({
                nombres: nameContact,
                apellidos: "",
                fecha_ingreso: new Date(),
                fecha_registro: new Date(),
                prefijo_celular: 51,
                numero_celular: 51,
                prefijo_whatsapp: 51,
                numero_whatsapp: from
            });

            const potEtiqueta = await EtiquetaCliente.create({
                cliente_id: pot.id,
                etiqueta_id: 1,
                estado: 1
            });
        }

        const newMessage = await Chat.create({
            codigo: id,
            from: from,
            message: message,
            nameContact: nameContact,
            receipt: receipt,
            timestamp: timestamp,
            typeMessage: type,
            estadoMessage: "sent",
            documentId: documentId,
            id_document: id_document,
            filename: filename,
            description: description,
            fromRes: fromRes,
            idRes: idRes,
            source_url: source_url, 
            source_id: source_id, 
            source_type: source_type, 
            body: body, 
            headline: headline, 
            media_type: media_type, 
            media_url: media_url, 
            thumbnail_url: thumbnail_url, 
            ctwa_clid: ctwa_clid
        });

        return res.json(newMessage);
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ message: error.message });
    }
}

export const updateLoadContact = async (req, res) => {
    const { etiqueta, plataforma_id, new_message } = req.body;
    try {
        const rol = req.usuarioToken._role;
        const id = req.usuarioToken._id;

        const numero = new_message.from;

        let numero_whatsapp = "";
        let icono_check = "";
        let codigo = "";

        if(numero != process.env.NUMERO_WHATSAPP) {
            numero_whatsapp = numero;
            icono_check = 0;
            codigo = new_message.codigo;
        } else {
            numero_whatsapp = new_message.receipt;
            icono_check = 1;
        }

        const numberWhatsapp = await NumeroWhatsapp.findOne({
            where: {
                from: numero_whatsapp
            }
        });

        const asistente = numberWhatsapp.asistente;

        let nombre_asistente = "";

        if (asistente != null || asistente == "") {
            const trabajador = await Trabajadores.findOne({
                where: {
                    id: asistente
                }
            });

            nombre_asistente = trabajador.nombres + " " + trabajador.apellidos;
        }

        let chatCount = await Chat.count({
            where: {
                from: numero_whatsapp,
                estadoMessage: "sent"
            }
        });

        let poten = await PotencialCliente.findOne({
            where: {
                numero_whatsapp: numero_whatsapp
            }
        });

        let idpotencial = poten.id;

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

        let estadoMensaje = "";

        if(numero_whatsapp != process.env.NUMERO_WHATSAPP) {
            const statusMessage = await Chat_estados.findOne({
                where: {
                    codigo: codigo
                },
                order: literal("CASE WHEN status = 'sent' THEN 1 WHEN status = 'delivered' THEN 2 WHEN status = 'read' THEN 3 END DESC")
            });

            if(statusMessage) {
                estadoMensaje = statusMessage.status;
            } else {
                estadoMensaje = 'read';
            }
                    
        }

        const datos = {
            nameAsistente: nombre_asistente,
            nameContacto: numberWhatsapp.nameContact,
            numero: numero_whatsapp,
            check: icono_check,
            plataforma: numberWhatsapp.plataforma_id,
            rol: rol,
            userId: id,
            cantidad: chatCount,
            etiqueta: eti.descripcion,
            potencial_id: idpotencial,
            etiqueta_id: idetiqueta,
            statusMessage: estadoMensaje,
            idAsistente: numberWhatsapp.asistente,
            message: new_message
        };

        return res.json({message: "ok", data: datos });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const numerosWhatsapp = async(req, res) => {
    const { etiqueta, plataforma_id } = req.body;
    try { 
        const rol = req.usuarioToken._role;
        const id = req.usuarioToken._id;

        let contactos = "";

        if(plataforma_id == 0) {
            contactos = await NumeroWhatsapp.findAll();
        } else {
            contactos = await NumeroWhatsapp.findAll({
                where: {
                    plataforma_id: plataforma_id
                }
            });
        }

        let array_ = [];

        for(const contacto of contactos) {
            const ultimoChat = await Chat.findOne({
                where: {
                    [Op.or]: [
                        { from: contacto.from },
                        { receipt: contacto.from }
                    ]
                },
                order: [
                    ['id', 'DESC']
                ]
            });

            if(ultimoChat) {

                let chatCount = await Chat.count({
                    where: {
                        from: contacto.from,
                        estadoMessage: "sent"
                    }
                });

                let idAsis = contacto.asistente;

                let asistente = await Trabajadores.findOne({
                    where: {
                        id: idAsis
                    }
                });

                let nameAsistente = ""

                if (asistente) {
                    nameAsistente = asistente.nombres+" "+asistente.apellidos;
                }

                let poten = await PotencialCliente.findOne({
                    where: {
                        numero_whatsapp: contacto.from
                    }
                });

                let idpotencial = poten.id;

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

                //verificamos en que estado esta el mensaje: sent, delivired and read

                let estadoMensaje = "";

                if(ultimoChat.from == process.env.NUMERO_WHATSAPP) {
                    const statusMessage = await Chat_estados.findOne({
                        where: {
                            codigo: ultimoChat.codigo
                        },
                        order: literal("CASE WHEN status = 'sent' THEN 1 WHEN status = 'delivered' THEN 2 WHEN status = 'read' THEN 3 END DESC")
                    });

                    if(statusMessage) {
                        estadoMensaje = statusMessage.status;
                    } else {
                        estadoMensaje = 'read';
                    }
                    
                }


                let array = {
                    numero: contacto.from,
                    contact: contacto.nameContact,
                    mensaje: ultimoChat.message,
                    estado: ultimoChat.estadoMessage,
                    time: ultimoChat.timestamp,
                    type: ultimoChat.typeMessage,
                    from: ultimoChat.from,
                    codigo: ultimoChat.codigo,
                    cantidad: chatCount,
                    asistente: nameAsistente,
                    idAsistente: idAsis,
                    rol: rol,
                    etiqueta: eti.descripcion,
                    potencial_id: idpotencial,
                    etiqueta_id: idetiqueta,
                    statusMessage: estadoMensaje
                }

                array_.push(array);
            }
        }

        const sortedData = array_.sort((a, b) => parseInt(b.time) - parseInt(a.time));

        if(rol === 2 || rol === 6) {
            let filterData = sortedData.filter(item => item.idAsistente === id);

            if(etiqueta != '0') {
                filterData = filterData.filter(objeto => {
                    return objeto.etiqueta_id == etiqueta; 
                });
            }

            filterData = filterData.slice(0, 250);

            return res.json({message: "ok", data: filterData, rol: rol, id:id});
        }

        let resultados = sortedData;

        if(etiqueta != '0') {
            resultados = sortedData.filter(objeto => {
                return objeto.etiqueta_id == etiqueta;

            });
        }

        resultados = resultados.slice(0, 250);

        return res.json({message: "ok",data: resultados, rol: rol, id:id });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// Configura el almacenamiento de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(file);
        if(file.mimetype == 'video/mp4') {
            cb(null, './src/public/videos/archivos/') // directorio donde se guardarán los archivos
        }

        if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/gif' || file.mimetype == 'image/webp' || file.mimetype == 'image/svg+xml') {
            cb(null, './src/public/img/archivos/')
        }

        if(file.mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.mimetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.mimetype == 'application/pdf' || file.mimetype == 'text/xml' || file.mimetype == 'application/x-zip-compressed' || file.mimetype == 'application/octet-stream' || file.mimetype == 'text/plain' || file.mimetype == 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
            cb(null, './src/public/documentos/archivos/')
        }
        
    },
    filename: (req, file, cb) => {
        
        const newFilename = changeNameFile(file.originalname);
        cb(null, `${Date.now()}-${newFilename}`)
    }
});

function changeNameFile(filename) {
    // Reemplazar espacios por guiones
    const textoSinEspacios = filename.replace(/\s+/g, '-');

    // Quitar tildes y caracteres especiales
    const textoLimpio = quitarTildes(textoSinEspacios);

    return textoLimpio;
}

function quitarTildes(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-.]/g, "") // Excluimos el punto (.)
        .replace(/[\s]+/g, "-")
        .replace(/[áéíóúÁÉÍÓÚ]/g, function(match) {
        switch (match) {
            case 'á': return 'a';
            case 'é': return 'e';
            case 'í': return 'i';
            case 'ó': return 'o';
            case 'ú': return 'u';
            case 'Á': return 'A';
            case 'É': return 'E';
            case 'Í': return 'I';
            case 'Ó': return 'O';
            case 'Ú': return 'U';
        }
        })
        .toLowerCase();
}

const upload = multer({ storage: storage });

export const uploadImage = async (req, res, next) => {
    const uploadSingle = upload.single('imagen');
        uploadSingle(req, res, async (error) => {
            const { numero, description } = req.body;
            if (error) {
                // Handle error
                return res.status(500).send(error.message);
            }
    
            console.log(req.file);
    
            let url_imagen;
            let typeFile;
            let dataFile;
    
            const ar = req.file;
    
            if(ar.mimetype == 'video/mp4' || ar.mimetype === 'video/webm') {
                url_imagen = process.env.URL_APP+":"+process.env.PUERTO_APP+"/videos/archivos/"+req.file.filename;
                typeFile = "video";
    
                dataFile = {
                    messaging_product: "whatsapp",
                    to: numero,
                    type: typeFile,
                    video: {
                        link: url_imagen,
                        caption: description
                    }
                };
            }
    
            if(ar.mimetype == 'image/jpeg' || ar.mimetype == 'image/png' || ar.mimetype == 'image/gif' || ar.mimetype == 'image/webp' || ar.mimetype == 'image/svg+xml') {
                url_imagen = process.env.URL_APP+":"+process.env.PUERTO_APP+"/img/archivos/"+req.file.filename;
                typeFile = "image";
    
                dataFile = {
                    messaging_product: "whatsapp",
                    to: numero,
                    type: typeFile,
                    image: {
                        link: url_imagen,
                        caption: description
                    }
                };
            }
    
            if(ar.mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || ar.mimetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || ar.mimetype == 'application/pdf' || ar.mimetype == 'text/xml' || ar.mimetype == 'application/x-zip-compressed' || ar.mimetype == 'application/octet-stream' || ar.mimetype == 'text/plain' || ar.mimetype == 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
                url_imagen = process.env.URL_APP+":"+process.env.PUERTO_APP+"/documentos/archivos/"+req.file.filename;
                typeFile = "document";
    
                dataFile = {
                    messaging_product: "whatsapp",
                    to: numero,
                    type: typeFile,
                    document: {
                        link: url_imagen,
                        caption: description
                    }
                };
            }
    
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
                    receipt: numero,
                    timestamp: Math.floor(Date.now() / 1000),
                    typeMessage: typeFile,
                    estadoMessage: "sent",
                    documentId: "",
                    id_document: Math.floor(Date.now() / 1000),
                    filename: req.file.filename,
                    description: description
                });
    
                return res.json({message: 'ok', data: new_message, datos: dataFile, api: datos});
            }
              catch (error) {
                console.error("Error in making request:", error.response.data || error.message);
                return res.json({message: error.message});
            }
    
        });

};

export const uploadImagePaste = async (req, res) => {
    try {
        const { numero, description, imagen } = req.body;

        const resultado = imagen.match(/^data:image\/(\w+);base64,([\s\S]+)/);
        
        let filename = "imagen." + resultado[1]; // image.png 
        const mimeType = resultado[1]; // image/png
        const base64Data = resultado[2];   

        const buff = Buffer.from(base64Data, 'base64');  

        const imgObject = {
            filename, 
            mimeType,
            size: buff.length  
        }

        /* ./src/public/videos/archivos/ */

        filename = Date.now() + "-" + filename;

        const rutaGuardado = path.join(__dirname, '../public/img/archivos/', filename);

        await guardarImagen(rutaGuardado, buff);

        const url_imagen = process.env.URL_APP+":"+process.env.PUERTO_APP+"/img/archivos/"+filename;

        const dataFile = {
            messaging_product: "whatsapp",
            to: numero,
            type: 'image',
            image: {
                link: url_imagen,
                caption: description
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
                receipt: numero,
                timestamp: Math.floor(Date.now() / 1000),
                typeMessage: 'image',
                estadoMessage: "sent",
                documentId: "",
                id_document: Math.floor(Date.now() / 1000),
                filename: filename,
                description: description
            });

            return res.json({message: 'ok', data: new_message, datos: dataFile, api: datos});
        } catch (error) {
            console.error("Error in making request:", error.response.data || error.message);
            return res.json({message: error.message});
        }
    } catch (error) {
        return res.json({message: error});
    }
}

const guardarImagen = async (ruta, imagenBuffer) => {

    return new Promise((resolve, reject) => {
  
      fs.writeFile(ruta, imagenBuffer, err => {
       if(err) {
         reject(err);  
       } else  {
         resolve();
       }
      });
  
    });
  
}

export const asignarClienteAUnTrabajador = async (req, res) => {
    const numero = req.params.id;
    try {

        const existeChat = await Chat.count({
            where: {
                from: String(numero)
            }
        });

        const existeChatReceipt = await Chat.count({
            where: {
                receipt: String(numero)
            }
        });

        if(existeChatReceipt != 0) {
            return res.json({message: "ya existe"});
        }

        if(existeChat == 1) {
            const potencial = await PotencialCliente.findOne({
                where: {
                    numero_whatsapp: numero
                }
            });
    
            const idPt = potencial.id;
    
            const totalTrabajadores = await Trabajadores.count({
                where: {
                    area_id: 2
                }
            });
    
            // 2. Obtiene cuántas asignaciones ya existen
            const totalAsignaciones = await Asignacion.count();
    
            // 3. Usa el operador módulo para determinar el siguiente trabajador
            const trabajadorAsignado = totalAsignaciones % totalTrabajadores;
    
            // 4. Obtiene el ID del trabajador al que se asignará el cliente
            const trabajador = await Trabajadores.findOne({
                where: {
                    area_id: 2
                },
                offset: trabajadorAsignado
            });

            //actualizar numeros whatsapp
            const traer = await NumeroWhatsapp.findOne({
                where: {
                    from: numero
                }
            });

            const idWhatsapp = traer.id;

            const updateWhatsapp = await NumeroWhatsapp.update({asistente: trabajador.id}, {
                where: {
                    id: idWhatsapp
                }
            });
    
            // 5. Crea una nueva asignación con el cliente y el trabajador determinado
            const newAsignacion = await Asignacion.create({
                fecha_asignacion: new Date(),
                estado: 1,  // o el estado que corresponda
                trabajadoreId: trabajador.id,
                potencialClienteId: idPt
                
            });

            const mensaje = `Buen día ☀️, le saluda ${trabajador.nombres} ${trabajador.apellidos}, Asistente administrativa 📋 de Grupo ES Consultores "Asesores de investigación" (Tesis) 📚. Nos escribió ✍️ solicitando información acerca de nuestros servicios y me encantaría poder ayudarlo(a) 🤝.

            🙋 ¿Cuál es su nombre?
            🎓 ¿De qué especialidad y de qué universidad es Ud.?
            🌍 ¿Desde que departamento nos escribe?
            `;
    
            return res.json({message: "ok", respuesta: mensaje});
        }
        
        return res.json({message: "ya existe"});

    } catch (error) {
        return res.json({message: error});
    }
}

export const insertChat = async (req, res) => {
    const {from, id, message, nameContact, receipt, timestamp, type, documentId, id_document, filename, fromRes, idRes} = req.body;
    try {
        const newMessage = await Chat.create({
            codigo: id,
            from: from,
            message: message,
            nameContact: nameContact,
            receipt: receipt,
            timestamp: timestamp,
            typeMessage: type,
            estadoMessage: "sent",
            documentId: documentId,
            id_document: id_document,
            filename: filename,
            fromRes: fromRes,
            idRes: idRes
        });

        return res.json(newMessage);
    } catch (error) {
        return res.json({message: error});
    }
}

export const uploadAudio = async (req, res) => {
    const { numero } = req.body;
    try {
        if (!req.file) {
            return res.status(400).json({message: 'No se subió ningún archivo.'});
        }

        console.log(req.file);

        const timestamp = Date.now();

        const inputPath = path.join(process.cwd(), 'src','public','audios','archivos', timestamp + '.wav');
        fs.writeFileSync(inputPath, Buffer.from(new Uint8Array(req.file.buffer)));

        // Definir la ruta de salida
        const outputPath = path.join(process.cwd(), 'src','public','audios','archivos', timestamp + '.mp3');

        // Ejecutar el comando ffmpeg
        await execAsync(`ffmpeg -i ${inputPath} ${outputPath}`);

        // (Opcional) Eliminar el archivo .wav temporal
        fs.unlinkSync(inputPath);

        const url_audio = process.env.URL_APP+":"+process.env.PUERTO_APP_RED+"/audios/archivos/"+timestamp+".mp3";

        const dataFile = {
            messaging_product: "whatsapp",
            to: numero,
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
                receipt: numero,
                timestamp: Math.floor(Date.now() / 1000),
                typeMessage: "audio",
                estadoMessage: "sent",
                documentId: "",
                id_document: Math.floor(Date.now() / 1000),
                filename: timestamp + '.mp3'
            });

            return res.json({ mensaje: 'ok',subido: 'Archivo subido con éxito.', datos: dataFile, api: datos, newMensaje: new_message });
        }
          catch (error) {
            console.error("Error in making request:", error.response.data || error.message);
            return res.json({message: error.message});
        }

    } catch (error) {
        return res.json({message: error});
    }
}

export const actualizarEtiqueta = async (req, res) => {
    const { embudo, etiqueta, potencial } = req.body;
    try {
        const etiPo = await EtiquetaCliente.findOne({
            where: {
                cliente_id: potencial,
                estado: 1
            }
        });

        const idEC = etiPo.id;

        const updateE = await EtiquetaCliente.update(
            {
                estado: 0
            },
            {
                where: {
                    id: idEC
                }
            }
        );

        const newE = await EtiquetaCliente.create({
            cliente_id: potencial,
            etiqueta_id: etiqueta,
            estado: 1
        });

        return res.json({ message: 'ok', data: newE });

    } catch (error) {
        return res.json({message: error.message});
    }
}

export const getEmbudoEtiqueta = async (req, res) => {
    const etiqueta = req.params.id;
    
    try {

        const dataEmbudo = await Etiqueta.findOne({
            where: {
                id: etiqueta
            }
        });

        const emb = dataEmbudo.embudo_id;

        const dataEtiqueta = await Etiqueta.findAll({
            where: {
                embudo_id: emb
            }
        });

        const embudo = await Embudo.findAll();

        return res.json({ mensaje: 'ok',etiqueta: dataEtiqueta, embudo_id: emb, embudo: embudo });

    } catch (error) {
        return res.json({message: error.message});
    }
}

export const audioMiddleware = uploadVoz.single('audio');

export const getEtiquetaEmbudo = async (req, res) => {
    const id = req.params.id;
    try {
        const etiquetas = await Etiqueta.findAll({
            where: {
                embudo_id: id
            }
        });

        res.json({message: 'ok', etiquetas: etiquetas});
    } catch (error) {
        return res.json({message: error.message});
    }
}

//enviar plantilla del icono de whatsapp de la pagina web

export const enviar_mensaje_icono_whatsapp = async (req, res) => {
    const { nombre, numero } = req.body;

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    try {
        
        const existeChat = await Chat.count({
            where: {
                receipt: String(numero)
            }
        });

        if(existeChat === 0) {
            const newPotencial = await PotencialCliente.create({
                nombres: nombre,
                apellidos: "",
                fecha_ingreso: new Date(),
                fecha_registro: new Date(),
                prefijo_celular: 51,
                numero_celular: 51,
                prefijo_whatsapp: 51,
                numero_whatsapp: numero
            });

            const totalTrabajadores = await Trabajadores.count({
                where: {
                    area_id: 2
                }
            });

            // 2. Obtiene cuántas asignaciones ya existen
            const totalAsignaciones = await Asignacion.count();
    
            // 3. Usa el operador módulo para determinar el siguiente trabajador
            const trabajadorAsignado = totalAsignaciones % totalTrabajadores;
    
            // 4. Obtiene el ID del trabajador al que se asignará el cliente
            const trabajador = await Trabajadores.findOne({
                where: {
                    area_id: 2
                },
                offset: trabajadorAsignado
            });

            const newNumeroWhatsapp =await NumeroWhatsapp.create({
                from: numero,
                nameContact: nombre,
                estado: 1,
                asistente: trabajador.id,
                plataforma_id: 3,
                tipo_contacto: 1,
                user_register: 0
            });

            // 5. Crea una nueva asignación con el cliente y el trabajador determinado
            const newAsignacion = await Asignacion.create({
                fecha_asignacion: new Date(),
                estado: 1,  // o el estado que corresponda
                trabajadoreId: trabajador.id,
                potencialClienteId: newPotencial.id
                
            });

            const potEtiqueta = await EtiquetaCliente.create({
                cliente_id: newPotencial.id,
                etiqueta_id: 1,
                estado: 1
            });

            try {

                const mensajeJSON = {
                    "messaging_product": "whatsapp",
                    "recipient_type": "individual",
                    "to": numero,
                    "type": "template",
                    "template": {
                      "name": "mensaje_icono_whatsapp",
                      "language": { "code": "es" },
                      "components": [
                        {
                          "type": "body",
                          "parameters": [
                            {
                              "type": "text",
                              "text": trabajador.nombres
                            },
                            {
                              "type": "text",
                              "text": trabajador.apellidos
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

                // Realizar una solicitud POST a la API con el JSON y el token de autenticación
                const response = await axios(config);

                const data = response.data;
            
                const messageStatus = data.messages[0].message_status;

                const messageSend = `Buen día ☀️, le saluda ${trabajador.nombres} ${trabajador.apellidos} Asistente administrativa 📋 de Grupo ES Consultores "Asesores de investigación" (Tesis) 📚. Nos escribió ✍️ solicitando información acerca de nuestros servicios y me encantaría poder ayudarlo(a) 🤝.

                🙋 ¿Cuál es su nombre?
                🎓 ¿De qué especialidad y de qué universidad es Ud.?
                🌍 ¿Desde qué departamento nos escribe?`;

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

            } catch (error) {
                fs.appendFileSync('errores.txt', new Date().toISOString() + ': ' + error.stack + '\n');
                return res.json({message: error.message});
            }

        } else {

            try {

                const mensajeJSON = {
                    "messaging_product": "whatsapp",
                    "recipient_type": "individual",
                    "to": numero,
                    "type": "template",
                    "template": {
                      "name": "icono_whatsapp_web_despues_otra_consulta",
                      "language": { "code": "es" }
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

                // Realizar una solicitud POST a la API con el JSON y el token de autenticación
                const response = await axios(config);

                const data = response.data;
            
                const messageStatus = data.messages[0].message_status;

                const messageSend = `
                Somos Grupo Es Consultores Asesoría de Tesis 📚, nos apasiona brindar el mejor servicio de asesoramiento para tus estudios.

                Cuéntame en qué más puedo ayudarte en esta oportunidad. Estoy para servirte en lo que necesites. 😊
                `;

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

            } catch (error) {
                fs.appendFileSync('errores.txt', new Date().toISOString() + ': ' + error.stack + '\n');
                return res.json({message: error.message});
            }

            //return res.json({message: "Ya existe"});
        }

    } catch (error) {
        fs.appendFileSync('errores.txt', new Date().toISOString() + ': ' + error.stack + '\n');
        return res.json({message: error.message});
    }
}

export const socketMensaje = async (req, res) => {
    const id = req.params.id;
    try {
        const chat = await Chat.findOne({
            where: {
                id: id
            }
        });

        if(chat.idRes) {
            const mensajeIdRes = await Chat.findOne({ where: { codigo: chat.idRes } });

            if (mensajeIdRes) {
                let plainObject = chat.get({ plain: true });
                // Agrega el mensajeIdRes como un nuevo campo 'mensajeRelacionado' en el objeto plainObject
                plainObject.mensajeRelacionado = mensajeIdRes.get({ plain: true });
            }
        }

        if(chat.from == process.env.NUMERO_WHATSAPP) {
            const estadoMensaje = await Chat_estados.findOne({
                where: {
                    codigo: chat.codigo
                },
                order: literal("CASE WHEN status = 'sent' THEN 1 WHEN status = 'delivered' THEN 2 WHEN status = 'read' THEN 3 END DESC")
            });

            if(estadoMensaje) {
                let estadoObject = chat.get({ plain: true });
                // Agrega el mensajeIdRes como un nuevo campo 'mensajeRelacionado' en el objeto plainObject
                estadoObject.estadoMensaje = estadoMensaje.get({ plain: true });
            }
        }

        return res.json(chat);

    } catch (error) {
        return res.json({message: error.message});
    }

}

export const getEmpleadosAsignar = async (req, res) => {
    try {

        // IDs de perfiles que deseas consultar (1 y 6)
        const perfilesAConsultar = [2, 6];

        const trabajadores = await Trabajadores.findAll({
            where: {
                area_id: {
                    [Op.in]: perfilesAConsultar
                }
            }
        });

        return res.json({ message: 'ok', data: trabajadores });

    } catch (error) {
        return res.json({message: error.message});
    }
}

export const asignarAsistente = async (req, res) => {
    const { numero, asistente } = req.body;
    try {
        console.log(numero)
        const actualizar = await NumeroWhatsapp.update({ asistente: asistente }, {
            where: { from: numero }
        });

        return res.json({ message: 'ok', data: actualizar });

    } catch (error) {
        return res.json({message: error.message});
    }
}

//traer un chat de un codigo
export const chatOne = async (req, res) => {
    const codigo = req.params.id;
    try {
        const chat = await Chat.findOne({
            where: {
                codigo: codigo
            }
        });

        return res.json({ message: 'ok', data: chat });
    } catch (error) {
        return res.json({message: error.message});
    }
}

//traer todos los contactos que no fueron respondidos a lo lapso de 3 min (configurable)
export const contactosNoContestados = async(req, res) => {
    try {
        const rol = req.usuarioToken._role;
        const id = req.usuarioToken._id;

        let contactos = "";

        if(rol != 2 && rol != 6) {
            contactos = await NumeroWhatsapp.findAll();

        } else {
            contactos = await NumeroWhatsapp.findAll({
                where: {
                    asistente: id
                }
            });
        }

        let arrayContactos = [];

        for (let contacto of contactos) {
            const numero = contacto.from; 

            const chat = await Chat.findOne({
                where: {
                  [Op.or]: [
                    { from: numero }, 
                    { receipt: numero }
                  ]
                },
                order: [
                  ['timestamp', 'DESC']
                ],
                limit: 1
            });

            if(chat) {

                if (chat.typeMessage === 'text') {
                    if(chat.from === numero) {
                        const tiempo = dias_minutos(chat.timestamp);
    
                        if(tiempo.dias > 0 || tiempo.minutos > 3) {
    
                            //let other = redireccionar_chat(numero);
    
                            const frases = await FraseFinChat.findAll();
    
                            const arrayDeContenidos = frases.map(frase => frase.descripcion.toLowerCase());

                            const ultimoMessage = chat.message;

                            const buscar = ultimoMessage.toLowerCase();
    
                            const verificado = arrayDeContenidos.some(elemento => buscar.includes(elemento));
    
                            if(verificado === false) {
                                const potencial = await PotencialCliente.findOne({
                                    where: {
                                        numero_whatsapp: numero
                                    }
                                });
                            
                                const etiquetaCliente = await EtiquetaCliente.findOne({
                                    where: {
                                        cliente_id: potencial.id
                                    }
                                });
                            
                                const idetiqueta = etiquetaCliente.etiqueta_id;
                            
                                const etiqueta = await Etiqueta.findOne({
                                    where: {
                                        id: idetiqueta
                                    }
                                });

                                let nameAsistente = "";

                                if(contacto.asistente == null) {

                                } else {
                                    const usuario = await Trabajadores.findOne({
                                        where: {
                                            id: contacto.asistente
                                        }
                                    });

                                    nameAsistente = usuario.nombres+" "+usuario.apellidos;
                                }
        
                                let datos = {
                                    nameContacto: contacto.nameContact,
                                    contacto: contacto.from,
                                    fecha: chat.timestamp,
                                    dias: tiempo.dias,
                                    minutos: tiempo.minutos,
                                    horas: tiempo.horas,
                                    etiquetaName: etiqueta.descripcion,
                                    potencial_id: potencial.id,
                                    etiqueta_id: idetiqueta,
                                    rol: rol,
                                    asistente: contacto.asistente,
                                    nameAsistente: nameAsistente,
                                    chat: chat.message,
                                    verificado: verificado
                                }
                    
                                arrayContactos.push(datos);
                            }
    
                           
                        }
                    }
                }
                
            }

        }

        return res.json({ message: 'ok', data: arrayContactos });

    } catch (error) {
        return res.json({message: error.message});
    }
}

export const envio_formulario_panel = async(req, res) => {
    const { nombre, correo, celular, carrera, universidad, ciudad } = req.body;

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    try {

        const lengthCelular = celular.length;

        if(lengthCelular == 9) {
            const dataAsignado = await asignarAsistenteData();

            const idAsignado = dataAsignado.id;
            const nameAsignado = dataAsignado.nombres+" "+dataAsignado.apellidos;

            const celularPref = "51"+celular;

            const existeChat = await Chat.count({
                where: {
                    receipt: String(celularPref)
                }
            });

            if(existeChat === 0) {
                const newPotencial = await PotencialCliente.create({
                    nombres: nombre,
                    apellidos: "",
                    fecha_ingreso: new Date(),
                    fecha_registro: new Date(),
                    prefijo_celular: 51,
                    numero_celular: 51,
                    prefijo_whatsapp: 51,
                    numero_whatsapp: celularPref,
                    correo: correo,
                    carrera: carrera,
                    universidad: universidad,
                    ciudad: ciudad
                });
    
                
                const newNumeroWhatsapp =await NumeroWhatsapp.create({
                    from: celularPref,
                    nameContact: nombre,
                    estado: 1,
                    asistente: idAsignado,
                    plataforma_id: 5,
                    tipo_contacto: 1,
                    user_register: 0
                });
    
                // 5. Crea una nueva asignación con el cliente y el trabajador determinado
                const newAsignacion = await Asignacion.create({
                    fecha_asignacion: new Date(),
                    estado: 1,  // o el estado que corresponda
                    trabajadoreId: idAsignado,
                    potencialClienteId: newPotencial.id
                    
                });
    
                const potEtiqueta = await EtiquetaCliente.create({
                    cliente_id: newPotencial.id,
                    etiqueta_id: 1,
                    estado: 1
                });
    
                try {
                    const mensajeJSON = {
                        "messaging_product": "whatsapp",
                        "recipient_type": "individual",
                        "to": celularPref,
                        "type": "template",
                        "template": {
                          "name": "formulario_web",
                          "language": { "code": "es" },
                          "components": [
                            {
                              "type": "body",
                              "parameters": [
                                {
                                  "type": "text",
                                  "text": nombre
                                },
                                {
                                  "type": "text",
                                  "text": nameAsignado
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
    
                    // Realizar una solicitud POST a la API con el JSON y el token de autenticación
                    const response = await axios(config);
    
                    const data = response.data;
    
                    const messageStatus = data.messages[0].message_status;
    
                    const messageSend = `🌞 Buen día, ${nombre}, le saluda ${nameAsignado} 🙋‍♀️, asistente administrativa de Grupo ES Consultores. Nos escribió a nuestra página web 🌐 solicitando información acerca de nuestros servicios y me encantaría poder ayudarlo(a) 💪. Para comenzar, tengo algunas preguntas de filtro:
    
                    1️⃣ ¿Ya tienes tema o título tentativo? 🤔
                    2️⃣ ¿Ya tienes un avance en tu proyecto? 📈
                    
                    ¡Estoy aquí para asistirte en cada paso del camino! 😊`;

                    const messageFrom = `Hola, soy <strong>${nombre}</strong>, necesito más información. Soy de la carrera de <strong>${carrera}</strong> de la universidad <strong>${universidad}</strong> de la ciudad de <strong>${ciudad}</strong>. Mi correo es <strong>${correo}</strong>`;
    
                    if(messageStatus === 'accepted') {

                        const customerMessage = await Chat.create({
                            codigo: "",
                            from: celularPref,
                            message: messageFrom,
                            nameContact: nombre,
                            receipt: process.env.NUMERO_WHATSAPP,
                            timestamp: Math.floor(Date.now() / 1000),
                            typeMessage: "text",
                            estadoMessage: "read",
                            documentId: "",
                            id_document: "",
                            filename: "",
                            fromRes: "",
                            idRes: ""
                        });

                        const newMessage = await Chat.create({
                            codigo: data.messages[0].id,
                            from: process.env.NUMERO_WHATSAPP,
                            message: messageSend,
                            nameContact: "Grupo Es Consultores",
                            receipt: celularPref,
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
                    return res.json({message: error.message});
                }
            } else {
                try {

                    const mensajeJSON = {
                        "messaging_product": "whatsapp",
                        "recipient_type": "individual",
                        "to": celularPref,
                        "type": "template",
                        "template": {
                          "name": "icono_whatsapp_web_despues_otra_consulta",
                          "language": { "code": "es" }
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
    
                    // Realizar una solicitud POST a la API con el JSON y el token de autenticación
                    const response = await axios(config);
    
                    const data = response.data;
                
                    const messageStatus = data.messages[0].message_status;
    
                    const messageSend = `
                    Somos Grupo Es Consultores Asesoría de Tesis 📚, nos apasiona brindar el mejor servicio de asesoramiento para tus estudios.
    
                    Cuéntame en qué más puedo ayudarte en esta oportunidad. Estoy para servirte en lo que necesites. 😊
                    `;
    
                    if(messageStatus === 'accepted') {
    
                        const newMessage = await Chat.create({
                            codigo: data.messages[0].id,
                            from: process.env.NUMERO_WHATSAPP,
                            message: messageSend,
                            nameContact: "Grupo Es Consultores",
                            receipt: celularPref,
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
                    return res.json({message: error.message});
                }
            }

            

        }

        //const new_contacto = await NumeroWhatsapp.create();


    } catch (error) {
        fs.appendFileSync('erroresPanel.txt', new Date().toISOString() + ': ' + error.stack + '\n');
        return res.json({message: error.message});
    }
}

export const delete_contacto = async (req, res) => {
    const numero = req.params.id;
    try {
        //select * from potencial_cliente pc where pc.numero_whatsapp = '51922502947';
        const potencial = await PotencialCliente.findOne({
            where: {
                numero_whatsapp: numero
            }
        });

        const idpotencial = potencial.id;


        const id = req.usuarioToken._id;
        const tipo_actividad = "eliminación";
        const descripcion_detallada = `Eliminación del contacto ${numero} - ${potencial.nombres}`;
        const fecha_hora = new Date();
        const direccion_ip = "";
        const dispositivo = "";
        const resultado_actividad = "";

        const registro = await registroActividad(id, tipo_actividad, descripcion_detallada, fecha_hora, direccion_ip, dispositivo, resultado_actividad);

        const chatFrom = await Chat.destroy({
            where: {
                from: numero
            }
        });

        const chatReceipt = await Chat.destroy({
            where: {
                receipt: numero
            }
        });

        const deletePotencial = await PotencialCliente.destroy({
            where: {
                id: idpotencial
            }
        });

        const deleteEtiqueta = await EtiquetaCliente.destroy({
            where: {
                cliente_id: idpotencial
            }
        });

        const deleteNumber = await NumeroWhatsapp.destroy({
            where: {
                from: numero
            }
        });

        return res.json({message: 'ok', data: 'Se elimino correctamente el contacto'});

    } catch (error) {
        return res.json({message: error.message});
    }
}

function dias_minutos(timestamp) {
    // Fechas
    const fechaPasada = new Date(timestamp * 1000);  
    const ahora = new Date();

    // Diferencia en milisegundos
    const diff = ahora - fechaPasada;   

    // Calcular días, horas y minutos
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    const horas = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const minutos = Math.floor(diff / (1000 * 60)) % 60;

    const datos = {
        dias: dias,
        minutos: minutos,
        horas: horas
    }

    return datos;

}

function contienePalabra(frase, palabras) {

    const palabrasFrase = new Set(
      frase.toLowerCase().split(' ')  
    );
    
    return palabras.some(palabra => 
        palabrasFrase.has(palabra)  
    );
  
}

export const findIdChat = async(req, res) => {
    try {
        const id = req.params.id;

        const chat = await Chat.findOne({
            where: {
                id: id
            }
        });

        const dataJson = chat.dataJson;

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: process.env.URL_MESSAGES,
            headers: {
                'Authorization': 'Bearer ' + process.env.TOKEN_WHATSAPP
            },
            data: dataJson
        };

        const response = await axios(config);

        const data = response.data;

        //return res.json(data);

        const messageStatus = data.messages[0].message_status;

        if (messageStatus === 'accepted') {

            const updateChat = await Chat.update({ codigo: data.messages[0].id }, {
                where: { id: id }
            });

            return res.json({ message: 'ok', data: data.messages[0].id });

        } else {
            return res.json({ message: "No fue enviado la plantilla" });
        }

    } catch (error) {
        return res.json({message: error.message});
    }
}

export const statusMensajeCodigo = async (req, res) => {
    try {
        const codigo = req.params.id;

        const estadoMensaje = await Chat_estados.findOne({
            where: {
                codigo: codigo
            },
            order: literal("CASE WHEN status = 'sent' THEN 1 WHEN status = 'delivered' THEN 2 WHEN status = 'read' THEN 3 END DESC")
        });

        return res.json({ message: 'ok', data: estadoMensaje });

    } catch (error) {
        return res.json({message: error.message});
    }
}

