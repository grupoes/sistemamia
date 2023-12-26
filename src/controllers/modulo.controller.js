import { Modulos } from "../models/modules.js";
import { Actions } from "../models/actions.js";

import { ModuleActions } from "../models/ModuleActions.js";

export const index = (req, res) => {
    const timestamp = Date.now();

    const css = [
        'assets/libs/datatables.net-bs4/css/dataTables.bootstrap4.min.css',
        'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.min.css'
    ];

    const js = [
        'assets/libs/datatables.net/js/jquery.dataTables.min.js',
        'assets/libs/datatables.net-bs4/js/dataTables.bootstrap4.min.js',
        'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.all.min.js',
        '/js/modulos.js'+ '?t=' + timestamp
    ];

    res.render('modulo/index', { layout: 'partials/main', css, js });
}

export const getAllModulos = async (req, res) => {
    try {
        const modulos = await Modulos.findAll({
            where: {
                status: 'activo'
            },
            order: [
                ['id', 'asc']
            ]
        });

        for (const modulo of modulos) {
            if (modulo.fatherId != 0) {
                const moduloPadre = await Modulos.findOne({
                    where: {
                        id: modulo.fatherId
                    }
                });
                let plainObject = modulo.get({ plain: true });
                plainObject.moduloPadre = moduloPadre.get({ plain: true });
            }
        }

        return res.status(200).json({status: "ok", data: modulos});

    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

export const getAllActions = async (req, res) => {
    try {
        const actions = await Actions.findAll({
            where: {
                status: 'activo'
            },
            order: [
                ['id', 'asc']
            ]
        });

        return res.status(200).json({status: "ok", data: actions});
    } catch (error) {
        return res.status(400).json({status: 'error', message: error.message});
    }
}

export const getModuleFather = async (req, res) => {
    try {
        const padres = await Modulos.findAll({
            where: {
                fatherId: 0
            }
        });

        return res.status(200).json({ status: 'ok', data: padres });
    } catch (error) {
        return res.status(400).json({status: 'error', message: error.message});
    }
}

export const createModule = async (req, res) => {

    const { nameModule, urlModulo, iconoModulo } = req.body;

    try {

        let padre = "";
        let array_actions = [];

        if(req.body.espadre) {
            padre = 0;
        } else {
            padre = req.body.modulopadre;
            array_actions = req.body.actions;
        }

        const newModule = await Modulos.create({
            fatherId: padre,
            name: nameModule,
            url: urlModulo,
            icono: iconoModulo,
            status: "activo"
        });

        for (let i = 0; i < array_actions.length; i++) {
            let actionId = array_actions[i];
            await ModuleActions.create({ 
                actionId: actionId, 
                moduleId: newModule.id
            });
            
        }

        return res.json({ status: 'ok', data: newModule });

    } catch (error) {
        return res.status(400).json({status: 'error', message: error.message});
    }
}