import { PotencialCliente } from "../models/potencialCliente.js";

export const getPotencialClientes = async(req, res) => {
    try {
        const all = await PotencialCliente.findAll();

        res.status(200).json({status: "ok", data: all});

    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}