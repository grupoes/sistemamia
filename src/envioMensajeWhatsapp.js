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

  fs.appendFileSync("bot-log-envio-masivo.txt", logEntry);
  console.log(logEntry.trim());
};

// Función para generar un intervalo aleatorio entre 5 y 8 minutos
function getRandomIntervalInMs(min = 5, max = 8) {
  const minutos = Math.floor(Math.random() * (max - min + 1)) + min;
  return minutos * 60 * 1000; // Convertimos a milisegundos
}

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
    if (isWaiting) {
      logMessage("⏳ Aún en espera... Saltando este minuto.");
      return;
    }

    try {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: process.env.URL_MENSAJES_PENDIENTES,
        timeout: 10000, // 10 segundos de timeout
      };

      const response = await axios.request(config);
      const datos = response.data;

      if (!Array.isArray(datos)) {
        throw new Error("La respuesta de mensajes pendientes no es un array");
      }

      if (datos.length === 0) {
        logMessage("✅ No hay mensajes por enviar.");
        return;
      }

      logMessage(`🚀 Procesando ${datos.length} mensajes...`);

      for (const dato of datos) {
        try {
          if (
            !dato.link ||
            !dato.numero_whatsapp ||
            !dato.message ||
            !dato.id
          ) {
            logMessage(`⚠️ Datos incompletos en mensaje ID ${dato.id}`);
            await updateMessageStatus(
              dato.id,
              "no enviado - datos incompletos"
            );
            continue;
          }

          const config2 = {
            method: "post",
            maxBodyLength: Infinity,
            url: `${dato.link}/api/whatsapp/send`,
            headers: {
              "Content-Type": "application/json",
            },
            data: {
              numeroDestino: dato.numero_whatsapp,
              mensaje: dato.message,
            },
            timeout: 15000, // 15 segundos de timeout para el envío
          };

          const response2 = await axios.request(config2);
          const dataMensaje = response2.data;

          if (!dataMensaje || dataMensaje.success !== true) {
            throw new Error(
              "El envío no fue exitoso según la respuesta del servidor"
            );
          }

          logMessage(`✔️ Mensaje enviado a ${dato.numero_whatsapp}`);
          await updateMessageStatus(dato.id, "enviado");
        } catch (error) {
          logMessage(
            `❌ Error al enviar mensaje a ${dato.numero_whatsapp} (ID: ${dato.id})`,
            error
          );

          try {
            await updateMessageStatus(dato.id, "no enviado");
            logMessage(
              `🔄 Estado actualizado a "no enviado" para ID ${dato.id}`
            );
          } catch (updateError) {
            logMessage(
              `❌❌ Error crítico al actualizar estado fallido para ID ${dato.id}`,
              updateError
            );
          }
        }
      }
    } catch (error) {
      logMessage("🔥 Error general en el proceso de envío", error);
    }

    // Intervalo aleatorio entre 5 y 8 minutos
    const randomInterval = getRandomIntervalInMs();
    const minutos = randomInterval / 60000;

    // Activamos la bandera de espera
    isWaiting = true;
    logMessage(`⏱️ Esperando ${minutos} minutos antes del siguiente bloque...`);

    setTimeout(() => {
      isWaiting = false;
      logMessage("🔁 Fin de la espera. Ya puede ejecutarse el próximo bloque.");
    }, randomInterval);
  },
  {
    timezone: "America/Lima",
  }
);
