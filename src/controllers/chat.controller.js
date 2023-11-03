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

import { Op } from 'sequelize';

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

import admin from 'firebase-admin';
import serviceAccount from '../api_firestore_data.json' assert { type: 'json' };

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

export const chatView = (req, res) => {
    const url_chat = process.env.URL_APP+":"+process.env.SOCKET_RED;
    const dominio = process.env.URL_APP+":"+process.env.PUERTO_APP_RED;
    const js = [
        url_chat+'/socket.io/socket.io.js',
        url_chat+'/js/chat.js',
        'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.all.min.js'
    ];

    const css = [
        'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.min.css'
    ];

    res.render('chat/index', { layout: 'partials/main', css, js, urlchat: url_chat, dominio: dominio });
}

const execAsync = promisify(exec);

export const addMessage = async (req, res) => {
    const { text, messageId, numberWhatsapp } = req.body;
    try {
        const data = {
            from: 51927982544,
            message: text,
            timestamp: Math.floor(Date.now() / 1000),
            id: messageId,
            type: 'text',
            nameContact: 'Grupo Es Consultores',
            receipt: numberWhatsapp

        }

        const docRef = db.collection('conversation');

        try {
            const reg = await docRef.add(data);
            console.log('Document successfully written!');
            res.json(reg);
        } catch (error) {
            console.error('Error writing document: ', error);
            res.json('error', error);
        }

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

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
                    order: [
                        ['id', 'DESC'],
                    ]
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
    const {from, id, message, nameContact, receipt, timestamp, type, documentId, id_document, filename, description, fromRes, idRes} = req.body;
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
                tipo_contacto: 1
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
            idRes: idRes
        });

        return res.json(newMessage);
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ message: error.message });
    }
}

export const numerosWhatsapp = async(req, res) => {
    try { 
        const rol = req.usuarioToken._role;
        const id = req.usuarioToken._id;

        const contactos = await NumeroWhatsapp.findAll();

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
                        order: [
                            ['id', 'DESC'],
                        ]
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
            const filterData = sortedData.filter(item => item.idAsistente === id);
            return res.json({message: "ok", data: filterData, rol: rol, id:id});
        }

        return res.json({message: "ok",data: sortedData, rol: rol, id:id });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const traer_ultimo_mensaje = async(req, res) => {
    const numero = req.params.id;
    try {
        let collectionRef = db.collection('conversation');
        const query = collectionRef.where('from', '==', numero).orderBy('timestamp', 'desc').limit(1);

        const snapshot = await query.get();

        if (snapshot.empty) {
            console.log('No se encontraron registros.');
            return;
        }

        // Como solo estamos obteniendo un documento, simplemente lo imprimimos
        const record = snapshot.docs[0].data();
        console.log(record);
        return res.json(record);

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

        if(file.mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.mimetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.mimetype == 'application/pdf' || file.mimetype == 'text/xml' || file.mimetype == 'application/x-zip-compressed' || file.mimetype == 'application/octet-stream' || file.mimetype == 'text/plain') {
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
        console.log(req.file); // contiene información sobre el archivo.
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

        if(ar.mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || ar.mimetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || ar.mimetype == 'application/pdf' || ar.mimetype == 'text/xml' || ar.mimetype == 'application/x-zip-compressed' || ar.mimetype == 'application/octet-stream' || ar.mimeType == 'text/plain') {
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
                tipo_contacto: 1
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
                return res.json({message: error.message});
            }

        } else {
            return res.json({message: "Ya existe"});
        }

    } catch (error) {
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
                order: [
                    ['id', 'DESC'],
                ]
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