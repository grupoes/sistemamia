import { Actividades } from "../models/actividades.js";

export const viewActividades = (req, res) => {
    const timestamp = Date.now();

    const css = [
        'assets/libs/datatables.net-bs4/css/dataTables.bootstrap4.min.css',
        'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.min.css'
    ];

    const js = [
        'assets/libs/datatables.net/js/jquery.dataTables.min.js',
        'assets/libs/datatables.net-bs4/js/dataTables.bootstrap4.min.js',
        'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.all.min.js',
        '/js/actividades.js'+ '?t=' + timestamp
    ];

    res.render('actividades/index', { layout: 'partials/main', css, js });
}

export const allActivities = async (req, res) => {
    try {
        const actividades = await Actividades.findAll({
            where: {
                status: 'activo'
            },
            order: [
                ['id', 'desc']
            ]
        });

        res.status(200).json({status: "ok", data: actividades});

    } catch (error) {
        return res.status(400).json({status: 'error', message: error.message});
    }
}

export const getActivity = async (req, res) => {
    const id = req.params.id;

    try {
        const actividad = await Actividades.findByPk(id);

        if (actividad) {
            res.status(200).json({status: "ok", data: actividad});
        } else {
            res.status(400).json({status: 'error', message: "Actividad no existe"});
        }

    } catch (error) {
        return res.status(400).json({status: 'error', message: error.message});
    }
}

export const createActivity = async (req, res) => {
    const { name, description } = req.body;

    try {
        const status = 'activo';

        const newActividad = await Actividades.create({
            name,
            description,
            status
        });

        res.status(201).json({status: "ok", data: newActividad});

    } catch (error) {
        return res.status(400).json({status: 'error', message: error.message});
    }
}

export const updateActivity = async (req, res) => {
    const { name, description } = req.body;
    const id = req.params.id;
    try {
        const updateActivity = await Actividades.findByPk(id);
        updateActivity.name = name;
        updateActivity.description = description;

        await updateActivity.save();

        res.status(201).json({status: "ok", data: updateActivity});

    } catch (error) {
        return res.status(400).json({status: 'error', message: error.message});
    }
}

export const updataStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const status = 'inactivo';

        const updateActivity = await Actividades.findByPk(id);
        updateActivity.status = status;

        await updateActivity.save();

        res.status(201).json({status: "ok", data: updateActivity});

    } catch (error) {
        return res.status(400).json({status: 'error', message: error.message});
    }
}