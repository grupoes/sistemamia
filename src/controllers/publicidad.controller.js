import multer from 'multer';
import path from 'path';

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

    console.log(req.file);

}