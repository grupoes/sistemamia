import { Actividades } from "../models/actividades.js";
import { PerfilActividad } from "../models/perfilActividad.js";

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

        return res.status(200).json({status: "ok", data: actividades});

    } catch (error) {
        return res.status(400).json({status: 'error', message: error.message});
    }
}

export const getActivity = async (req, res) => {
    const id = req.params.id;

    try {
        const actividad = await Actividades.findByPk(id);

        if (actividad) {
            return res.status(200).json({status: "ok", data: actividad});
        } else {
            return res.status(400).json({status: 'error', message: "Actividad no existe"});
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

        return res.status(201).json({status: "ok", data: newActividad});

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

        return res.status(201).json({status: "ok", data: updateActivity});

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

        return res.status(201).json({status: "ok", data: updateActivity});

    } catch (error) {
        return res.status(400).json({status: 'error', message: error.message});
    }
}

//aca vamos hacer una api para traer todas las actividades y cual de ellas estan asignadas

export const actividadesPerfil = async (req, res) => {
    try {
        const id = req.params.id;

        const actividades = await Actividades.findAll({
            where: {
                status: 'activo'
            },
            order: [
                ['id', 'asc']
            ]
        });

        let actividadPerfil = [];

        for (const actividad of actividades) {
            const existe = await PerfilActividad.findOne({
                where: {
                    areaId: id,
                    actividadeId: actividad.id
                }
            });

            let check = 0;

            if (existe) {
                check = 1;
            }

            const dataActividad = {
                id: actividad.id,
                nombre: actividad.name,
                perfil: id,
                check: check
            }

            actividadPerfil.push(dataActividad);
        }

        return res.status(201).json({status: "ok", data: actividadPerfil});

    } catch (error) {
        return res.status(400).json({status: 'error', message: error.message});
    }
}

export const savePerfilActivity = async (req, res) => {
    try {
        const { perfil, activity } = req.body;

        const add = await PerfilActividad.create({
            actividadeId: activity,
            areaId: perfil
        });

        return res.status(201).json({status: "ok", data: add});

    } catch (error) {
        return res.status(400).json({status: 'error', message: error.message});
    }
}

export const deleteActivityPerfil = async (req, res) => {
    try {
        const perfil = req.params.perfil;
        const activity = req.params.activity;

        const item = await PerfilActividad.findOne({
            where: {
              actividadeId: activity,
              areaId: perfil
            }
        })

        if (!item) {
            return res.status(404).json({ status: 'error', message: 'Item not found' });
        }

        // Elimina el registro
        await item.destroy();

        return res.status(200).json({ status: 'ok', message: 'Registro eliminado correctamente' });

    } catch (error) {
        return res.status(400).json({status: 'error', message: error.message});
    }
}

export const saveAllPerfilActivity = async (req, res) => {
    try {
        const { activities, perfil } = req.body;

        const items = await PerfilActividad.findAll({
            where: {
              areaId: perfil
            }
        })

        if(items) {
            await Promise.all(items.map(item => item.destroy()));
        }

        for (let i = 0; i < activities.length; i++) {
            const activity = activities[i];

            const add = await PerfilActividad.create({
                actividadeId: activity,
                areaId: perfil
            });
            
        }

        return res.status(200).json({ status: 'ok', message: 'Guardado correctamente' });

    } catch (error) {
        return res.status(400).json({status: 'error', message: error.message});
    }
}

export const deletePerfilActivityAll = async (req, res) => {
    try {
        const perfil = req.params.id;

        const items = await PerfilActividad.findAll({
            where: {
              areaId: perfil
            }
        });

        if(items.length > 0) {
            await Promise.all(items.map(item => item.destroy()));
        }

        return res.status(200).json({ status: 'ok', message: 'eliminado correctamente' });

    } catch (error) {
        return res.status(400).json({status: 'error', message: error.message});
    }
}