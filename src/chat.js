import http from 'http';
import express from "express";
import path from 'path';
import {fileURLToPath} from 'url';

import dotenv from "dotenv";

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
        origin: process.env.URL_APP+":"+process.env.PUERTO_APP,  // configura la URL de tu cliente o usa "*" para permitir cualquier origen
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');
});

server.listen(process.env.PUERTO_SOCKET, () => {
    console.log('listening on *:'+process.env.PUERTO_SOCKET);
});