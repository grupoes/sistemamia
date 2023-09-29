import http from 'http';
import express from "express";
import path from 'path';
import {fileURLToPath} from 'url';

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

const server = http.createServer(app);
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

});

pubsub.addChannel('new_contact', async(data) => {
    console.log('New contact added:', data);

    const response = await axios.get(process.env.URL_APP+":"+process.env.PUERTO_APP+"/numeroWhatsapp");
    const datos = response.data;

    io.emit('messageContacts', datos);
    io.emit("messageChat", data);
});



server.listen(process.env.PUERTO_SOCKET, () => {
    console.log('listening on *:'+process.env.PUERTO_SOCKET);
});