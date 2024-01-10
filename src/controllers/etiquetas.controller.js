import { Etiqueta } from "../models/etiquetas.js";
import { Embudo } from "../models/embudo.js";

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
        '/js/etiqueta.js'+ '?t=' + timestamp
    ];

    res.render('etiquetas/index', { layout: 'partials/main', css, js });
}

export const getAllEtiquetas = async(req, res) => {
    try {
        const all = await Etiqueta.findAll({
            where: {
                estado: 1
            },
            include: Embudo
        });

        return res.json({ message: 'ok', response: all });
    } catch (error) {
        return res.status(400).json({ message: 'error', response: error.message });
    }
}

export const saveEtiqueta = async(req, res) => {
    const { idetiqueta, nombre_etiqueta, selectEmbudo } = req.body;
    try {

        if(idetiqueta == 0) {
            const guardar = await Etiqueta.create({
                descripcion: nombre_etiqueta.toUpperCase(),
                color: "#F000FF",
                estado: 1,
                embudo_id: selectEmbudo
            });
    
            return res.json({ message: 'ok', response: guardar, dialog: "Se guardo correctamente la etiqueta" });
            
        } else {
            const act = await Etiqueta.update({ 
                    descripcion: nombre_etiqueta.toUpperCase(),
                    embudo_id: selectEmbudo
                }, {
                where: { 
                    id: idetiqueta
                }
            });

            return res.json({ message: 'ok', response: act, dialog: "Se edito correctamnete la etiqueta" });
        }

    } catch (error) {
        return res.status(400).json({ message: 'error', response: error.message });
    }
}

export const getEtiquetaById = async(req, res) => {
    try {
        const id = req.params.id;

        const getById = await Etiqueta.findOne({
            where: {
                id: id
            }
        });

        return res.json({ message: 'ok', response: getById });

    } catch (error) {
        return res.status(400).json({ message: 'error', response: error.message });
    }
}

export const deleteEtiqueta = async(req, res) => {
    try {
        const id = req.params.id;

        const eli = await Etiqueta.update(
            {
                estado: 0
            },
            {
                where: {
                    id: id
                }
            }
        );

        return res.json({ message: 'ok', response: eli });

    } catch (error) {
        return res.status(400).json({ message: 'error', response: error.message });
    }
}

export const getAllEmbudo = async(req, res) => {
    try {
        const all = await Embudo.findAll({
            where: {
                estado: 1
            }
        });

        return res.json({ message: 'ok', response: all });
    } catch (error) {
        return res.status(400).json({ message: 'error', response: error.message });
    }
}

export const saveEmbudo = async(req, res) => {
    const { idembudo, nombre_embudo } = req.body;
    try {

        if (idembudo == 0) {
            const add = await Embudo.create({
                descripcion: nombre_embudo.toUpperCase(),
                color: "#FF01FF",
                estado: 1
            });

            return res.json({ message: 'ok', response: add, dialog: 'Se agrego correctamente el embudo' });
        } else {
            const act = await Embudo.update(
                {
                    descripcion: nombre_embudo.toUpperCase()
                },
                {
                    where: {
                        id: idembudo
                    }
                }
            );

            return res.json({ message: 'ok', response: act, dialog: 'Se edito correctamente el embudo' });
        }

    } catch (error) {
        return res.status(400).json({ message: 'error', response: error.message });
    }
}

export const getEmbudoById = async(req, res) => {
    try {
        const id = req.params.id;

        const getId = await Embudo.findOne({
            where: {
                id: id
            }
        });

        return res.json({ message: 'ok', response: getId });

    } catch (error) {
        return res.status(400).json({ message: 'error', response: error.message });
    }
}

export const deleteEmbudo = async(req, res) => {
    try {
        const id = req.params.id;

        const dele = await Embudo.update(
            {
                estado: 0
            }, {
                where: {
                    id: id
                }
            }
        );

        return res.json({ message: 'ok', response: dele });
    } catch (error) {
        return res.status(400).json({ message: 'error', response: error.message });
    }
}