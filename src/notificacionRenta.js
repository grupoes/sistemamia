import cron from "node-cron";
import axios from "axios";

import dotenv from "dotenv";

dotenv.config();

<<<<<<<HEAD
// Ejecutar cada día a las 8 AM
<<<<<<< HEAD
cron.schedule(process.env.CRON_NOTIFICACION_RENTA, async () => {
  try {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: process.env.URL_NOTIFICACION_    };
=======
=======
// Ejecutar cada día a las 9 AM
>>>>>>> 88bf586fce1c696ce280ad184230e3a6e03a65bc
cron.schedule(
  process.env.CRON_NOTIFICACION_RENTA,
  async () => {
    try {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: process.env.URL_NOTIFICACION_RENTA,
      };
>>>>>>> 1a9de409978f39ff45be09493e62e5078aedc7ff

      const response = await axios.request(config);
      const datos = response.data;

<<<<<<< HEAD
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
=======
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
>>>>>>> 1a9de409978f39ff45be09493e62e5078aedc7ff
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
<<<<<<< HEAD
}, {
   timezone: "America/Lima",
});
=======
);
>>>>>>> 1a9de409978f39ff45be09493e62e5078aedc7ff
