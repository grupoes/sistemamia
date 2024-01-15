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