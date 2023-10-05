import { sequelize } from "../database/database.js";
import { Chat } from "../models/chat.js";
import { NumeroWhatsapp } from "../models/numerosWhatsapp.js";
import { PotencialCliente } from "../models/potencialCliente.js";
import { Trabajadores } from "../models/trabajadores.js";
import { Asignacion } from "../models/asignacion.js";

import { Op } from 'sequelize';

import axios from 'axios';
import path from 'path';
import fs from 'fs';

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
        url_chat+'/js/chat.js'
    ];

    res.render('chat/index', { layout: 'partials/main', js, urlchat: url_chat, dominio: dominio });
}

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

export const mensajes_numero = async (req, res) => {
    const numero = req.params.id;

    try {
        const mensajes = await Chat.findAll({
            where: {
                [Op.or]: [
                  { from: numero },
                  { receipt: numero },
                ],
              },
            order: [
                ['timestamp', 'ASC'],
            ],
        });

        if (mensajes.length === 0) {
            return res.status(404).json({ message: 'No se encontraron mensajes.' });
        }

        return res.json(mensajes);

    } catch (error) {
        console.error('Error obteniendo los documentos', error);
        return res.status(500).json({ message: "Error interno del servidor." });
    }
};

export const addMessageFirestore = async(req, res) => {
    const {from, id, message, nameContact, receipt, timestamp, type, documentId, id_document, filename, description} = req.body;
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
                from,
                nameContact
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
            description: description
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

        const results = await Chat.findAll({
            attributes: ['from', [sequelize.fn('MAX', sequelize.col('timestamp')), 'max_timestamp']],
            group: ['from'],
            order: [
              [sequelize.literal('"max_timestamp" DESC')]
            ],
        });

        let arrayContactos = [];

        for (const result of results) {
            const { from } = result;
            const max_timestamp = result.get('max_timestamp');

            if (from != process.env.NUMERO_WHATSAPP) {
                console.log(from);
                const resu = await Chat.findOne({
                    attributes: ['receipt', [sequelize.fn('MAX', sequelize.col('timestamp')), 'max_timestamp']],
                    where: {
                        from: process.env.NUMERO_WHATSAPP,
                        receipt: from
                    },
                    group: ['receipt'],
                    order: [
                        [sequelize.literal('max_timestamp DESC')]
                    ]
                });

                let time = "";

                if (resu) {
                    let timestamp1 = resu.get('max_timestamp');

                    if (max_timestamp > timestamp1) {
                        time = max_timestamp;
                    } else {
                        time = timestamp1;
                    }
                } else {
                    time = max_timestamp;
                }

                const mensa = await Chat.findOne({
                    where: {
                        timestamp: time
                    }
                });

                const chatCount = await Chat.count({
                    where: {
                        from: from,
                        estadoMessage: "sent"
                    }
                });

                const name = await NumeroWhatsapp.findOne({
                    where: {
                        from: from
                    }
                });

                const idAsis = name.asistente;

                const asistente = await Trabajadores.findOne({
                    where: {
                        id: idAsis
                    }
                });

                let nameAsistente = ""

                if (asistente) {
                    nameAsistente = asistente.nombres+" "+asistente.apellidos;
                }

                let array = {
                    numero: from,
                    contact: name.nameContact,
                    mensaje: mensa.message,
                    estado: mensa.estadoMessage,
                    time: time,
                    cantidad: chatCount,
                    asistente: nameAsistente,
                    idAsistente: idAsis
                }

                arrayContactos.push(array)
            }
        }

        if(rol === 2) {
            const filterData = arrayContactos.filter(item => item.idAsistente === id);
            return res.json(filterData);  
        } 

        return res.json(arrayContactos);    

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
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});

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
    const {from, id, message, nameContact, receipt, timestamp, type, documentId, id_document, filename} = req.body;
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
            filename: filename
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

        return res.json("hola");

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
                filename: timestamp + '.ogg'
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

const getExtensionFromMimeType = (mimeType) => {
    const mimeToExtensionMap = {
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
        "application/vnd.ms-excel": ".xls",
        "application/pdf": ".pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
        "text/xml": ".xml",
        "application/x-zip-compressed": ".zip",
        "": ".rar"
        // ... puedes añadir más mapeos según lo necesites
    };

    return mimeToExtensionMap[mimeType] || null;
}

function convertAudioToMP3(inputBuffer) {
    return new Promise((resolve, reject) => {
        ffmpeg()
            .input(inputBuffer)
            .toFormat('mp3')
            .on('end', () => {
                console.log('Conversión finalizada.');
            })
            .on('error', (err) => {
                reject(err);
            })
            .pipe(res, { end: true });
    });
}

export const audioMiddleware = uploadVoz.single('audio');