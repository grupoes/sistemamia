import { Carrera } from "../models/carrera.js";

export const allCarreras = async (req, res) => {
    try {
        const carreras = await Carrera.findAll({
            where: {
                estado: 1
            }
        });

        res.status(200).json({status: "ok", data: carreras});
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

export const getCarrera = async (req, res) => {
    const id = req.params.id;
    try {
        const carrera = await Carrera.findByPk(id);

        if (carrera) {
            res.status(200).json({status: "ok", data: carrera});
        } else {
            res.status(400).json({message: "Carrera no existe"});
        }
        
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

export const createCarrera = async (req, res) => {
    const { nombre, descripcion } = req.body;
    try {

        const newCarrera = await Carrera.create({
            nombre,
            descripcion
        });

        res.status(201).json({status: "ok", data: newCarrera});
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

export const updateCarrera = async(req, res) => {
    const id = req.params.id;
    const { nombre, descripcion } = req.body;
    try {
        const update = await Carrera.findByPk(id);

        update.nombre = nombre;
        update.descripcion = descripcion;

        await update.save();

        res.status(201).json({status: "ok", data: update});

    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}