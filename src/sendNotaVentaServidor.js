import cron from "node-cron";
import axios from "axios";

import fs from "fs";

import dotenv from "dotenv";

dotenv.config();

// Configurar registro de logs
const logMessage = (message) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;

  fs.appendFileSync("bot-log-notas-venta.txt", logEntry);
  console.log(logEntry.trim());
};

cron.schedule(
  process.env.CRON_GENERAR_NOTA_VENTA,
  async () => {
    try {
      const config2 = {
        method: "post",
        maxBodyLength: Infinity,
        url: "http://localhost:8000/api/generar-nota-venta-servidor",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          ruc: "20610266933",
          razonSocial: "SAN DIEGO GROUP E.I.R.L.",
          productoName:
            "SERVICIO POR EL SERVIDOR DEL SISTEMA DE FACTURACION DEL PERIODO: 2025-09-14 AL 2026-09-13",
          precio: 70.0,
        },
      };

      const response2 = await axios.request(config2);
      const dataEnvio = response2.data;

      console.log(dataEnvio);

      logMessage(`idNotaVenta: ${dataEnvio.respuesta}`);

      /*let conf = {
        method: "get",
        maxBodyLength: Infinity,
        url: process.env.URL_GET_CONTRIBUYENTES_SERVIDOR,
      };

      const resp = await axios.request(conf);
      const data_servidor = resp.data;

      for (const dato of data_servidor) {
        if (dato.pagos === "ok") {
          try {
            const config2 = {
              method: "post",
              maxBodyLength: Infinity,
              url: process.env.URL_GENERAR_NOTA_VENTA,
              headers: {
                "Content-Type": "application/json",
              },
              data: {
                ruc: dato.ruc,
                razonSocial: dato.razon_social,
                productoName: dato.descripcion,
                precio: dato.monto,
              },
            };

            const response2 = await axios.request(config2);
            const dataEnvio = response2.data;

            console.log(dataEnvio);

            logMessage(`idNotaVenta: ${dataEnvio.respuesta}`);
          } catch (error) {
            console.log(error.message);

            logMessage(`No se pudo generar la nota de venta:`);
          }
        }
      }*/
    } catch (error) {
      console.log(error.message);

      logMessage(`Error al leer las empresas:`);
    }
  },
  {
    timezone: "America/Lima",
  }
);
