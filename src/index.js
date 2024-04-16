import https from 'https';
import fs from 'fs';

import app from "./app.js";

import dotenv from "dotenv";

import { sequelize } from "./database/database.js";

/*import './models/tipoDocumento.js';
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
import './models/numerosWhatsapp.js';*/
/* import './models/modules.js';
import './models/actions.js';
import './models/permissions.js';
import './models/associate.js';
import './models/publicidad.js';*/

//import './models/proyecto.js';


dotenv.config();

async function main() {
    try {
        //await sequelize.sync({alter: true});

        if (process.env.ENVIRONMENT === 'DESARROLLO') {
            app.listen(process.env.PUERTO_APP);
            console.log('Server listening on port', process.env.PUERTO_APP);
        } else {
            const httpsOptions = {
                key: fs.readFileSync('/etc/sslpay2/private.key'),  // Reemplaza con el path a tu archivo .key
                cert: fs.readFileSync('/etc/sslpay2/dominio.crt'),   // Reemplaza con el path a tu archivo .crt
            
                // Si tienes un certificado intermedio o bundle, lo incluyes así:
                ca: fs.readFileSync('/etc/sslpay2/bundle')
            };

            https.createServer(httpsOptions, app).listen(process.env.PUERTO_APP, () => {
                console.log('Servidor corriendo con HTTPS en https://localhost:4000/');
            });
        }
        
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

main();