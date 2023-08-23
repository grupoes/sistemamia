import { Cargo } from "../models/cargos.js";
import { Area } from "../models/area.js";

export const allCargos = async (req, res) => {
    try {
        const cargos = await Cargo.findAll(
            {
                where: {
                    estado: 1
                },
                include: Area
            }
        );

        res.status(200).json({status: "ok", data: cargos});
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

export const getCargo = async(req, res) => {
    const id = req.params.id;
    try {
        const cargo = await Cargo.findByPk(id);

        if (cargo) {
            res.status(200).json({status: "ok", data: getCargo});
        } else {
            res.status(400).json({message: "Cargo no existe"});
        }

    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

export const createCargo = async(req, res) => {
    const {nombre, descripcion, area_id} = req.body;
    try {
        const createCargo = await Cargo.create({
            nombre,
            descripcion,
            area_id
        });

        res.status(201).json({status: "ok", data: createCargo});
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}