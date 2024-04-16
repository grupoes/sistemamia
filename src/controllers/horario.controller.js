import { Horario } from "../models/horario.js";
import { Proyecto } from "../models/proyecto.js";


export const viewHorarioGeneral = (req, res) => {
    const timestamp = Date.now();

    const css = [
        'assets/libs/datatables.net-bs4/css/dataTables.bootstrap4.min.css',
        'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.min.css'
    ];

    const js = [
        'assets/libs/datatables.net/js/jquery.dataTables.min.js',
        'assets/libs/datatables.net-bs4/js/dataTables.bootstrap4.min.js',
        'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.all.min.js',
        '/js/horarioGeneral.js'+ '?t=' + timestamp
    ];

    res.render('horarios/general', { layout: 'partials/main', css, js });
}

export const viewHorario = (req, res) => {
    const timestamp = Date.now();

    const css = [
        'assets/libs/datatables.net-bs4/css/dataTables.bootstrap4.min.css',
        'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.min.css',
        'assets/libs/%40fullcalendar/core/main.min.css',
        'assets/libs/%40fullcalendar/daygrid/main.min.css',
        'assets/libs/%40fullcalendar/bootstrap/main.min.css',
        'assets/libs/%40fullcalendar/timegrid/main.min.css',
        'assets/libs/%40fullcalendar/list/main.min.css'
    ];

    const js = [
        'assets/libs/datatables.net/js/jquery.dataTables.min.js',
        'assets/libs/datatables.net-bs4/js/dataTables.bootstrap4.min.js',
        'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.all.min.js',
        'assets/libs/moment/min/moment.min.js',
        'assets/libs/%40fullcalendar/core/main.min.js',
        'assets/libs/%40fullcalendar/bootstrap/main.min.js',
        'assets/libs/%40fullcalendar/daygrid/main.min.js',
        'assets/libs/%40fullcalendar/timegrid/main.min.js',
        'assets/libs/%40fullcalendar/list/main.min.js',
        'assets/libs/%40fullcalendar/interaction/main.min.js',
        '/js/horario.js'+ '?t=' + timestamp
    ];

    res.render('horarios/index', { layout: 'partials/main', css, js });
}

export const horarioAuxiliar = async (req, res) => {
    try {
        const id = req.params.id;

        const horario = await Horario.findAll({
            attributes: ['id', 'fecha_inicio', 'fecha_fin', 'estado'],
            where: {
                usuarioId: id
            },
            include: {
                model: Proyecto,
                attributes: ['titulo', 'color']
            }
        });

        const defaultEvents = horario.map(item => {
            const { id, fecha_inicio, fecha_fin, proyecto } = item;
            const { titulo, color } = proyecto;
          
            return {
              id,
              title: titulo,
              start: fecha_inicio,
              end: fecha_fin,
              className: color
            };
        });

        return res.status(200).json({ message: 'ok', data: defaultEvents });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}
