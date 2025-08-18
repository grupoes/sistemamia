import cron from "node-cron";
import axios from "axios";

import fs from "fs";

import dotenv from "dotenv";

dotenv.config();

// Configurar registro de logs
const logMessage = (message) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;

  fs.appendFileSync("bot-log-tipo-cambio.txt", logEntry);
  console.log(logEntry.trim());
};

cron.schedule(
  process.env.CRON_SAVE_TIPO_CAMBIO,
  async () => {
    try {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: process.env.URL_INSERT_TIPO_CAMBIO,
      };

      const response = await axios.request(config);
      const datos = response.data;

      if (datos.status === "success") {
        console.log("Tipo de cambio guardado con éxito");

        logMessage(`Tipo de cambio guardado con éxito`);
      } else {
        console.log("Error al guardar el tipo de cambio");

        logMessage(`Error al guardar el tipo de cambio`);
      }
    } catch (error) {
      console.log(error.message);

      logMessage(`Error al leer las empresas:`);
    }
  },
  {
    timezone: "America/Lima",
  }
);
