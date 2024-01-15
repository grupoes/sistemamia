document.addEventListener('DOMContentLoaded', (event) => {
    const ahora = new Date();
    const primerDiaDeLaSemana = new Date(ahora.setDate(ahora.getDate() - ahora.getDay() + 1));
    const año = primerDiaDeLaSemana.getFullYear();
    const semana = ('0' + primerDiaDeLaSemana.getWeek()).slice(-2);

    document.getElementById('semanaActual').value = `${año}-W${semana}`;

    diasSemana();
});

// Función para obtener el número de semana del año
Date.prototype.getWeek = function () {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    var week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

const semana = document.getElementById('semanaActual');

semana.addEventListener('change', (e) => {
    diasSemana();
})

function diasSemana() {
    const valorSemana = document.getElementById('semanaActual').value;

    // Obtener el lunes de la semana seleccionada
    const año = parseInt(valorSemana.substring(0, 4), 10);
    const semana = parseInt(valorSemana.substring(6), 10);
    
    const primerDia = new Date(año, 0, 1 + (semana - 1) * 7);
    while (primerDia.getDay() !== 1) {
        primerDia.setDate(primerDia.getDate() - 1);
    }
    
    const ultimaFecha = new Date(primerDia);
    ultimaFecha.setDate(ultimaFecha.getDate() + 5);

    // Función para obtener el nombre del mes en español
    const obtenerNombreMes = fecha => {
        const meses = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        return meses[fecha.getMonth()];
    };

    let dia_inicio = primerDia.getDate();
    let mes_inicio = primerDia.getMonth() + 1;
    let anio_inicio = primerDia.getFullYear();

    let dia_fin = ultimaFecha.getDate();
    let mes_fin = ultimaFecha.getMonth() + 1;
    let anio_fin = ultimaFecha.getFullYear();

    let semana_text = `${dia_inicio} ${obtenerNombreMes(primerDia)} ${anio_inicio} - ${dia_fin} ${obtenerNombreMes(ultimaFecha)} ${anio_fin}`;
    
    // Formatear las fechas como 'DD-MM-YYYY'
    const formatoFecha = fecha => {
        let dia = fecha.getDate().toString().padStart(2, '0');
        let mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Enero es 0
        let año = fecha.getFullYear();
        return `${dia}/${mes}/${año}`;
    };
    
    // Ejemplo de cómo capturar el rango de fechas en un arreglo
    let semanaFechas = [];
    for(let i = 0; i < 6; i++){
        let dia = new Date(primerDia);
        dia.setDate(dia.getDate() + i);
        semanaFechas.push(formatoFecha(dia));
    }

    viewHorario(semanaFechas, semana_text);
}

const tableHours = document.getElementById('tableHours');
const semanaText = document.getElementById('semanaText');

const dias_semana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

function viewHorario(semana, textSemana) {

    semanaText.innerText = textSemana;

    let dia_semana = "";

    for (let i = 0; i < semana.length; i++) {
        dia_semana += `<th scope="col">${dias_semana[i]}<br>${semana[i]}</th>`;
        
    }

    let html = `
    <thead>
        <tr class="table-primary">
            <th scope="col">Nombre</th>
            ${dia_semana}
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>GUILLIANA</td>
            <td><a href="#">9:00</a></td>
            <td><a href="#">2:30</a></td>
            <td><a href="#">9:00</a></td>
            <td><a href="#">7:00</a></td>
            <td><a href="#">9:00</a></td>
            <td class="table-danger">5:00</td> <!-- Rojo para resaltar el cambio de horario -->
        </tr>
        <tr>
            <td>KETTY</td>
            <td><a href="#">9:00</a></td>
            <td><a href="#">5:00</a></td>
            <td><a href="#">9:00</a></td>
            <td><a href="#">9:00</a></td>
            <td><a href="#">9:00</a></td>
            <td class="table-danger">5:00</td> <!-- Rojo para resaltar el cambio de horario -->
        </tr>

    </tbody>
    `;

    tableHours.innerHTML = html;
}