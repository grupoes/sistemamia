import { Publicidad } from "../models/publicidad.js";

import multer from 'multer';

export const indexView = (req, res) => {
    const timestamp = Date.now();

    const css = [
        'assets/libs/datatables.net-bs4/css/dataTables.bootstrap4.min.css',
        'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.min.css'
    ];

    const js = [
        'assets/libs/datatables.net/js/jquery.dataTables.min.js',
        'assets/libs/datatables.net-bs4/js/dataTables.bootstrap4.min.js',
        'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.all.min.js',
        '/js/publicidad.js'+ '?t=' + timestamp
    ];

    res.render('publicidad/index', { layout: 'partials/main', css, js });
}

// Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/public/publicidad/')  // Directorio donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        
        const newFilename = changeNameFile(file.originalname);
        cb(null, `${Date.now()}-${newFilename}`)
    }
});

function changeNameFile(filename) {
    // Reemplazar espacios por guiones
    const textoSinEspacios = filename.replace(/\s+/g, '-');

    // Quitar tildes y caracteres especiales
    const textoLimpio = quitarTildes(textoSinEspacios);

    return textoLimpio;
}

function quitarTildes(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-.]/g, "") // Excluimos el punto (.)
        .replace(/[\s]+/g, "-")
        .replace(/[áéíóúÁÉÍÓÚ]/g, function(match) {
        switch (match) {
            case 'á': return 'a';
            case 'é': return 'e';
            case 'í': return 'i';
            case 'ó': return 'o';
            case 'ú': return 'u';
            case 'Á': return 'A';
            case 'É': return 'E';
            case 'Í': return 'I';
            case 'Ó': return 'O';
            case 'Ú': return 'U';
        }
        })
        .toLowerCase();
}

const upload = multer({ storage: storage });

export const uploadSingle = upload.single('imagen-referencial');

export const addPublicidad = async (req, res, next) => {

    const { numero_publicidad, nombre_publicidad, descripcion_publicidad } = req.body;

    try {

        const verificarCodigo = await Publicidad.findOne({
            where: {
                codigo: numero_publicidad
            }
        });

        if(verificarCodigo) {
            return res.json({ message: 'existe', response: "El código de publicidad ya existe" });
        }

        const newPublicidad = await Publicidad.create({
            nombre: nombre_publicidad,
            descripcion: descripcion_publicidad,
            codigo: numero_publicidad,
            imagen: req.file.filename,
            estado: 1
        });

        return res.json({ message: 'ok', data: newPublicidad });
    } catch (error) {
        return res.status(400).json({ message: 'error', response: error.message });
    }

}

export const getAllPublicidad = async(req, res) => {
    try {
        const all = await Publicidad.findAll({
            order: [
                ['id', 'desc']
            ]
        });

        return res.json({ message: 'ok', data: all });
    } catch (error) {
        return res.status(400).json({ message: 'error', response: error.message });
    }
}

export const disabledPublicidad = async (req, res) => {
    const { id, estado } = req.body;
    try {

        let act = "";

        if(estado == "1") {
            act = 1;
        } else {
            act = 2;
        }

        const update = await Publicidad.update({ estado: act }, {
            where: { id: id }
        });

        return res.json({ message: 'ok', data: update });
        
    } catch (error) {
        return res.status(400).json({ message: 'error', response: error.message });
    }
}

export const deletePublicidad = async(req, res) => {
    try {
        const id = req.params.id;

        const eliminar = await Publicidad.destroy({
            where: {
                id: id
            }
        });

        return res.json({ message: 'ok', response: eliminar });
    } catch (error) {
        return res.status(400).json({ message: 'error', response: error.message });
    }
}

export const getPublicidadById = async(req, res) => {
    try {
        const id = req.params.id;

        const getById = await Publicidad.findOne({
            where: {
                id: id
            }
        });

        return res.json({ message: 'ok', response: getById });
    } catch (error) {
        return res.status(400).json({ message: 'error', response: error.message });
    }
}