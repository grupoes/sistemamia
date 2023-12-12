import { Trabajadores } from "../models/trabajadores.js";
import { Asignacion } from "../models/asignacion.js";
import { Usuario } from "../models/usuario.js";
import { Registros } from "../models/registros.js";

import { Op } from 'sequelize';

export const getDataToken = (req, res) => {
    try {
        const rol = req.usuarioToken._role;
        const id = req.usuarioToken._id;
        const name = req.usuarioToken._name;

        return res.json({ message: 'ok', rol: rol, id: id, name: name });
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

export const asignarAsistenteData = async () => {
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

export const asignarAsistenteDataJson = async (req, res) => {
    try {
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
    
        return res.json(trabajador);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
    
}

export const registroActividad = async (id_usuario, tipo_actividad, descripcion_detallada, fecha_hora, direccion_ip, dispositivo, resultado_actividad) => {
    try {
        const registro = await Registros.create({
            id_usuario,
            tipo_actividad,
            descripcion_detallada,
            fecha_hora,
            direccion_ip,
            dispositivo,
            resultado_actividad
        });

        return registro;
    } catch (error) {
        return error.message;
    }
}