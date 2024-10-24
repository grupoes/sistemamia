import {Perfil} from '../models/perfil.js';

export const viewProfiles = (req, res) => {
    const timestamp = Date.now();

    const css = [
        'assets/libs/datatables.net-bs4/css/dataTables.bootstrap4.min.css',
        'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.min.css',
        'assets/libs/select2/css/select2.min.css'
    ];

    const js = [
        'assets/libs/datatables.net/js/jquery.dataTables.min.js',
        'assets/libs/datatables.net-bs4/js/dataTables.bootstrap4.min.js',
        'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.all.min.js',
        'assets/libs/select2/js/select2.min.js',
        '/js/perfil.js'+ '?t=' + timestamp
    ];

    res.render('perfiles/index', { layout: 'partials/main', css, js });
}

export const getListProfiles = async (req , res) => {
    try {
        const profiles = await Perfil.findAll();
        res.status(200).json({ status: 'ok', data: profiles });
    } catch (error) {
        return res.status(400).json({status: 'error', message: error.message});
    }
}

export const saveProfile = async (req, res) => {
    const { idProfile, nameProfile, description, estado } = req.body;
    try {
        if (idProfile === "0") {
            const save = await Perfil.create({
                nombre: nameProfile,
                descripcion: description,
            });
            return res.json({ message: 'ok',  response: save, dialog: "Perfil creado exitosamente." });
        }else {
            const edit = await Perfil.update({ 
                nombre: nameProfile,
                descripcion: description,
            }, {
                where: { 
                    id: idProfile
                }
            });
            return res.json({ message: 'ok',  response: edit, dialog: `Perfil editado exitosamente.` });
        }
    } catch (error) {
        return res.status(400).json({ message: 'error', response: error.message });
    }
}

export const deleteProfile = async(req, res) => {
    try {
        const { id, estado } = req.query;
        const deleteOrRestore = await Perfil.update(
            {
                estado: estado == 0? 1 : 0
            },
            {
                where: {
                    id: id
                }
            }
        );
        return res.json({ message: 'ok', response: deleteOrRestore, dialog: `Perfil ${estado == 0 ? 'activado' : 'eliminado'} exitosamente.`});

    } catch (error) {
        return res.status(400).json({ message: 'error', response: error.message });
    }
}
