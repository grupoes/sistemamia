import { sequelize } from "../database/database.js";
import { Sequelize } from 'sequelize';
import { Modulos } from "../models/modules.js";
import { Actions } from "../models/actions.js";
import { Modulo } from "../models/modulo.js";
import { ModuleActions } from "../models/ModuleActions.js";
import { Modulo_padre } from "../models/module_padre.js";
import { Funcion } from "../models/funcion.js";
import { Funcion_modulo } from "../models/funcion_modulo.js";
import {Permisos} from "../models/permisos.js";
import { CustomError } from "../helpers/utils/CustomError.js";

export const index = async (req, res) => {
    const timestamp = Date.now();
    const css = [
        'assets/libs/datatables.net-bs4/css/dataTables.bootstrap4.min.css',
        'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.min.css',
        "assets/css/chosen.min.css",
    ];
    const js = [
        'assets/libs/datatables.net/js/jquery.dataTables.min.js',
        'assets/libs/datatables.net-bs4/js/dataTables.bootstrap4.min.js',
        'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.all.min.js',
        "assets/js/chosen.jquery.min.js",
        '/js/modulos.js'+ '?t=' + timestamp
    ];
    const data = await Modulo_padre.findAll({ where: { estado: 1 } });
    const permisos = await Funcion.findAll({ where :{estado : 1}, attributes: ['id', 'nombre']});
    res.render('modulo/index', { layout: 'partials/main', css, js, modulo_padre: data, permisos: permisos });
}

export const getAllModulos = async (req, res) => {
    try {
        const modulos = await Modulo.findAll({
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            include: [
                {
                    model: Modulo_padre,
                    attributes: ['id', 'nombre']
                },
                {
                    model: Funcion_modulo,
                    attributes: ['idfuncion'],
                    include: {
                        model: Funcion,
                        attributes: ['id', 'nombre'],
                    },
                    where: {
                        estado: 1
                    },
                    required: false
                }
            ],
            order: [
                ['id', 'asc']
            ]
        });
        const result = modulos.reduce((acc, modulo) => {
            let existingModulo = acc.find(m => m.id === modulo.id);
            if (modulo.funcion_modulo) {
                const funcion = {
                    id: modulo.funcion_modulo.funcion.id,
                    nombre: modulo.funcion_modulo.funcion.nombre
                };
                if (existingModulo) {
                    existingModulo.funciones.push(funcion);
                } else {
                    acc.push({
                        id: modulo.id,
                        nombre: modulo.nombre,
                        url: modulo.url,
                        orden: modulo.orden,
                        estado: modulo.estado,
                        modulopadre_id: modulo.modulopadre_id,
                        modulo_padre: modulo.modulo_padre, 
                        funciones: [funcion]
                    });
                }
            } else {
                if (!existingModulo) {
                    acc.push({
                        id: modulo.id,
                        nombre: modulo.nombre,
                        url: modulo.url,
                        orden: modulo.orden,
                        estado: modulo.estado,
                        modulopadre_id: modulo.modulopadre_id,
                        modulo_padre: modulo.modulo_padre,
                        funciones: []
                    });
                }
            }
            return acc;
        }, []);
        return res.status(200).json({status: "ok", data: result});

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

export const crearOEditar = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const { id, nombre, modulo_padre, url, orden, acciones } = req.body;
        if (id === null) {
            const existeModulo = await Modulo.findOne({
                where: {
                    modulopadre_id: modulo_padre,
                    orden: orden
                },
                transaction
            });
            if (existeModulo) throw new CustomError("Ya existe un módulo con el mismo orden para el mismo módulo padre.", 400);
            const modulo = await Modulo.create({
                nombre: nombre,
                url: url,
                orden: orden,
                modulopadre_id: modulo_padre,
            }, { transaction });
            for (let accion of acciones) {
                await Funcion_modulo.create({
                    idmodulo: modulo.id,
                    idfuncion: accion
                }, { transaction });
                const accionData = await Funcion.findByPk(accion);
                const nombrePermiso = `${url}:${accionData.funcion}`;
                await Permisos.create({
                    nombre: nombrePermiso,
                }, { transaction });
            }
            await transaction.commit();
            return res.status(201).json({
                success: true,
                message: "Módulo creado.",
            });
        } else {
            const existeModulo = await Modulo.findOne({
                where: {
                    modulopadre_id: modulo_padre,
                    orden: orden,
                    id: { [Sequelize.Op.ne]: id } 
                },
                transaction 
            });
            if (existeModulo) throw new CustomError("Ya existe un módulo con el mismo orden para el mismo módulo padre.", 400);
            await Modulo.update({
                nombre: nombre,
                url: url,
                orden: orden,
                modulopadre_id: modulo_padre,
            }, {
                where: { id: id },
                transaction
            });
            await Funcion_modulo.update({ estado: 0 }, {
                where: { idmodulo: id },
                transaction
            });
            await Permisos.update(
                { estado: 0 },
                {
                    where: {
                        nombre: { [Sequelize.Op.like]: `${url}:%` }
                    },
                    transaction
                }
            );
            for (let accion of acciones) {
                const [funcionModulo, created] = await Funcion_modulo.findOrCreate({
                    where: {
                        idmodulo: id,
                        idfuncion: accion
                    },
                    defaults: {
                        estado: 1
                    },
                    transaction
                });
                if (!created) {
                    await funcionModulo.update({ estado: 1 }, { transaction });
                }
                const accionData = await Funcion.findByPk(accion);
                const nombrePermiso = `${url}:${accionData.funcion}`;
                const [permiso, permisoCreated] = await Permisos.findOrCreate({
                    where: { nombre: nombrePermiso },
                    defaults: { estado: 1 },
                    transaction
                });
                if (!permisoCreated) {
                    await permiso.update({ estado: 1 }, { transaction });
                }
            }
            await transaction.commit();
            return res.status(200).json({
                success: true,
                message: "Módulo actualizado.",
            });
        }
    } catch (error) {
        await transaction.rollback();
        return next(error);
    }
}

export const getModule = async (req, res) => {
    const id = req.params.id;

    try {
        const modulo = await Modulos.findOne({
            where: {
                id: id
            }
        });

        let plainObject = modulo.get({ plain: true });

        if(modulo.fatherId != 0) {
            const acciones = await ModuleActions.findAll({
                where: {
                    moduleId: id
                }
            });

            plainObject.acciones = acciones.map(accion => accion.get({ plain: true }));
        }

        return res.json({ status: 'ok', data: plainObject });

    } catch (error) {
        return res.status(400).json({status: 'error', message: error.message});
    }
}

export const eliminarORestaurar = async (req, res, next) => {
    try {
        const { id, estado } = req.query;
        const nuevoEstado = estado == 0 ? 1 : 0;
        await Modulo.update(
            {
                estado: nuevoEstado
            },
            {
                where: {
                    id: id
                }
            }
        );
        await Funcion_modulo.update(
            {
                estado: nuevoEstado
            },
            {
                where: {
                    idmodulo: id
                }
            }
        );
        return res.status(200).json({
            success: true,
            message: `Modulo ${nuevoEstado === 1 ? 'restaurado' : 'eliminado'}.`
        });
    } catch (error) {
        return next(error);
    }
}