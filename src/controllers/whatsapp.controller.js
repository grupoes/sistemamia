import { NumeroWhatsapp } from "../models/numerosWhatsapp.js";
import { PotencialCliente } from "../models/potencialCliente.js";
import { EtiquetaCliente } from "../models/etiquetaCliente.js";
import { Etiqueta } from "../models/etiquetas.js";

import { Op } from 'sequelize';

export const addWhatsapp = async(req, res) => {
    const { from, nameContact } = req.body;
    try {

        const whatsapp = await NumeroWhatsapp.findOne({
            where: {
                from: from
            }
        });

        if(whatsapp) {
            return res.json({message: "from ya existe"});
        }

        const newWhatsapp = await NumeroWhatsapp.create({
            from,
            nameContact
        });

        return res.json(newWhatsapp);

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const addContact = async (req, res) => {
    const { numero, name } = req.body;
    try {
        const id = req.usuarioToken._id;

        const whatsapp = await NumeroWhatsapp.findOne({
            where: {
                from: numero
            }
        });

        if(whatsapp) {
            return res.json({message: "existe", data: 'El número de whatsapp ya existe'});
        }

        let nameW = "";

        if(name === '') {
            nameW = numero
        } else {
            nameW = name;
        }

        const newWhatsapp = await NumeroWhatsapp.create({
            from: numero,
            nameContact: nameW,
            asistente: id
        });

        const newPotencial = await PotencialCliente.create({
            nombres: name,
            apellidos: "",
            fecha_ingreso: new Date(),
            fecha_registro: new Date(),
            prefijo_celular: 51,
            numero_celular: 51,
            prefijo_whatsapp: 51,
            numero_whatsapp: numero
        });

        const potEtiqueta = await EtiquetaCliente.create({
            cliente_id: newPotencial.id,
            etiqueta_id: 1,
            estado: 1
        });

        return res.json({message: 'ok', data: newWhatsapp});

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const getContacts = async (req, res) => {
    const { buscar } = req.body;
    try {
        const rol = req.usuarioToken._role;
        const id = req.usuarioToken._id;

        let contactos = "";

        if(rol === 2 || rol === 6) {
            contactos = await NumeroWhatsapp.findAll({
                where: {
                    asistente: id,
                    [Op.or]: [
                        {
                          nameContact: {
                            [Op.iLike]: `%${buscar}%`
                          }
                        },
                        {
                          from: {
                            [Op.like]: `%${buscar}%`
                          }
                        }
                    ]
                }
            });
        } else {
            contactos = await NumeroWhatsapp.findAll({
                where: {
                    [Op.or]: [
                        {
                          nameContact: {
                            [Op.iLike]: `%${buscar}%`
                          }
                        },
                        {
                          from: {
                            [Op.like]: `%${buscar}%`
                          }
                        }
                    ]
                }
            });
        }

        let arrayContact = [];

        for (const contacto of contactos) {

            const potencial = await PotencialCliente.findOne({
                where: {
                    numero_whatsapp: contacto.from
                }
            });

            const idp = potencial.id;

            const etiqueta = await EtiquetaCliente.findOne({
                where: {
                    cliente_id: idp,
                    estado: 1
                }
            });

            const eti = await Etiqueta.findOne({
                where: {
                    id: etiqueta.etiqueta_id
                }
            });

            let array = {
                numero: contacto.from,
                name: contacto.nameContact,
                nameEtiqueta: eti.descripcion,
                potencial: idp,
                etiqueta_id: etiqueta.etiqueta_id,
                rol: rol,
                asistente: contacto.asistente

            };

            arrayContact.push(array);
        }

        return res.json({ message: 'ok', data:arrayContact });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

//chatDetail('${contact.numero}','${nameContact}', '${contact.etiqueta}', ${contact.potencial_id}, ${contact.etiqueta_id}, ${rol}, ${contact.idAsistente})

/*let array = {
    numero: from,
    contact: name.nameContact,
    mensaje: mensa.message,
    estado: mensa.estadoMessage,
    time: time,
    cantidad: chatCount,
    asistente: nameAsistente,
    idAsistente: idAsis,
    rol: rol,
    etiqueta: eti.descripcion,
    potencial_id: idpotencial,
    etiqueta_id: idetiqueta
}*/