import { TipoTrabajo } from "../models/tipoTrabajo.js";

export const allTipoTrabajo = async(req, res) => {
    try {
        const all = await TipoTrabajo.findAll({
            where: {
                estado: 1
            }
        });

        res.status(200).json({status: "ok", data: all});

    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

export const createTypeJob = async (req, res) => {
    const { nombre, descripcion } = req.body;
    try {
        const newTypeJob = await TipoTrabajo.create({
            nombre,
            descripcion
        });

        res.status(201).json({estatus: "ok", data: newTypeJob});
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}