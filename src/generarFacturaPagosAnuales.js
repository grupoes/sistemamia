import cron from "node-cron";
import axios from "axios";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

let isWaiting = false;

// Configurar registro de logs mejorado
const logMessage = (message, error = null) => {
  const timestamp = new Date().toISOString();
  let logEntry = `[${timestamp}] ${message}`;

  if (error) {
    logEntry += ` - Error: ${error.message || error}`;
    if (error.response) {
      logEntry += ` | Status: ${error.response.status} | Data: ${JSON.stringify(
        error.response.data
      )}`;
    }
  }

  logEntry += "\n";

  fs.appendFileSync("bot-log-pagos-anuales.txt", logEntry);
  console.log(logEntry.trim());
};

// Función para formatear la fecha actual
function getFormattedDate() {
  const date = new Date();
  const options = {
    timeZone: "America/Lima",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  const formatter = new Intl.DateTimeFormat("en-CA", options);
  const parts = formatter.formatToParts(date);

  // Convertimos a formato YYYY-MM-DD HH:MM:SS
  const y = parts.find((p) => p.type === "year").value;
  const m = parts.find((p) => p.type === "month").value;
  const d = parts.find((p) => p.type === "day").value;
  const h = parts.find((p) => p.type === "hour").value;
  const min = parts.find((p) => p.type === "minute").value;
  const s = parts.find((p) => p.type === "second").value;

  return `${y}-${m}-${d} ${h}:${min}:${s}`;
}

// Función para actualizar el estado del mensaje
async function updateMessageStatus(id, estado) {
  try {
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: process.env.URL_MENSAJES_UPDATE,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        id: id,
        fecha_envio: getFormattedDate(),
        estado: estado,
      },
    };

    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    logMessage(
      `❌ Error al actualizar estado del mensaje ID ${id} a "${estado}"`,
      error
    );
    throw error;
  }
}

cron.schedule(
  "* * * * *",
  async () => {
    try {
      let conf = {
        method: "get",
        maxBodyLength: Infinity,
        url: process.env.URL_PAGOS_ANUALES,
      };

      const resp = await axios.request(conf);
      const data_pago = resp.data;

      for (const dato of data_pago.data) {
        try {
          const config2 = {
            method: "post",
            maxBodyLength: Infinity,
            url: process.env.URL_SAVE_FACTURA,
            headers: {
              "Content-Type": "application/json",
            },
            data: {
              ruc: dato.ruc_empresa,
              razonSocial: dato.razon_social,
              productoName: dato.descripcion,
              precio: dato.monto,
            },
          };

          const response2 = await axios.request(config2);
          const dataEnvio = response2.data;

          if (dataEnvio.respuesta === "ok") {
            try {
              const config3 = {
                method: "post",
                maxBodyLength: Infinity,
                url: process.env.URL_UPDATE_PAGO_ANUAL,
                headers: {
                  "Content-Type": "application/json",
                },
                data: {
                  id: dato.id_pdt_anual,
                  link_pdf: dataEnvio.url_absoluta_a4,
                  link_ticket: dataEnvio.url_absoluta_ticket,
                },
              };

              const response3 = await axios.request(config3);
              const dataEnvio2 = response3.data;

              console.log(dataEnvio2);
            } catch (error) {
              console.log(error.message);
            }
          }
        } catch (error) {
          console.log(error.message);

          logMessage(`No se pudo generar las facturas:`);
        }
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
