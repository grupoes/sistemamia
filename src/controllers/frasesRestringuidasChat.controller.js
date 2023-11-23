import { FraseFinChat } from "../models/fraseFinChat.js";

export const viewFrase = (req, res) => {
    const css = [
        'assets/libs/datatables.net-bs4/css/dataTables.bootstrap4.min.css',
        'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.min.css'
    ];

    const js = [
        'assets/libs/datatables.net/js/jquery.dataTables.min.js',
        'assets/libs/datatables.net-bs4/js/dataTables.bootstrap4.min.js',
        'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.all.min.js',
        'js/fraseRestringuidas.js'
    ];

    res.render('configuracion/fraseFinChat', { layout: 'partials/main', css: css, js: js });
}

export const allFrases = async (req, res) => {
    try {
        const frases = await FraseFinChat.findAll({
            where: {
                estado: 1
            }
        });

        res.status(200).json({message: "ok", data: frases});

    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

export const getFrase = async (req, res) => {
    const id = req.params.id;

    try {
        const frase = await FraseFinChat.findByPk(id);

        if (frase) {
            res.status(200).json({status: "ok", data: frase});
        } else {
            res.status(400).json({message: "Frase no existe"});
        }

    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

export const createFrase = async (req, res) => {
    const { namefrase } = req.body;

    try {

        const id = req.usuarioToken._id;

        const newFrase = await FraseFinChat.create({
            descripcion: namefrase,
            user_register: id
        });

        return res.status(201).json({message: "ok", data: newFrase});

    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

export const updateFrase= async (req, res) => {
    const { descripcion } = req.body;
    const id = req.params.id;
    try {
        const fraseAct = await FraseFinChat.findByPk(id);
        fraseAct.descripcion = descripcion;

        await fraseAct.save();

        res.status(201).json({status: "ok", data: fraseAct});

    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

export const deleteFrase = async (req, res) => {
    const id = req.params.id;
    try {
        const numRowsDeleted = await FraseFinChat.destroy({
            where: {
              id: id // ID del usuario que deseas eliminar
            }
        });

        return res.json({ message: 'ok', data: numRowsDeleted })
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}