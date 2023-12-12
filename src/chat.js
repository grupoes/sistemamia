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

const pubsub = new PgPubSub(`postgres://postgres:${process.env.PASSWORDDB}@${process.env.HOST}/${process.env.DATABASE}`);

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('getToken', async data => {

        console.log(data);

        try {
            const token = data.token;
            const etiqueta = data.etiqueta;
            const plataforma_id = data.plataforma_id;

            const post = {
                etiqueta: etiqueta,
                plataforma_id: plataforma_id,
                new_message: data.new_message
            };

            const requestConfig = {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`
                },
                data: post 
            };

            const response = await axios(process.env.URL_APP + ":" + process.env.PUERTO_APP_RED + "/actualizarContactList", requestConfig);
    
            const datos = response.data;

            console.log(datos);
    
            /* io.emit('messageContacts', datos);

            if(data.sonido === true) {
                if(data.from != process.env.NUMERO_WHATSAPP) {
                    if(data.rol == 2) {
                        if(data.id == datos.id) {
                            io.emit('audioReproducido');
                        }
                    } else {
                        io.emit('audioReproducido');
                    }
                    
                }
            } */

        } catch (error) {
            console.error("Hubo un error al hacer la solicitud:", error);  // <-- Maneja y muestra el error
        }
    });

    socket.on('mensajes_no_respondidos', async data => {
        try {
            const token = data.token;

            const requestConfig = {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`
                }
            };

            const response = await axios(process.env.URL_APP + ":" + process.env.PUERTO_APP_RED + "/contactosNoContestados", requestConfig);

            const datos = response.data;

            if(process.env.ENVIRONMENT === 'PRODUCCION') {
                io.emit('mostrar_notificaciones_chat', datos);
            } else {
                io.emit('mostrar_notificaciones_chat', []);
            }

        } catch (error) {
            console.error("Hubo un error al hacer la solicitud:", error);
        }
    });
    
});

pubsub.addChannel('new_contact', async(data) => {
    console.log('New contact added:', data);

    try {
        const response = await axios.get(process.env.URL_APP + ":" + process.env.PUERTO_APP_RED + "/socketMensaje/"+data.id);

        const datos = response.data;

        const enviar_data = {
            data_chat: datos,
            new_message: data
        };

        io.emit("messageChat", enviar_data);
        
    } catch (error) {
        console.log(error.message);
    }
    
});

pubsub.addChannel('new_status_chat', async(data) => {
    try {
        /*const response = await axios.get(process.env.URL_APP + ":" + process.env.PUERTO_APP_RED + "/getChatCodigo/"+data.codigo);

        const datos = response.data;*/

        io.emit("messageStatus", data);

    } catch (error) {
        console.log(error.message);
    }
});

server.listen(process.env.PUERTO_SOCKET, () => {
    console.log('listening on *:'+process.env.PUERTO_SOCKET);
});