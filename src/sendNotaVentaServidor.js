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
      let conf = {
        method: "get",
        maxBodyLength: Infinity,
        url: process.env.URL_GET_CONTRIBUYENTES_SERVIDOR_AHORA,
      };

      const resp = await axios.request(conf);
      const data_servidor = resp.data.data;

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

            if (dataEnvio.respuesta === "ok") {
              const config3 = {
                method: "post",
                maxBodyLength: Infinity,
                url: process.env.UPDATE_GENERAR_NOTA_VENTA,
                headers: {
                  "Content-Type": "application/json",
                },
                data: {
                  id: dato.idpago,
                  numero_nota: dataEnvio.documento.numero_comprobante,
                  url_pdf: dataEnvio.url_absoluta_a4,
                },
              };

              const response3 = await axios.request(config3);

              console.log(response3.data);
            }
          } catch (error) {
            console.log(error.message);

            logMessage(`No se pudo generar la nota de venta:`);
          }
        }
      }
    } catch (error) {
      console.log(error.message);

      logMessage(`Error al leer las empresas:`);
    }
  },
  {
    timezone: "America/Lima",
  },
);
