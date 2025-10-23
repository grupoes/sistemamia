import cron from "node-cron";
import axios from "axios";

import fs from "fs";

import dotenv from "dotenv";

dotenv.config();

// Configurar registro de logs
const logMessage = (message) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;

  fs.appendFileSync("bot-log-senFacturas.txt", logEntry);
  console.log(logEntry.trim());
};

try {
  let conf = {
    method: "get",
    maxBodyLength: Infinity,
    url: "https://esconsultoresyasesores.com:9300/listaHonorarioFacturas/12",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const resp = await axios.request(conf);
  const facturas = resp.data;

  let no_eviado = 0;
  let comprobantes = [];

  for (const dato of facturas) {
    try {
      let config2 = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://esconsultoresyasesores.com:9300/sendNotaCredito",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          serie_comprobante: dato.serie_comprobante,
          numero_comprobante: dato.numero_comprobante,
          monto: dato.monto,
        },
      };

      const response2 = await axios.request(config2);
      const dataEnvio = response2.data;

      if (dataEnvio.respuesta !== "ok") {
        no_eviado++;
        comprobantes.push({
          serie_comprobante: dato.serie_comprobante,
          numero_comprobante: dato.numero_comprobante,
        });
      }

      console.log(dataEnvio);
    } catch (error) {
      console.log(error.message);
    }
  }

  console.log(no_eviado);
  console.log(comprobantes);
} catch (error) {
  console.log(error.message);
}
