import cron from "node-cron";
import axios from "axios";

import dotenv from "dotenv";

dotenv.config();

// Ejecutar cada día a las 8 AM
cron.schedule("45 13 * * *", async () => {
  try {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: process.env.URL_NOTIFICACION_RENTA,
    };

    const response = await axios.request(config);
    const datos = response.data;

    const mensaje = `📩 *Mensaje de Recordatorio de Pago:*

        📌 *Estimado/a Cliente,*

        Esperamos que se encuentre bien. Le recordamos que tiene un *pago pendiente* correspondiente a *su pago de renta* con vencimiento el *28-03-2025*.

        💰 *Monto pendiente:* S/. 150  
        📅 *Fecha límite de pago:* 28-03-2025  
        🏦 *Métodos de pago disponibles:* YAPE

        Le agradeceríamos mucho que realice su pago a la brevedad posible para evitar recargos o interrupciones en el servicio.

        ⚠️ *Si ya realizó el pago, por favor ignore este mensaje.*

        📞 Si tiene alguna consulta, no dude en contactarnos.

        Saludos cordiales,  
        *GRUPO ES CONSULTORES*`;

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
});
