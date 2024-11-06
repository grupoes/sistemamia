import { sequelize } from "../database/database.js";
import { Usuario } from "../models/usuario.js";
import { Trabajadores } from "../models/trabajadores.js";
import { Area } from "../models/area.js";
import { TipoTrabajo } from "../models/tipoTrabajo.js";
import { Carrera } from "../models/carrera.js";
import { Especialidad } from "../models/especialidad.js";
import { TipoDocumento } from "../models/tipoDocumento.js";
import { Perfil } from "../models/perfil.js";
import { UsuarioPerfil } from "../models/usuario_perfil.js";

export const index = async (req, res) => {
    const timestamp = Date.now();
    const css = [
        "assets/libs/datatables.net-bs4/css/dataTables.bootstrap4.min.css",
        "https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.min.css",
        "assets/css/chosen.min.css",
    ];
    const js = [
        "assets/libs/datatables.net/js/jquery.dataTables.min.js",
        "assets/libs/datatables.net-bs4/js/dataTables.bootstrap4.min.js",
        "https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.all.min.js",
        "assets/js/chosen.jquery.min.js",
        "/js/usuario.js" + "?t=" + timestamp,
    ];
    const [
        listAreas,
        listCareer,
        listSpecialties,
        tipoTrabajo,
        tiposDocumento,
        perfil,
    ] = await Promise.all([
        Area.findAll({ where: { estado: 1 }, order: [["id", "asc"]] }),
        Carrera.findAll({ where: { estado: 1 }, order: [["id", "asc"]] }),
        Especialidad.findAll({ where: { estado: 1 }, order: [["id", "asc"]] }),
        TipoTrabajo.findAll({ where: { estado: 1 }, order: [["id", "asc"]] }),
        TipoDocumento.findAll({ where: { estado: true }, order: [["id", "asc"]] }),
        Perfil.findAll({ where: { estado: 1 }, order: [["id", "asc"]] }),
    ]);
    res.render("usuario/index", {
        layout: "partials/main",
        css,
        js,
        areas: listAreas,
        career: listCareer,
        specialties: listSpecialties,
        tipoTrabajo: tipoTrabajo,
        tiposDocumento: tiposDocumento,
        perfiles: perfil,
    });
};

export const allUsers = async (req, res) => {
    try {
        const users = await Usuario.findAll({
            include: [
                {
                    model: Trabajadores,
                    include: [
                        {
                            model: Area,
                        },
                        {
                            model: TipoTrabajo,
                        },
                        {
                            model: Carrera
                        }
                    ],
                },
                {
                    model: Perfil,
                    through: { attributes: [] }
                }
            ],
        });

        res.status(200).json({ status: "ok", data: users });
    } catch (error) {
        return res.status(400).json({ status: "error", message: error.message });
    }
};

export const guardarUsuario = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const {
            id,
            tipoDocumento,
            numeroDocumento,
            nameUsuario,
            lastName,
            fechaNacimiento,
            id_tipoTrabajo,
            id_career,
            fechaContrato,
            numberWhatsapp,
            id_area,
            ubigeo_user,
            address,
            urbanizacion,
            telefono,
            password,
            email, 
            ids_perfiles,
            id_specialties
        } = req.body;
        if (id === 0) {
            const trabajador = await Trabajadores.create({
                tipo_documento_id: tipoDocumento,
                numero_documento: numeroDocumento,
                nombres: nameUsuario,
                apellidos: lastName,
                fecha_nacimiento: fechaNacimiento,
                tipoTrabajoId: id_tipoTrabajo,
                area_id: id_area,
                ubigeoId: ubigeo_user,
                direccion: address,
                urbanizacion: urbanizacion,
                telefono: telefono,
                carreraId: id_career,
                fecha_contrato : fechaContrato,
                whatsapp: numberWhatsapp, 
                especialidadId: id_specialties
            }, { transaction });
    
            const user = await Usuario.create({
                correo: email,
                password: password,
                trabajador_id: trabajador.id,
                estado : 1
            }, { transaction });
    
            for (let perfilId of ids_perfiles) {
                await UsuarioPerfil.create({
                    usuario_id: user.id,
                    perfil_id: parseInt(perfilId, 10)
                }, { transaction });
            }
            await transaction.commit();
    
            return res.status(201).json({
                success: true,
                message: "Trabajador creado con éxito",
                trabajador: trabajador,
            });
        }else {
            const user = await Usuario.findOne({
                where: { id },
                attributes: ['trabajador_id']
            });
            if (!user) {
                throw new Error("Usuario no encontrado");
            }
            const trabajadorId = user.trabajador_id;
            await Trabajadores.update({
                tipo_documento_id: tipoDocumento,
                numero_documento: numeroDocumento,
                nombres: nameUsuario,
                apellidos: lastName,
                fecha_nacimiento: fechaNacimiento,
                tipoTrabajoId: id_tipoTrabajo,
                area_id: id_area,
                ubigeoId: ubigeo_user,
                direccion: address,
                urbanizacion: urbanizacion,
                telefono: telefono,
                carreraId: id_career,
                fecha_contrato: fechaContrato,
                whatsapp: numberWhatsapp,
                especialidadId: id_specialties
            }, {
                where: { id: trabajadorId },
                transaction
            });
            await Usuario.update({
                correo: email,
                password: password,
                estado: 1
            }, {
                where: { id },
                transaction
            });
            await UsuarioPerfil.destroy({
                where: { usuario_id: id },
                transaction
            });
            for (let perfilId of ids_perfiles) {
                await UsuarioPerfil.create({
                    usuario_id: id,
                    perfil_id: parseInt(perfilId, 10)
                }, { transaction });
            }
            await transaction.commit();

            return res.status(200).json({
                success: true,
                message: "Trabajador actualizado con éxito",
            });
        }
    } catch (error) {
        await transaction.rollback();
        return next(error); 
    }
};

export const deleteOrRestore = async(req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { id, estado } = req.query;
        const newState = estado == 0 ? 1 : 0;
        await Usuario.update(
            { estado: newState },
            { where: { id }, transaction }
        );
        const user = await Usuario.findOne({
            where: { id },
            attributes: ['trabajador_id'],
            transaction
        });
        if (user && user.trabajador_id) {
            await Trabajadores.update(
                { estado: newState },
                { where: { id: user.trabajador_id }, transaction }
            );
        }
        await UsuarioPerfil.update(
            { estado: newState },
            { where: { usuario_id: id }, transaction }
        );
        await transaction.commit();
        return res.status(200).json({
            success: true,
            message: `Usuario ${newState === 1 ? 'restaurado' : 'eliminado'} con éxito.`
        });

    } catch (error) {
        await transaction.rollback();
        return next(error);
    }
}

export const listarEspecialidadesPorIdCarrera = async(req, res) => {
    const { idCarrera } = req.params;
    try {
        const especialidades = await Especialidad.findAll({
            where: {
                carreraid: idCarrera,
                estado: 1 
            },
            attributes: ['id', 'nombre'] 
        });
        return res.status(200).json({
            success: true,
            data: especialidades,
            message: "Especiales obtenidas con exito.",
        });
    } catch (error) {
        return next(error); 
    }
}