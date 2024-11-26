import { Trabajos } from "../models/TrabajosEjemplos.js";

import { DateTime } from 'luxon';

async function agregarTrabajoHoras(fechaInicio, horaInicio, horasTotales) {
    let minutosRestantes = horasTotales * 60; // Convertimos a minutos

    // Convertimos la fecha de inicio a un objeto Date en UTC
    const [year, month, day] = fechaInicio.split('-');
    const fechaInicioOriginal = new Date(Date.UTC(year, month - 1, day));

    const [horaInicial, minutoInicial] = horaInicio.split(':').map(Number);
    fechaInicioOriginal.setUTCHours(horaInicial, minutoInicial);

    let fechaActual = new Date(fechaInicioOriginal); // Aseguramos que la fecha es en UTC

    const horariosPermitidos = {
        lunesAViernes: [
            { inicio: 8 * 60, fin: 13 * 60 },    // De 8:00 a 13:00 en minutos
            { inicio: 15 * 60, fin: 19 * 60 }    // De 15:00 a 19:00 en minutos
        ],
        sabado: [
            { inicio: 8 * 60, fin: 13 * 60 }     // De 8:00 a 13:00 en minutos
        ]
    };

    const datos = [];

    while (minutosRestantes > 0) {
        const diaSemana = fechaActual.getUTCDay();

        const bloquesDia = (diaSemana >= 1 && diaSemana <= 5)
            ? horariosPermitidos.lunesAViernes
            : (diaSemana === 6)
                ? horariosPermitidos.sabado
                : [];

        for (let bloque of bloquesDia) {
            if (minutosRestantes <= 0) break;

            const horaActualMinutos = fechaActual.getUTCHours() * 60 + fechaActual.getUTCMinutes();
            const horaInicioBloque = Math.max(horaActualMinutos, bloque.inicio);

            if (horaInicioBloque >= bloque.fin) continue; // Si ya pasó el bloque, salta al siguiente

            const minutosDisponiblesEnBloque = bloque.fin - horaInicioBloque;
            const minutosAsignados = Math.min(minutosDisponiblesEnBloque, minutosRestantes);

            const horaInicioFormato = `${String(Math.floor(horaInicioBloque / 60)).padStart(2, '0')}:${String(horaInicioBloque % 60).padStart(2, '0')}:00`;
            const horaFinBloque = horaInicioBloque + minutosAsignados;
            const horaFinFormato = `${String(Math.floor(horaFinBloque / 60)).padStart(2, '0')}:${String(horaFinBloque % 60).padStart(2, '0')}:00`;

            // Almacenamos los datos de la tarea
            datos.push({
                fecha: fechaActual.toISOString().split('T')[0],
                horainicio: horaInicioFormato,
                horafin: horaFinFormato,
                estado: 'Pendiente'
            });

            minutosRestantes -= minutosAsignados;

            // Si ya asignamos todo el tiempo, salimos del bucle
            if (minutosRestantes <= 0) break;
        }

        // Avanzamos al siguiente día
        fechaActual.setUTCDate(fechaActual.getUTCDate() + 1);

        // Si es domingo, avanzamos al lunes
        if (fechaActual.getUTCDay() === 0) {
            fechaActual.setUTCDate(fechaActual.getUTCDate() + 1);
        }

        // Reiniciamos la hora al inicio del siguiente día laboral (8:00 AM)
        fechaActual.setUTCHours(8, 0, 0);
    }

    console.log(datos);

    // Guardamos los datos en la base de datos
    for (let trabajo of datos) {
        await Trabajos.create({
            fecha: trabajo.fecha,
            horainicio: trabajo.horainicio,
            horafin: trabajo.horafin,
            estado: trabajo.estado
        });
    }

    return datos;
}


export const viewHorarioGeneral = async (req, res) => {
    const { fechaInicio, horaInicio, horasTotales } = req.body;

    if (!fechaInicio || !horaInicio || !horasTotales) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    try {
        const datos = await agregarTrabajoHoras(fechaInicio, horaInicio, horasTotales);
        res.status(200).json({ message: 'Trabajo agregado exitosamente', data: datos });
    } catch (error) {
        console.error('Error al agregar el trabajo:', error);
        res.status(500).json({ error: 'Error al agregar el trabajo' });
    }
}

