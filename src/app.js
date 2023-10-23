import express from "express";
import hbs from "hbs";
import path from 'path';
import {fileURLToPath} from 'url';
import bodyParser from "body-parser";
import cors from 'cors';

import login from './routes/login.routes.js';
import dashboard from './routes/dashboard.routes.js';
import tipoTrabajo from './routes/tipoTrabajo.routes.js';
import area from './routes/area.routes.js';
import cargo from './routes/cargo.routes.js';
import carrera from './routes/carrera.routes.js';
import chat from './routes/chat.routes.js';
import potencialCliente from './routes/potencialCliente.routes.js';
import chatEstados from './routes/chatEstados.routes.js';
import clientes from './routes/clientes.routes.js';
import plantillas from './routes/plantilla.routes.js';

const app = express();

const corsOptions = {
    exposedHeaders: ['Authorization'],
    origin: 'https://grupoesconsultores.com',
    methods: 'POST',
    allowedHeaders: ['Content-Type']
};

app.use(cors(corsOptions));

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

hbs.registerPartials(__dirname + '/views/partials', function (err) {});
app.set('view engine', 'hbs');
app.set("views", __dirname + "/views");

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(login);
app.use(dashboard);
app.use(tipoTrabajo);
app.use(area);
app.use(cargo);
app.use(carrera);
app.use(chat);
app.use(potencialCliente);
app.use(chatEstados);
app.use(clientes);
app.use(plantillas);

export default app;