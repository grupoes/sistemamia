import { WahtasappVentas } from "../models/whatsappVentas.js";

export const viewPrincipal = (req, res) => {
    const timestamp = Date.now();

    const css = [
        'assets/libs/datatables.net-bs4/css/dataTables.bootstrap4.min.css',
        'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.min.css'
    ];

    const js = [
        'assets/libs/datatables.net/js/jquery.dataTables.min.js',
        'assets/libs/datatables.net-bs4/js/dataTables.bootstrap4.min.js',
        'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.all.min.js',
        '/js/whatsappVentas.js'+ '?t=' + timestamp
    ];

    res.render('whatsappVentas/index', { layout: 'partials/main', css, js });
}

export const allWhatsapp = async(req, res) => {
    try {
        const all = await WahtasappVentas.findAll({
            order: [
                ['id', 'desc']
            ]
        });

        return res.json({ message: 'ok', data: all });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const saveNumeroWhatsappVentas = async(req, res) => {
    const { idnumber, numero_whatsapp, nombre_whatsapp, descripcion_whatsapp } = req.body;
    try { 

        if(numero_whatsapp.length != 9) {
            return res.json({ message: 'error', response: 'El numero debe contener 9 digitos' });
        }

        if(idnumber == 0) {
            const saveWhatsapp = await WahtasappVentas.create({
                numero: numero_whatsapp,
                nombre: nombre_whatsapp,
                description: descripcion_whatsapp,
                status: 1
            });
    
            return res.json({ message: 'ok', response: saveWhatsapp, dialog: 'Se agrego correctamente el número' });
        } else {
            const update = await WahtasappVentas.update(
                { 
                    numero: numero_whatsapp,
                    nombre: nombre_whatsapp,
                    description: descripcion_whatsapp
                }, 
                {
                    where: { id: idnumber }
                }
            );
    
            return res.json({ message: 'ok', response: update, dialog: 'Se edito correctamente el número' });
        }

        
    } catch (error) {
        return res.status(400).json({ message: 'error', response: error.message });
    }
}

export const updateStatusWhatsapp = async(req, res) => {
    const { id, checked } = req.body;
    try {
        
        const update = await WahtasappVentas.update({ status: checked }, {
            where: { id: id }
        });

        return res.json({ message: 'ok', response: update });

    } catch (error) {
        return res.status(400).json({ message: 'error', response: error.message });
    }
}

export const getWhatsappVenta = async(req, res) => {
    try {
        const id = req.params.id;
        const getWhatsapp = await WahtasappVentas.findOne({
            where: {
                id: id
            }
        });

        return res.json({ message: 'ok', response: getWhatsapp });
    } catch (error) {
        return res.status(400).json({ message: 'error', response: error.message });
    }
}