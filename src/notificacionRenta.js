import cron from "node-cron";
import axios from "axios";

import fs from "fs";

import dotenv from "dotenv";

dotenv.config();

// Configurar registro de logs
const logMessage = (message) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;

  fs.appendFileSync("bot-log-renta.txt", logEntry);
  console.log(logEntry.trim());
};

// Ejecutar cada día a las 9 AM
cron.schedule(
  process.env.CRON_NOTIFICACION_RENTA,
  async () => {
    try {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: process.env.URL_NOTIFICACION_RENTA,
      };

      const response = await axios.request(config);
      const datos = response.data;

      for (const dato of datos) {
        if (dato.contactos.length > 0) {
          for (const contacto of dato.contactos) {
            try {
              const mensaje = `📢 Estimado Contribuyente: *${dato.razon_social}*

          Le informamos que el 🗓️ *${dato.fechaExacta}*, vence el plazo para el pago de sus obligaciones tributarias ante SUNAT correspondientes al periodo de ${dato.periodo} 📆.

          ⚠️ Recomendamos realizar el pago oportuno para evitar intereses moratorios 💸 y procedimientos de cobranza coactiva ⚖️.

          ✅ Si ya efectuó el pago, por favor desestime este mensaje.

          Atentamente,
          *ES CONSULTORES Y ASESORES S.A.C.* 🤝`;

              const config2 = {
                method: "post",
                maxBodyLength: Infinity,
                url: `${dato.link}/send-message`,
                headers: {
                  "Content-Type": "application/json",
                },
                data: {
                  number: contacto.numero_whatsapp,
                  message: mensaje,
                  mediaUrl: "",
                },
              };

              const response2 = await axios.request(config2);
              logMessage(
                `Mensaje enviado a ${contacto.numero_whatsapp}:`,
                response2.data
              );

              logMessage(`Enviado desde ${dato.link}`);
            } catch (error) {
              logMessage(
                `Error al enviar mensaje a ${contacto.numero_whatsapp}:`,
                error.response?.data || error.message
              );
            }
          }
        }
      }
    } catch (error) {
      logMessage(
        "Error en la solicitud de empresas:",
        error.response?.data || error.message
      );
    }
  },
  {
    timezone: "America/Lima",
  }
);
