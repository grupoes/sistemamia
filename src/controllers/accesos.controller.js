import { Perfil } from "../models/perfil.js";
import { Modulo_padre } from "../models/module_padre.js";
import { Modulo } from "../models/modulo.js";
import { Accesos } from "../models/accesos.js";
import { Permisos } from "../models/permisos.js";
import { PerfilesPermisos } from "../models/perfiles_permisos.js";
import { Funcion_modulo } from "../models/funcion_modulo.js";
import { CustomError } from "../helpers/utils/CustomError.js";
import { Funcion } from "../models/funcion.js";
import { Usuario } from "../models/usuario.js";
import { UsuarioPerfil } from "../models/usuario_perfil.js";

export const index = async (req, res) => {
    const css = [
        'assets/libs/datatables.net-bs4/css/dataTables.bootstrap4.min.css',
        'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.min.css',
        "assets/css/chosen.min.css",
        "assets//libs/jstree/style.min.css"
    ];
    const js = [
        'assets/libs/datatables.net/js/jquery.dataTables.min.js',
        'assets/libs/datatables.net-bs4/js/dataTables.bootstrap4.min.js',
        'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.all.min.js',
        "assets/js/chosen.jquery.min.js",
        "assets/libs/jstree/jstree.min.js",
        '/js/accesos.js'
    ];
    const data = await Perfil.findAll({ where: { estado: 1 } });
    res.render('accesos/index', { layout: 'partials/main', css, js, perfiles: data });
}

export const listarModulosConPermisos = async (req, res, next) => {
    try {
        const { idperfil } = req.params;
        const data = await Modulo_padre.findAll({
            attributes: ['id', 'nombre'],
            include: [{
                model: Modulo,
                attributes: ['id', 'nombre', 'url'],
                order: [['orden', 'asc']],
                include: [{
                    model: Funcion_modulo,
                    where: { estado: 1 },
                    include: [{
                        model: Funcion,
                        attributes: ['id', 'nombre', 'funcion'],
                    }]
                }]
            }],
            order: [['orden', 'asc']]
        });
        const groupedData = [];
        for (let moduloPadre of data) {
            let existingModuloPadre = groupedData.find(item => item.id === moduloPadre.id);
            if (!existingModuloPadre) {
                existingModuloPadre = {
                    id: moduloPadre.id,
                    nombre: moduloPadre.nombre,
                    modulos: []
                };
                groupedData.push(existingModuloPadre);
            }
            if (moduloPadre.modulo) {
                let existingModulo = existingModuloPadre.modulos.find(mod => mod.id === moduloPadre.modulo.id);
                if (!existingModulo) {
                    existingModulo = {
                        id: moduloPadre.modulo.id,
                        nombre: moduloPadre.modulo.nombre,
                        url: moduloPadre.modulo.url,
                        funciones: []
                    };
                    existingModuloPadre.modulos.push(existingModulo);
                }
                const funcion = moduloPadre.modulo.funcion_modulo?.funcion;
                if (funcion && !existingModulo.funciones.some(f => f.id === funcion.id)) {
                    const flag_acceso = await validarAccesoPermiso(idperfil, moduloPadre.modulo);
                    existingModulo.funciones.push({
                        id: funcion.id,
                        nombre: funcion.nombre,
                        prefijo: `${moduloPadre.modulo.url}:${funcion.funcion}`,
                        flag_acceso: flag_acceso
                    });
                }
            }
        }
        return res.status(200).json({
            success: true,
            data: groupedData,
            message: "Lista de módulos obtenidos exitosamente.",
        });

    } catch (error) {
        next(error);
    }
}

async function validarAccesoPermiso(idperfil, modulo) {
    const acceso = await Accesos.findAll({
        where: {
            idmodulo: modulo.id,
            idperfil: idperfil
        }
    });
    if (!acceso || acceso.length === 0) return false;
    const permisoNombre = `${modulo.url}:${modulo.funcion_modulo.funcion.funcion}`;
    const permiso = await PerfilesPermisos.findOne({
        where: {
            idperfil: idperfil
        },
        include: [{
            model: Permisos,
            where: { nombre: permisoNombre },
        }]
    });
    return permiso !== null;
}

export const asignarPermisos = async (req, res, next) => {
    try {
        const { id_perfil, permisos } = req.body;
        const perfil = await Perfil.findByPk(id_perfil);
        if (!perfil) {
            throw new CustomError('Perfil no encontrado', 404);
        }
        let perfilesPermisosData = [];
        await PerfilesPermisos.destroy({
            where: {
                idperfil: id_perfil,
            }
        });
        for (const { idmodulo, acciones } of permisos) {
            const modulo = await Modulo.findByPk(idmodulo);
            if (!modulo) {
                throw new CustomError(`Módulo con id ${idmodulo} no encontrado`, 404);
            }
            const permisosEncontrados = await Permisos.findAll({
                where: {
                    nombre: acciones
                }
            });
            if (permisosEncontrados.length !== acciones.length) {
                throw new CustomError('Uno o más permisos no fueron encontrados', 404);
            }
            const permisosIds = permisosEncontrados.map(p => p.id);
            await Accesos.findOrCreate({
                where: {
                    idmodulo,
                    idperfil: id_perfil
                },
                defaults: {
                    idmodulo,
                    idperfil: id_perfil
                }
            });
            perfilesPermisosData.push(...permisosIds.map(idpermiso => ({
                idpermiso,
                idperfil: id_perfil
            })));
        }
        await PerfilesPermisos.bulkCreate(perfilesPermisosData);

        return res.status(200).json({
            success: true,
            message: 'Permisos asignados exitosamente al perfil.',
            data: null
        });

    } catch (error) {
        next(error)
    }
}

export const listarModulosPermisosPorPerfiles = async (req, res, next) => {
    try {
        const { idusuario } = req.params;
        const usuario = await Usuario.findByPk(idusuario, {
            include: {
                model: Perfil,
                attributes: ['id'],
            },
        });
        const perfilIds = usuario.perfiles.map(perfil => perfil.id);
        const permisos = await PerfilesPermisos.findAll({
            where: { idperfil: perfilIds },
            include: {
                model: Permisos,
                attributes: ['id', 'nombre'],
            },
        });
        const permisosPorPerfil = permisos.reduce((acc, permiso) => {
            const perfilId = permiso.idperfil;

            if (!acc[perfilId]) {
                acc[perfilId] = [];
            }
            acc[perfilId].push(permiso.permiso);
            return acc;
        }, {});
        const permisosUnicos = new Map();
        Object.values(permisosPorPerfil).forEach(permisos => {
            permisos.forEach(permiso => {
                if (!permisosUnicos.has(permiso.id)) {
                    permisosUnicos.set(permiso.id, permiso);
                }
            });
        });
        const permisosArray = Array.from(permisosUnicos.values());
        const data = await Modulo_padre.findAll({
            attributes: ['id', 'nombre', 'icono', 'enlace', 'orden'],
            include: [{
                model: Modulo,
                attributes: ['id', 'nombre', 'url', 'orden'],
                order: [['orden', 'asc']],
                include: [{
                    model: Funcion_modulo,
                    where: { estado: 1 },
                    include: [{
                        model: Funcion,
                        attributes: ['id', 'nombre', 'funcion', 'icono', 'clase', 'de_registro', 'orden'],
                    }]
                }]
            }],
            order: [['orden', 'asc']]
        });
        const menuAgrupado = agruparDataMenu(data);
        const menuFinal = construirMenu(menuAgrupado, permisosArray);
        //req.user.id;
        return res.status(200).json({
            success: true,
            data: menuFinal,
            message: "Lista de módulos obtenidos exitosamente.",
        });

    } catch (error) {
        next(error);
    }
}

function agruparDataMenu(data) {
    const dataAgrupada = [];
    for (let moduloPadre of data) {
        let existingModuloPadre = dataAgrupada.find(item => item.id === moduloPadre.id);
        if (!existingModuloPadre) {
            existingModuloPadre = {
                id: moduloPadre.id,
                nombre: moduloPadre.nombre,
                icono: moduloPadre.icono,
                enlace: moduloPadre.enlace,
                orden: moduloPadre.orden,
                modulos: []
            };
            dataAgrupada.push(existingModuloPadre);
        }
        if (moduloPadre.modulo) {
            let existingModulo = existingModuloPadre.modulos.find(mod => mod.id === moduloPadre.modulo.id);
            if (!existingModulo) {
                existingModulo = {
                    id: moduloPadre.modulo.id,
                    nombre: moduloPadre.modulo.nombre,
                    url: moduloPadre.modulo.url,
                    orden: moduloPadre.modulo.orden,
                    funciones: []
                };
                existingModuloPadre.modulos.push(existingModulo);
            }
            const funcion = moduloPadre.modulo.funcion_modulo?.funcion;
            if (funcion && !existingModulo.funciones.some(f => f.id === funcion.id)) {
                existingModulo.funciones.push({
                    id: funcion.id,
                    nombre: funcion.nombre,
                    funcion: funcion.funcion,
                    icono: funcion.icono,
                    clase: funcion.clase,
                    de_registro: funcion.de_registro,
                    orden: funcion.orden,
                    prefijo: `${moduloPadre.modulo.url}:${funcion.funcion}`,
                });
            }
        }
    }
    return dataAgrupada;
}

function construirMenu(data, permisosArray) {
    const permisosPrefijos = permisosArray.map(permiso => permiso.nombre);
    const menuFiltrado = data
        .map(moduloPadre => {
            const modulosFiltrados = moduloPadre.modulos
                .map(modulo => {
                    const funcionesFiltradas = modulo.funciones.filter(funcion =>
                        permisosPrefijos.includes(funcion.prefijo)
                    );
                    const tienePermisoListar = funcionesFiltradas.some(funcion =>
                        funcion.prefijo.includes('listar')
                    );
                    if (!tienePermisoListar) {
                        return null;
                    }
                    return {
                        ...modulo,
                        funciones: funcionesFiltradas,
                    };
                })
                .filter(modulo => modulo !== null);
            if (modulosFiltrados.length === 0) {
                return null;
            }
            return {
                ...moduloPadre,
                modulos: modulosFiltrados,
            };
        })
        .filter(moduloPadre => moduloPadre !== null);
    return menuFiltrado;
};

