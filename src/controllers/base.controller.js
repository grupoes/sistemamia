import { Trabajadores } from "../models/trabajadores.js";
import { Asignacion } from "../models/asignacion.js";
import { Usuario } from "../models/usuario.js";

import { Op } from 'sequelize';

export const getDataToken = (req, res) => {
    try {
        const rol = req.usuarioToken._role;
        const id = req.usuarioToken._id;

        return res.json({ message: 'ok', rol: rol, id: id });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const getAgenteId = async (req, res) => {
    try {
        const rol = req.usuarioToken._role;
        const id = req.usuarioToken._id;

        const agentes = await Trabajadores.findAll();

        return res.json({ message: 'ok', data: agentes, id: id });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const asignarAsistente = async () => {
    const totalTrabajadores = await Trabajadores.count({
        where: {
            area_id: 2
        }
    });

    // 2. Obtiene cuántas asignaciones ya existen
    const totalAsignaciones = await Asignacion.count();

    // 3. Usa el operador módulo para determinar el siguiente trabajador
    const trabajadorAsignado = totalAsignaciones % totalTrabajadores;

    // 4. Obtiene el ID del trabajador al que se asignará el cliente
    const trabajador = await Trabajadores.findOne({
        where: {
            area_id: 2
        },
        offset: trabajadorAsignado
    });

    return trabajador;
}