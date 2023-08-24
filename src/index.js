import app from "./app.js";

import { sequelize } from "./database/database.js";

import './models/tipoDocumento.js';
import './models/area.js';
import './models/cargos.js';
import './models/plataforma.js';
import './models/potencialCliente.js';
import './models/publicidad.js';
import './models/trabajadores.js';
import './models/usuario.js';
import './models/trabajadorCargo.js';
import './models/asignacion.js';
import './models/tipo_institucion.js';
import './models/institucion.js';
import './models/tipoTrabajo.js';
import './models/carrera.js';
import './models/ubigeo.js';
import './models/chat.js';
import './models/estadosConversacion.js';

async function main() {
    try {
        await sequelize.sync({alter: true});

        app.listen(4000);
        console.log('Server listening on port', 4000);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

main();