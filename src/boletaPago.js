import axios from "axios";

import dotenv from "dotenv";

import cron from "node-cron";

dotenv.config();

const obtenerBoletasPago = async () => {
  try {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.URL_OBTENER_BOLETAS_PAGO}`,
    };
    const response = await axios.request(config);

    const boletasPago = response.data;

    let contador = 0;

    for (const boleta of boletasPago) {
      try {
        const readApi = await axios.post(
          process.env.API_READ_BOLETA_PAGO,
          {
            pdf_path: `/var/www/html/contabilidad/public/archivos/pdt/${boleta.nameFile}`,
          },
          {
            headers: {
              "Content-Type": "application/json",
              // Authorization: `Bearer ${process.env.API_TOKEN}`
            },
          },
        );

        const datosBoleta = readApi.data;

        if (datosBoleta.success == true) {
          const dataBoleta = datosBoleta.data;

          const saveApi = await axios.post(
            process.env.API_SAVE_BOLETA_PAGO,
            {
              id: boleta.id,
              fecha_ingreso: dataBoleta.Fecha_ingreso,
              numero_documento: dataBoleta.NUMERO_DOCUMENTO,
              tipo_documento: dataBoleta.TIPO_DOCUMENTO,
              nombres: dataBoleta.nombres,
              situacion: dataBoleta.situacion,
              ruc: dataBoleta.RUC,
            },
            {
              headers: {
                "Content-Type": "application/json",
                // Authorization: `Bearer ${process.env.API_TOKEN}`
              },
            },
          );

          const responseApi = saveApi.data;

          if (responseApi.status == "success") {
            contador++;
            console.log(
              `Boleta de pago ID ${boleta.id} procesada y guardada correctamente.`,
            );
          } else {
            console.log(
              `Error al guardar la boleta de pago ID ${boleta.id}: ${responseApi.message}`,
            );
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    console.log(contador);
  } catch (error) {
    console.log(error.message);
    throw new Error("Error al obtener la boleta de pago");
  }
};

cron.schedule("*/2 * * * *", async () => {
  console.log("⏳ Ejecutando cron boletas:", new Date().toLocaleString());
  await obtenerBoletasPago();
});

//obtenerBoletasPago();
