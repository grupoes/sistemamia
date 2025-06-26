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

cron.schedule("03 15 26 * *", async () => {
  try {
    let conf = {
      method: "post",
      maxBodyLength: Infinity,
      url: process.env.URL_INSERT_HONORARIO,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        ruc: "12345678912",
      },
    };

    const resp = await axios.request(conf);
    const hono = resp.data;

    const idHonorario = hono.registro.id;

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: process.env.URL_LISTA_EMPRESAS,
    };

    const response = await axios.request(config);
    const datos = response.data;

    for (const dato of datos) {
      try {
        let config2 = {
          method: "post",
          maxBodyLength: Infinity,
          url: process.env.URL_SAVE_FACTURA,
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            ruc: dato.ruc,
            razonSocial: dato.razon_social,
            productoName: dato.descripcion,
            precio: dato.monto_mensual,
          },
        };

        const response2 = await axios.request(config2);
        const dataEnvio = response2.data;

        if (dataEnvio.respuesta === "ok") {
          let confInsert = {
            method: "post",
            maxBodyLength: Infinity,
            url: process.env.URL_INSERT_FACTURA,
            headers: {
              "Content-Type": "application/json",
            },
            data: {
              honorario_id: idHonorario,
              contribuyente_id: dato.id,
              tipo_doc: dataEnvio.documento.id_tipodoc_electronico,
              serie_comprobante: dataEnvio.documento.serie_comprobante,
              numero_comprobante: dataEnvio.documento.numero_comprobante,
              tipo_envio_sunat: dataEnvio.documento.tipo_envio_sunat,
              titulo: dataEnvio.titulo,
              mensaje: dataEnvio.mensaje,
              url_absoluta_a4: dataEnvio.url_absoluta_a4,
              url_absoluta_ticket: dataEnvio.url_absoluta_ticket,
              anio: hono.registro.year,
              mes: hono.registro.mes,
              descripcion: hono.registro.descripcion,
              estado: "aceptado",
            },
          };

          const respInsert = await axios.request(confInsert);
          const dataInsert = respInsert.data;

          logMessage(`factura insertada: ${dataEnvio.mensaje}`);
        } else {
          let confInsert = {
            method: "post",
            maxBodyLength: Infinity,
            url: process.env.URL_INSERT_FACTURA,
            headers: {
              "Content-Type": "application/json",
            },
            data: {
              honorario_id: idHonorario,
              contribuyente_id: dato.id,
              tipo_doc: "",
              serie_comprobante: "",
              numero_comprobante: "",
              tipo_envio_sunat: "",
              titulo: "",
              mensaje: "",
              url_absoluta_a4: "",
              url_absoluta_ticket: "",
              anio: hono.registro.year,
              mes: hono.registro.mes,
              descripcion: hono.registro.descripcion,
              estado: "pendiente",
            },
          };

          const respInsert = await axios.request(confInsert);
          const dataInsert = respInsert.data;

          logMessage(`factura no insertada`);
        }
      } catch (error) {
        let confInsert = {
          method: "post",
          maxBodyLength: Infinity,
          url: process.env.URL_INSERT_FACTURA,
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            honorario_id: idHonorario,
            contribuyente_id: dato.id,
            tipo_doc: "",
            serie_comprobante: "",
            numero_comprobante: "",
            tipo_envio_sunat: "",
            titulo: "",
            mensaje: "",
            url_absoluta_a4: "",
            url_absoluta_ticket: "",
            anio: hono.registro.year,
            mes: hono.registro.mes,
            descripcion: hono.registro.descripcion,
            estado: "pendiente",
          },
        };

        const respInsert = await axios.request(confInsert);
        const dataInsert = respInsert.data;

        logMessage(`factura no inserta error`);
      }
    }
  } catch (error) {
    console.log(error.message);

    logMessage(`Error al leer las empresas:`);
  }
});
