import { Storage } from "@google-cloud/storage";
import axios from "axios"; // Para descargar los archivos desde tu servidor
import fs from "fs"; // Para manejar archivos temporales
import path from "path";

// Configuración de Google Cloud Storage
const storage = new Storage({
  projectId: "whatsapp-webhook-394517",
  keyFilename: "keys.json",
});
const bucket = storage.bucket("appwhatsapp");

export const sendFile = async (req, res) => {
  const { links } = req.body; // Recibimos los links

  if (!Array.isArray(links) || links.length === 0) {
    return res.status(400).json({ error: "No se enviaron links" });
  }

  try {
    const uploadedFiles = await Promise.all(
      links.map(async (link) => {
        try {
          // 1️⃣ Descargamos el archivo desde la URL
          const response = await axios.get(link, {
            responseType: "arraybuffer",
          });
          const fileName = path.basename(new URL(link).pathname); // Extrae el nombre del archivo
          const tempFilePath = `./temp/${fileName}`;

          fs.writeFileSync(tempFilePath, response.data); // Guardamos el archivo temporalmente

          // 2️⃣ Subimos el archivo a Google Cloud Storage
          const blob = bucket.file(fileName);
          await bucket.upload(tempFilePath, {
            destination: fileName,
            public: true,
            metadata: {
              contentType: response.headers["content-type"], // Mantiene el tipo MIME original
            },
          });

          // 3️⃣ Generamos la URL pública del archivo en Google Cloud Storage
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

          // 4️⃣ Eliminamos el archivo temporal
          fs.unlinkSync(tempFilePath);

          return { message: "Archivo subido con éxito", url: publicUrl };
        } catch (error) {
          console.error("Error subiendo archivo:", error);
          return { message: "Error al subir el archivo", url: link };
        }
      })
    );

    return res.json(uploadedFiles);
  } catch (error) {
    console.error("Error en el proceso:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};
