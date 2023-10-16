import http from 'http';
import express from "express";
import path from 'path';
import {fileURLToPath} from 'url';

import https from 'https';
import fs from 'fs';

import dotenv from "dotenv";

import axios from "axios";

import PgPubSub from 'pg-pubsub';

dotenv.config();

import { Server } from 'socket.io';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());

app.use(express.static(__dirname + "/public"));

let server;

if (process.env.ENVIRONMENT === "PRODUCCION") {
    const httpsOptions = {
        key: fs.readFileSync('/etc/sslpay2/private.key'),  // Reemplaza con el path a tu archivo .key
        cert: fs.readFileSync('/etc/sslpay2/dominio.crt'),   // Reemplaza con el path a tu archivo .crt
    
        // Si tienes un certificado intermedio o bundle, lo incluyes así:
        ca: fs.readFileSync('/etc/sslpay2/bundle')
    };
    
    server = https.createServer(httpsOptions, app);
} else {
    server = http.createServer(app);
}


const io = new Server(server, {
    cors: {
        origin: process.env.URL_APP+":"+process.env.PUERTO_APP_RED,  // configura la URL de tu cliente o usa "*" para permitir cualquier origen
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

const pubsub = new PgPubSub('postgres://postgres:grupoes2023@157.230.239.170/miasis');

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('getToken', async data => {

        try {
            const token = data.token;
            const response = await axios.get(process.env.URL_APP + ":" + process.env.PUERTO_APP_RED + "/numeroWhatsapp", {
                headers: {
                    'Authorization': `Bearer ${token}`  // <-- Agrega el token en el header de autorización
                }
            });
    
            const datos = response.data;
    
            io.emit('messageContacts', datos);

            if(data.from != process.env.NUMERO_WHATSAPP) {
                io.emit('audioReproducido');
            }

        } catch (error) {
            console.error("Hubo un error al hacer la solicitud:", error);  // <-- Maneja y muestra el error
        }
    });
    
});

pubsub.addChannel('new_contact', async(data) => {
    console.log('New contact added:', data);

    try {
        
        io.emit("messageChat", data);
        
    } catch (error) {
        console.log(error.message);
    }
    
});



server.listen(process.env.PUERTO_SOCKET, () => {
    console.log('listening on *:'+process.env.PUERTO_SOCKET);
});