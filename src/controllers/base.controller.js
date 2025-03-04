import { Trabajadores } from "../models/trabajadores.js";
import { Asignacion } from "../models/asignacion.js";
import { Usuario } from "../models/usuario.js";
import { Registros } from "../models/registros.js";
import { Ubigeo } from "../models/ubigeo.js";

import { Op } from "sequelize";

import axios from "axios";

import { Storage } from "@google-cloud/storage";

export const getDataToken = (req, res) => {
  try {
    const rol = req.usuarioToken._role;
    const id = req.usuarioToken._id;
    const name = req.usuarioToken._name;

    return res.json({ message: "ok", rol: rol, id: id, name: name });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getAgenteId = async (req, res) => {
  try {
    const rol = req.usuarioToken._role;
    const id = req.usuarioToken._id;

    const agentes = await Trabajadores.findAll();

    return res.json({ message: "ok", data: agentes, id: id });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const asignarAsistenteData = async () => {
  const totalTrabajadores = await Trabajadores.count({
    where: {
      area_id: 2,
    },
  });

  const asistenteIds = await Trabajadores.findAll({
    where: {
      area_id: 2,
    },
  });

  // Obtener solo los IDs y convertirlos en un array
  const idsArray = asistenteIds.map((asistente) => asistente.id);

  // 2. Obtiene cuántas asignaciones ya existen
  const totalAsignaciones = await Asignacion.count({
    where: {
      trabajadoreId: {
        [Op.in]: idsArray,
      },
    },
  });

  // 3. Usa el operador módulo para determinar el siguiente trabajador
  const trabajadorAsignado = totalAsignaciones % totalTrabajadores;

  // 4. Obtiene el ID del trabajador al que se asignará el cliente
  const trabajador = await Trabajadores.findOne({
    where: {
      area_id: 2,
    },
    offset: trabajadorAsignado,
  });

  return trabajador;
};

export const asignarAsistenteDataJson = async (req, res) => {
  try {
    const totalTrabajadores = await Trabajadores.count({
      where: {
        area_id: 2,
      },
    });

    const asistenteIds = await Trabajadores.findAll({
      where: {
        area_id: 2,
      },
    });

    // Obtener solo los IDs y convertirlos en un array
    const idsArray = asistenteIds.map((asistente) => asistente.id);

    // 2. Obtiene cuántas asignaciones ya existen
    const totalAsignaciones = await Asignacion.count({
      where: {
        trabajadoreId: {
          [Op.in]: idsArray,
        },
      },
    });

    // 3. Usa el operador módulo para determinar el siguiente trabajador
    const trabajadorAsignado = totalAsignaciones % totalTrabajadores;

    // 4. Obtiene el ID del trabajador al que se asignará el cliente
    const trabajador = await Trabajadores.findOne({
      where: {
        area_id: 2,
      },
      offset: trabajadorAsignado,
    });

    return res.json(trabajador);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const registroActividad = async (
  id_usuario,
  tipo_actividad,
  descripcion_detallada,
  fecha_hora,
  direccion_ip,
  dispositivo,
  resultado_actividad
) => {
  try {
    const registro = await Registros.create({
      id_usuario,
      tipo_actividad,
      descripcion_detallada,
      fecha_hora,
      direccion_ip,
      dispositivo,
      resultado_actividad,
    });

    return registro;
  } catch (error) {
    return error.message;
  }
};

export const getAllUbigeo = async (req, res) => {
  try {
    const ubigeos = await Ubigeo.findAll();

    return res.status(200).json({ status: "ok", data: ubigeos });
  } catch (error) {
    return res.status(400).json({ status: "error", message: error.message });
  }
};

export const api_dni = async (req, res) => {
  try {
    const numero = req.params.id;

    const TOKEN_USER = "facturalaya_erickpeso_05jFE7sAOudi8j0";

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://facturalahoy.com/api/persona/${numero}/${TOKEN_USER}/completa`,
    };

    const response = await axios(config);
    const datos = response.data;

    return res.status(200).json({ status: "ok", data: datos });
  } catch (error) {
    return res.status(400).json({ status: "error", message: error.message });
  }
};

let projectId = "whatsapp-webhook-394517"; // Get this from Google Cloud
let keyFilename = "keys.json"; // Get this from Google Cloud -> Credentials -> Service Accounts
const storagePdf = new Storage({
  projectId,
  keyFilename,
});

const bucket = storagePdf.bucket("appwhatsapp");

export const envioArchivoGoogleCloudStorage = async (req, res) => {
  const { links } = req.body; // Recibir un array de links
  let uploadedFiles = [];

  try {
    // Si hay links en la solicitud, agregarlos a la respuesta
    if (Array.isArray(links) && links.length > 0) {
      uploadedFiles = links.map((link) => ({
        message: "Archivo ya disponible",
        url: link,
      }));
    }

    // Si se suben archivos, procesarlos y subirlos a Google Cloud Storage
    if (req.files && req.files.length > 0) {
      console.log("Archivos encontrados, subiéndolos...");

      const uploadPromises = req.files.map((file) => {
        return new Promise(async (resolve, reject) => {
          try {
            const blob = bucket.file(file.originalname);
            const blobStream = blob.createWriteStream();

            blobStream.on("finish", async () => {
              await blob.makePublic();
              const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.originalname}`;
              resolve({ message: "Archivo subido con éxito", url: publicUrl });
            });

            blobStream.on("error", (err) => reject(err));
            blobStream.end(file.buffer);
          } catch (error) {
            reject(error);
          }
        });
      });

      const uploadedLinks = await Promise.all(uploadPromises);
      uploadedFiles = [...uploadedFiles, ...uploadedLinks];
    }

    if (uploadedFiles.length > 0) {
      return res.json(uploadedFiles);
    } else {
      return res
        .status(400)
        .json({ error: "No se encontraron archivos ni links" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};
