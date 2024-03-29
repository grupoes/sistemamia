import { Area } from "../models/area.js";

export const allAreas = async (req, res) => {
    try {
        const areas = await Area.findAll({
            where: {
                estado: 1
            },
            order: [
                ['id', 'asc']
            ]
        });

        res.status(200).json({status: "ok", data: areas});

    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

export const getArea = async (req, res) => {
    const id = req.params.id;

    try {
        const area = await Area.findByPk(id);

        if (area) {
            res.status(200).json({status: "ok", data: area});
        } else {
            res.status(400).json({message: "Area no existe"});
        }

    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

export const createArea = async (req, res) => {
    const { nombre, descripcion } = req.body;

    try {
        const newArea = await Area.create({
            nombre,
            descripcion
        });

        res.status(201).json({status: "ok", data: newArea});

    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

export const updateArea = async (req, res) => {
    const { nombre, descripcion } = req.body;
    const id = req.params.id;
    try {
        const areaAct = await Area.findByPk(id);
        areaAct.nombre = nombre;
        areaAct.descripcion = descripcion;

        await areaAct.save();

        res.status(201).json({status: "ok", data: areaAct});

    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}