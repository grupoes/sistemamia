import { sequelize } from "../database/database.js";
import { Chat } from "../models/chat.js";
import { NumeroWhatsapp } from "../models/numerosWhatsapp.js";
import { PotencialCliente } from "../models/potencialCliente.js";

import { Op } from 'sequelize';

import axios from 'axios';
import { createWriteStream } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import multer from 'multer';

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
    const url_chat = process.env.URL_APP+":"+process.env.PUERTO_SOCKET;
    const js = [
        url_chat+'/socket.io/socket.io.js',
        url_chat+'/js/chat.js'
    ];

    res.render('chat/index', { layout: 'partials/main', js, urlchat: url_chat });
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
    const {from, id, message, nameContact, receipt, timestamp, type, documentId, id_document, filename} = req.body;
    try {

        console.log(req.body);

        if (type == 'image' || type == 'video' || type == 'document' || type == 'audio') {
            console.log("aca ")
            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: 'https://graph.facebook.com/v17.0/'+id_document,
                headers: { 
                  'Authorization': 'Bearer EAALqfu5fdToBO4ZChxiynoV99ZARXPrkiDIfZA3fi1TRfeujYI2YlPzH9fUB8PF6BbWJAEowNhCprGP2LqZA9MhWcLcxgImVkk8LKKASpN23vtHVZA4JZC9z15pDLFe1AwXDIaLNAZA75PN4f9Ji25tGC5ue8ZA7jWEfHgo2oYZCSrIAFZAzJ3Nj86iCfJToOhZB83jZCvVheSZBOyuc04zxE'
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
                      'Authorization': 'Bearer EAALqfu5fdToBO4ZChxiynoV99ZARXPrkiDIfZA3fi1TRfeujYI2YlPzH9fUB8PF6BbWJAEowNhCprGP2LqZA9MhWcLcxgImVkk8LKKASpN23vtHVZA4JZC9z15pDLFe1AwXDIaLNAZA75PN4f9Ji25tGC5ue8ZA7jWEfHgo2oYZCSrIAFZAzJ3Nj86iCfJToOhZB83jZCvVheSZBOyuc04zxE'
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
                        rutaFile = "./src/public/documentos/archivos/"+id_document+'.pdf';
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

        const existe = await NumeroWhatsapp.findOne({
            where: {
                from: from
            }
        });

        if (!existe) {
            const addN = await NumeroWhatsapp.create({
                from,
                nameContact
            });

            const addP = await PotencialCliente.create({
                numero_whatsapp: from
            });
        }

        return res.json(newMessage);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const numerosWhatsapp = async(req, res) => {
    try { 
        
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

            if (from != '51927982544') {
                console.log(from);
                const resu = await Chat.findOne({
                    attributes: ['receipt', [sequelize.fn('MAX', sequelize.col('timestamp')), 'max_timestamp']],
                    where: {
                        from: '51927982544',
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

                let array = {
                    numero: from,
                    contact: name.nameContact,
                    mensaje: mensa.message,
                    estado: mensa.estadoMessage,
                    time: time,
                    cantidad: chatCount
                }

                arrayContactos.push(array)
            }
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

        if(file.mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.mimetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.mimetype == 'application/pdf' || file.mimetype == 'text/xml' || file.mimetype == 'application/x-zip-compressed' || file.mimetype == 'application/octet-stream') {
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
        const { numero } = req.body;
        if (error) {
            // Handle error
            return res.status(500).send(error.message);
        }
        console.log(req.file); // contiene información sobre el archivo.
        let url_imagen;
        let typeFile;
        let dataFile;

        const ar = req.file;

        if(ar.mimetype == 'video/mp4') {
            url_imagen = "http://157.230.239.170:4000/videos/archivos/"+req.file.filename;
            typeFile = "video";

            dataFile = {
                messaging_product: "whatsapp",
                to: numero,
                type: typeFile,
                video: {
                    link: url_imagen
                }
            };
        }

        if(ar.mimetype == 'image/jpeg' || ar.mimetype == 'image/png' || ar.mimetype == 'image/gif' || ar.mimetype == 'image/webp' || ar.mimetype == 'image/svg+xml') {
            url_imagen = "http://157.230.239.170:4000/img/archivos/"+req.file.filename;
            typeFile = "image";

            dataFile = {
                messaging_product: "whatsapp",
                to: numero,
                type: typeFile,
                image: {
                    link: url_imagen
                }
            };
        }

        if(ar.mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || ar.mimetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || ar.mimetype == 'application/pdf' || ar.mimetype == 'text/xml' || ar.mimetype == 'application/x-zip-compressed' || ar.mimetype == 'application/octet-stream') {
            url_imagen = "http://157.230.239.170:4000/documentos/archivos/"+req.file.filename;
            typeFile = "document";

            dataFile = {
                messaging_product: "whatsapp",
                to: numero,
                type: typeFile,
                document: {
                    link: url_imagen,
                    caption: ""
                }
            };
        }

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://graph.facebook.com/v17.0/122094968330010315/messages',
            headers: { 
              'Authorization': 'Bearer EAALqfu5fdToBO4ZChxiynoV99ZARXPrkiDIfZA3fi1TRfeujYI2YlPzH9fUB8PF6BbWJAEowNhCprGP2LqZA9MhWcLcxgImVkk8LKKASpN23vtHVZA4JZC9z15pDLFe1AwXDIaLNAZA75PN4f9Ji25tGC5ue8ZA7jWEfHgo2oYZCSrIAFZAzJ3Nj86iCfJToOhZB83jZCvVheSZBOyuc04zxE'
            },
            data: dataFile
        };

        try {
            const response = await axios(config);
            const datos = response.data;

            const new_message = await Chat.create({
                codigo: datos.messages[0].id,
                from: "51927982544",
                message: "",
                nameContact: "",
                receipt: numero,
                timestamp: Math.floor(Date.now() / 1000),
                typeMessage: "image",
                estadoMessage: "sent",
                documentId: "",
                id_document: Math.floor(Date.now() / 1000),
                filename: req.file.filename
            });

            return res.json({message: 'ok', data: new_message, datos: dataFile, api: datos});
        }
          catch (error) {
            console.error("Error in making request:", error.response.data || error.message);
            return res.json({message: error.message});
        }

    });
};