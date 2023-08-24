import { sequelize } from "../database/database.js";
import { Chat } from "../models/chat.js";
import { NumeroWhatsapp } from "../models/numerosWhatsapp.js";

import dotenv from "dotenv";

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
        let mensajesRef = db.collection('conversation');

        // Mensajes enviados por el número
        let sentSnapshot = await mensajesRef.where('from', '==', numero).get();

        // Mensajes recibidos por el número
        let receivedSnapshot = await mensajesRef.where('receipt', '==', numero).get();

        if (sentSnapshot.empty && receivedSnapshot.empty) {
            return res.status(404).json({ message: "No se encontraron mensajes." });
        }

        let mensajes = [];

        // Agregar mensajes enviados
        sentSnapshot.forEach(doc => {
            mensajes.push({ id: doc.id, ...doc.data() });
        });

        // Agregar mensajes recibidos
        receivedSnapshot.forEach(doc => {
            mensajes.push({ id: doc.id, ...doc.data() });
        });

        // Opcional: Podrías querer ordenar los mensajes por fecha (si tienes un campo de fecha/timestamp)
        mensajes.sort((a, b) => a.timestamp - b.timestamp); // Asume que 'fecha' es un campo timestamp

        return res.json(mensajes);

    } catch (error) {
        console.error('Error obteniendo los documentos', error);
        return res.status(500).json({ message: "Error interno del servidor." });
    }
};

export const addMessageFirestore = async(req, res) => {
    const {from, id, message, nameContact, receipt, timestamp, type, documentId} = req.body;
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
            documentId: documentId
        });

        return res.json(newMessage);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const numerosWhatsapp = async(req, res) => {
    try {
        //SELECT * FROM chat WHERE chat.from='51922502947' OR chat.receipt='51922502947' 
        //ORDER BY chat.timestamp DESC LIMIT 1;

        //SELECT COUNT(*) FROM chat WHERE chat.from='51922502947' AND estadoMessage='sent';

        //SELECT chat.from FROM chat WHERE chat.from != '51927982544' GROUP BY chat.from;  
        
        const results = await Chat.findAll({
            attributes: ['from', [sequelize.fn('MAX', sequelize.col('timestamp')), 'max_timestamp']],
            group: ['from'],
            order: [
              [sequelize.literal('"max_timestamp" DESC')]
            ],
        });

        let arrayContactos = [];

        for (const result of results) {
            const { from, max_timestamp } = result;

            if (from != '51927982544') {
                const resu = await Chat.findOne({
                    attributes: ['receipt', [sequelize.fn('MAX', sequelize.col('timestamp')), 'max_timestamp']],
                    where: {
                        from: '51927982544',
                        receipt: from
                    },
                    group: ['receipt'],
                    order: [
                        [sequelize.literal('"max_timestamp" DESC')]
                    ],
                });

                const timestamp1 = resu.max_timestamp;

                let time = "";

                if (max_timestamp > timestamp1) {
                    time = max_timestamp;
                } else {
                    time = timestamp1;
                }

                const mensa = await Chat.findOne({
                    where: {
                        timestamp: time
                    }
                });

                const name = await NumeroWhatsapp.findOne({
                    where: {
                        from: from
                    }
                });

                let array = {
                    numero: from,
                    contacto: name.nameContact,
                    mensaje: mensa.message
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