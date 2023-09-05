import { sequelize } from "../database/database.js";
import { Chat } from "../models/chat.js";
import { NumeroWhatsapp } from "../models/numerosWhatsapp.js";

import { Op } from 'sequelize';

import axios from 'axios';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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

        if (type == 'image') {
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
                    maxBodyLength: Infinity,
                    url: urlMedia,
                    headers: { 
                      'Authorization': 'Bearer EAALqfu5fdToBO4ZChxiynoV99ZARXPrkiDIfZA3fi1TRfeujYI2YlPzH9fUB8PF6BbWJAEowNhCprGP2LqZA9MhWcLcxgImVkk8LKKASpN23vtHVZA4JZC9z15pDLFe1AwXDIaLNAZA75PN4f9Ji25tGC5ue8ZA7jWEfHgo2oYZCSrIAFZAzJ3Nj86iCfJToOhZB83jZCvVheSZBOyuc04zxE'
                    }
                };

                try {
                    const resp = await axios.request(configu, {
                        responseType: 'arraybuffer'
                    });

                    const contentType = resp.headers['content-type'];

                    console.log(resp.headers);
                    console.log(resp);

                    let extension;

                    switch (contentType) {
                        case 'image/png':
                            extension = '.png';
                            break;
                        case 'image/jpeg':
                            extension = '.jpg';
                            break;
                        case 'application/pdf':
                            extension = '.pdf';
                            break;
                        // ... puedes agregar otros casos según lo necesites
                        default:
                            extension = ''; // o puedes asignar una extensión predeterminada
                            break;
                    }

                    const filePath = join(__dirname, `../public/img/archivos/${id_document}${extension}`);

                    fs.writeFileSync(filePath, resp.data);
                    console.log(`Image saved to ${filePath}`);
                } catch (error) {
                    console.log(error);
                    return res.json(error.message + " fue aca");
                }

            } catch (error) {
                return res.json(error.message);
            }
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