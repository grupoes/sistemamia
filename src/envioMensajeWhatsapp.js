import cron from "node-cron";
import axios from "axios";

import dotenv from "dotenv";

dotenv.config();

let isWaiting = false;

// Función para generar un intervalo aleatorio entre 5 y 8 minutos
function getRandomIntervalInMs(min = 5, max = 8) {
  const minutos = Math.floor(Math.random() * (max - min + 1)) + min;
  return minutos * 60 * 1000; // Convertimos a milisegundos
}

cron.schedule(
  "* * * * *",
  async () => {
    if (isWaiting) {
      console.log("⏳ Aún en espera... Saltando este minuto.");
      return;
    }

    try {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: process.env.URL_MENSAJES_PENDIENTES,
      };

      const response = await axios.request(config);
      const datos = response.data;

      if (datos.length === 0) {
        console.log("✅ No hay mensajes por enviar.");
        return;
      }

      console.log(`🚀 Procesando ${datos.length} mensajes...`);

      for (const dato of datos) {
        const config2 = {
          method: "post",
          maxBodyLength: Infinity,
          url: `${dato.link}/send-message`,
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            number: dato.numero_whatsapp,
            message: dato.message,
            mediaUrl: "",
          },
        };

        const response2 = await axios.request(config2);
        const dataMensaje = response2.data;

        console.log(dataMensaje.success);

        if (dataMensaje.success === true) {
          // Convertimos a milisegundos
          const date = new Date();

          // Formateamos la fecha
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

          const formatted = `${y}-${m}-${d} ${h}:${min}:${s}`;

          let config3 = {
            method: "post",
            maxBodyLength: Infinity,
            url: process.env.URL_MENSAJES_UPDATE,
            headers: {
              "Content-Type": "application/json",
            },
            data: {
              id: dato.id,
              fecha_envio: formatted,
            },
          };

          const response3 = await axios.request(config3);
          const updateMensaje = response3.data;

          console.log("actualizado:" + updateMensaje);
        }

        console.log(`Mensaje enviado a ${dato.numero_whatsapp}`);
      }
    } catch (error) {
      console.error(
        `Error al enviar mensaje a ${dato.numero_whatsapp}:`,
        error.response?.data || error.message
      );
    }

    // Intervalo aleatorio entre 5 y 8 minutos
    const randomInterval = getRandomIntervalInMs();
    const minutos = randomInterval / 60000;

    // Activamos la bandera de espera
    isWaiting = true;
    console.log(
      `⏱️ Esperando ${minutos} minutos antes del siguiente bloque...`
    );

    setTimeout(() => {
      isWaiting = false;
      console.log(
        "🔁 Fin de la espera. Ya puede ejecutarse el próximo bloque."
      );
    }, randomInterval);
  },
  {
    timezone: "America/Lima",
  }
);
