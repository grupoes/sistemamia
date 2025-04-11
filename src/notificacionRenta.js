import cron from "node-cron";
import axios from "axios";

import dotenv from "dotenv";

dotenv.config();

// Ejecutar cada día a las 8 AM
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

      const mensaje = `📢 Estimado Contribuyente:
      SQUARE C&C LIMA SAC

      Le informamos que el 🗓️ miércoles 19 de marzo de 2025, vence el plazo para el pago de sus obligaciones tributarias ante SUNAT correspondientes al periodo de FEBRERO 2025 📆.

      ⚠️ Recomendamos realizar el pago oportuno para evitar intereses moratorios 💸 y procedimientos de cobranza coactiva ⚖️.

      ✅ Si ya efectuó el pago, por favor desestime este mensaje.

      Atentamente,
      ES CONSULTORES Y ASESORES S.A.C. 🤝`;

      for (const dato of datos) {
        if (dato.contactos.length > 0) {
          for (const contacto of dato.contactos) {
            try {
              const config2 = {
                method: "post",
                maxBodyLength: Infinity,
                url: "http://64.23.188.190:3002/send-message",
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
              console.log(
                `Mensaje enviado a ${contacto.numero_whatsapp}:`,
                response2.data
              );
            } catch (error) {
              console.error(
                `Error al enviar mensaje a ${contacto.numero_whatsapp}:`,
                error.response?.data || error.message
              );
            }
          }
        }
      }
    } catch (error) {
      console.error(
        "Error en la solicitud de empresas:",
        error.response?.data || error.message
      );
    }
  },
  {
    timezone: "America/Lima",
  }
);
