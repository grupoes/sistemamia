import { Horario } from "../models/horario.js";
import { Trabajos } from "../models/trabajos.js";
import { Trabajadores } from "../models/trabajadores.js";
import { Usuario } from '../models/usuario.js';
import { Actividades } from '../models/actividades.js';

import moment from 'moment-timezone';
import axios from "axios";

import { Op } from "sequelize";

import { DateTime } from 'luxon';


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
            attributes: ['id', 'fecha_inicio', 'fecha_fin'],
            where: {
                usuario_id: id
            },
            include: {
                model: Trabajos,
                attributes: ['descripcion', 'color'],
                include: {
                    model: Actividades,
                    attributes: ['name']
                }
            }
        });
        
        const defaultEvents = horario.map(item => {
            const { id, fecha_inicio, fecha_fin, trabajo } = item;

            const { descripcion, color, actividade } = trabajo
          
            return {
              id,
              title: actividade.name + " - " + descripcion,
              start: fecha_inicio,
              end: fecha_fin,
              backgroundColor: color
            };
        });

        return res.status(200).json({ message: 'ok', data: defaultEvents });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}


//horario ejemplo
export const viewHorarioEjemplo = (req, res) => {
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
        '/js/horario_ejemplo.js'+ '?t=' + timestamp
    ];

    res.render('horarios/ejemplo', { layout: 'partials/main', css, js });
}

export const verificarDisponibilidad = async (req, res) => {
    const { horasNecesarias, fechaLimite } = req.body;

    // Convertir fecha límite a objeto Date
    const fechaLimiteDate = new Date(fechaLimite);

    const users = await Usuario.findAll({
      include: {
        model: Trabajadores
        
      }
    });

    let userDisponibles = [];

    for (const user of users) {
        
        // Obtener el último trabajo del usuario antes de la fecha límite
      const ultimoTrabajo = await Horario.findOne({
          where: {
            usuario_id: user.id,
            //fecha_fin: { [Op.lte]: fechaLimiteDate }
          },
          order: [['fecha_fin', 'DESC']]
      });

      if (ultimoTrabajo === null) {
        userDisponibles.push(user);
      } else {
        const fecha_fin = moment(ultimoTrabajo.fecha_fin).tz('America/Lima').format('YYYY-MM-DD HH:mm:ss');
    
        // Calcular disponibilidad
        const disponibilidad = calcularDisponibilidad(fecha_fin, fechaLimiteDate, horasNecesarias);
        
        if(disponibilidad == 'disponible') {
          userDisponibles.push(user);
        }
      }

    };

    return res.json(userDisponibles);
    
}

function convertirHorasAMinutos(horasFormato) {
  const [horas, minutos] = horasFormato.split(':').map(Number);
  return horas * 60 + (minutos || 0); // Convierte las horas y minutos a minutos totales
}

function calcularDisponibilidad(fechaInicio, fechaLimite, horasNecesariasFormato) {
  const horarios = { 
      lunesAViernes: [{ inicio: 8, fin: 13 }, { inicio: 15, fin: 19 }],
      sabado: [{ inicio: 8, fin: 13 }]
  };

  const minutosNecesarios = convertirHorasAMinutos(horasNecesariasFormato); // Convertimos a minutos
  let minutosAcumulados = 0;
  let fechaActual = new Date(fechaInicio); // Asegúrate de que es un objeto Date válido.

  while (fechaActual <= fechaLimite && minutosAcumulados < minutosNecesarios) {
      const diaSemana = fechaActual.getDay();

      // Define horarios de trabajo dependiendo del día de la semana
      let horariosTrabajo = [];
      if (diaSemana >= 1 && diaSemana <= 5) { // Lunes a Viernes
          horariosTrabajo = horarios.lunesAViernes;
      } else if (diaSemana === 6) { // Sábado
          horariosTrabajo = horarios.sabado;
      }

      for (const horario of horariosTrabajo) {
          const inicioBloque = new Date(fechaActual);
          inicioBloque.setHours(horario.inicio, 0, 0, 0);

          const finBloque = new Date(fechaActual);
          finBloque.setHours(horario.fin, 0, 0, 0);

          // Ajusta el inicio del bloque si `fechaInicio` está dentro del bloque
          const inicioTrabajo = fechaInicio > inicioBloque ? fechaInicio : inicioBloque;
          const finTrabajo = fechaLimite < finBloque ? fechaLimite : finBloque;

          if (inicioTrabajo < finTrabajo) {
              const minutosDisponibles = (finTrabajo - inicioTrabajo) / (1000 * 60); // Convertimos a minutos
              if (minutosAcumulados + minutosDisponibles >= minutosNecesarios) {
                  // Si este bloque satisface lo restante
                  return 'disponible';
              } else {
                  minutosAcumulados += minutosDisponibles;
              }
          }
      }

      // Avanza al siguiente día
      fechaActual.setDate(fechaActual.getDate() + 1);
      fechaActual.setHours(0, 0, 0, 0); // Reinicia la hora del día
  }

  return minutosAcumulados >= minutosNecesarios ? 'disponible' : 'No hay disponibilidad';
}


async function agregarTrabajoHoras(fechaInicio, horaInicio, horasTotales, trabajo_id, usuario_id) {
  let minutosRestantes = horasTotales; // Convertimos a minutos

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

  let datos = [];

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
  
  // Guardamos los datos en la base de datos
  for (let trabajo of datos) {
      await Horario.create({
        fecha_inicio: trabajo.fecha + " " + trabajo.horainicio,
        fecha_fin: trabajo.fecha + " " + trabajo.horafin,
        trabajo_id: trabajo_id,
        usuario_id: usuario_id
      });
  }

  return datos;
}


export const addTrabajoHorario = async (req, res) => {
    const { fechaInicio, horaInicio, horasTotales, trabajo_id, usuario_id } = req.body;

    if (!fechaInicio || !horaInicio || !horasTotales) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Convertimos horasTotales al formato correcto (en minutos)
    let totalMinutos = 0;
    if (typeof horasTotales === 'string' && horasTotales.includes(':')) {
        const [horas, minutos] = horasTotales.split(':').map(Number);
        totalMinutos = (horas * 60) + minutos;
    } else if (!isNaN(Number(horasTotales))) {
        totalMinutos = Number(horasTotales) * 60; // Si es un número, asumimos que son horas
    } else {
        return res.status(400).json({ error: 'Formato inválido para horasTotales' });
    }

    try {
        const datos = await agregarTrabajoHoras(fechaInicio, horaInicio, totalMinutos, trabajo_id, usuario_id);
        res.status(200).json({ message: 'Trabajo agregado exitosamente', data: datos });
    } catch (error) {
        console.error('Error al agregar el trabajo:', error);
        res.status(500).json({ error: 'Error al agregar el trabajo' });
    }
}
  

  export const saveHorario = async (req, res) => {
    try {
        const { actividad, asistente_administrativa, carrera, trabajador_id, fecha_entrega, fecha_limite, hora_duracion, minuto_duracion, jefe_produccion, modalidad, nivel, nombre_cliente, numero_documento, numero_whatsapp, prioridad, universidad, init_date, fecha_inicio_horario, hora_inicio, minuto_inicio, descripcion_trabajo } = req.body;

        const trabajo = await Trabajos.create({
            actividad_id: actividad,
            descripcion: descripcion_trabajo,
            duracion: hora_duracion,
            nivel_academico: nivel,
            prioridad: prioridad,
            fecha_limite: fecha_limite,
            fecha_entrega: fecha_entrega,
            padre_trabajo_id: 0,
            estado: "1",
            entidad: universidad
        });

        const trabajo_id = trabajo.id;

        let fechaInicio;
        let horaInicio;

        if(init_date == 1) {
            fechaInicio = fecha_inicio_horario;
            horaInicio = hora_inicio+":"+minuto_inicio;
        } else {
            const ultimoTrabajo = await Horario.findOne({
                where: {
                  usuario_id: trabajador_id
                },
                order: [['fecha_fin', 'DESC']]
            });

            const fecha_fin = moment(ultimoTrabajo.fecha_fin).tz('America/Lima').format('YYYY-MM-DD HH:mm:ss');
            

            const [fecha, hora] = fecha_fin.split(" ")

            const [hour, min, segundos] = hora.split(":");
            
            fechaInicio = fecha;
            horaInicio = hour+":"+min;
            
        }

        const datosParaEnviar = {
            fechaInicio: fechaInicio,
            horaInicio: horaInicio,
            horasTotales: hora_duracion+":"+minuto_duracion,
            trabajo_id: trabajo_id,
            usuario_id: trabajador_id
        };

        let config = {
            method: "post",
            url: process.env.URL_APP+"/api/trabajo-horario",
            data: datosParaEnviar,
        };

        try {
            const response = await axios(config);
            const datos = response.data;

            res.status(200).json({
                mensaje: 'Ruta POST interna llamada exitosamente',
                data: datos
            });
        } catch (error) {
            res.status(500).json({
            mensaje: 'Error',
            data: error
            });
        }

      

    } catch (error) {
      res.status(500).json(error)
    }
  }