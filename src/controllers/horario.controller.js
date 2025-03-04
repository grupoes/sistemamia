import { sequelize } from "../database/database.js";

import dayjs from 'dayjs';

import { Horario } from "../models/horario.js";
import { Trabajos } from "../models/trabajos.js";
import { Trabajadores } from "../models/trabajadores.js";
import { Usuario } from "../models/usuario.js";
import { Actividades } from "../models/actividades.js";
import { UsuarioPerfil } from "../models/usuario_perfil.js";

import moment from "moment-timezone";
import axios from "axios";

import { Op } from "sequelize";

import { DateTime } from "luxon";

export const viewHorarioGeneral = (req, res) => {
  const timestamp = Date.now();

  const css = [
    "assets/libs/datatables.net-bs4/css/dataTables.bootstrap4.min.css",
    "https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.min.css",
  ];

  const js = [
    "assets/libs/datatables.net/js/jquery.dataTables.min.js",
    "assets/libs/datatables.net-bs4/js/dataTables.bootstrap4.min.js",
    "https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.all.min.js",
    "/js/horarioGeneral.js" + "?t=" + timestamp,
  ];

  res.render("horarios/general", { layout: "partials/main", css, js });
};

export const viewHorario = (req, res) => {
  const timestamp = Date.now();

  const css = [
    "assets/libs/datatables.net-bs4/css/dataTables.bootstrap4.min.css",
    "https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.min.css",
    "assets/libs/%40fullcalendar/core/main.min.css",
    "assets/libs/%40fullcalendar/daygrid/main.min.css",
    "assets/libs/%40fullcalendar/bootstrap/main.min.css",
    "assets/libs/%40fullcalendar/timegrid/main.min.css",
    "assets/libs/%40fullcalendar/list/main.min.css",
  ];

  const js = [
    "assets/libs/datatables.net/js/jquery.dataTables.min.js",
    "assets/libs/datatables.net-bs4/js/dataTables.bootstrap4.min.js",
    "https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.all.min.js",
    "assets/libs/moment/min/moment.min.js",
    "assets/libs/%40fullcalendar/core/main.min.js",
    "assets/libs/%40fullcalendar/bootstrap/main.min.js",
    "assets/libs/%40fullcalendar/daygrid/main.min.js",
    "assets/libs/%40fullcalendar/timegrid/main.min.js",
    "assets/libs/%40fullcalendar/list/main.min.js",
    "assets/libs/%40fullcalendar/interaction/main.min.js",
    "/js/horario.js" + "?t=" + timestamp,
  ];

  res.render("horarios/index", { layout: "partials/main", css, js });
};

export const horarioAuxiliar = async (req, res) => {
  try {
    const id = req.params.id;

    const horario = await Horario.findAll({
      attributes: ["id", "fecha_inicio", "fecha_fin"],
      where: {
        usuario_id: id,
      },
      include: {
        model: Trabajos,
        attributes: ["descripcion", "color"],
        include: {
          model: Actividades,
          attributes: ["name"],
        },
      },
    });

    const defaultEvents = horario.map((item) => {
      const { id, fecha_inicio, fecha_fin, trabajo } = item;

      const { descripcion, color, actividade } = trabajo;

      return {
        id,
        title: actividade.name + " - " + descripcion,
        start: fecha_inicio,
        end: fecha_fin,
        backgroundColor: color,
      };
    });

    return res.status(200).json({ message: "ok", data: defaultEvents });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//horario ejemplo
export const viewHorarioEjemplo = (req, res) => {
  const timestamp = Date.now();

  const css = [
    "assets/libs/datatables.net-bs4/css/dataTables.bootstrap4.min.css",
    "https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.min.css",
    "assets/libs/%40fullcalendar/core/main.min.css",
    "assets/libs/%40fullcalendar/daygrid/main.min.css",
    "assets/libs/%40fullcalendar/bootstrap/main.min.css",
    "assets/libs/%40fullcalendar/timegrid/main.min.css",
    "assets/libs/%40fullcalendar/list/main.min.css",
  ];

  const js = [
    "assets/libs/datatables.net/js/jquery.dataTables.min.js",
    "assets/libs/datatables.net-bs4/js/dataTables.bootstrap4.min.js",
    "https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.all.min.js",
    "assets/libs/moment/min/moment.min.js",
    "assets/libs/%40fullcalendar/core/main.min.js",
    "assets/libs/%40fullcalendar/bootstrap/main.min.js",
    "assets/libs/%40fullcalendar/daygrid/main.min.js",
    "assets/libs/%40fullcalendar/timegrid/main.min.js",
    "assets/libs/%40fullcalendar/list/main.min.js",
    "assets/libs/%40fullcalendar/interaction/main.min.js",
    "/js/horario_ejemplo.js" + "?t=" + timestamp,
  ];

  res.render("horarios/ejemplo", { layout: "partials/main", css, js });
};

export const verificarDisponibilidad = async (req, res) => {
  const { horasNecesarias, fechaLimite } = req.body;

  // Convertir fecha límite a objeto Date
  const fechaLimiteDate = new Date(fechaLimite);

  const users = await Usuario.findAll({
    include: {
      model: Trabajadores,
    },
    order: [[{ model: Trabajadores }, "fecha_contrato", "ASC"]],
  });

  let userDisponibles = [];

  for (const user of users) {
    // Obtener el último trabajo del usuario antes de la fecha límite
    const ultimoTrabajo = await Horario.findOne({
      where: {
        usuario_id: user.id,
        //fecha_fin: { [Op.lte]: fechaLimiteDate }
      },
      order: [["fecha_fin", "DESC"]],
    });

    if (ultimoTrabajo === null) {
      userDisponibles.push(user);
    } else {
      const fecha_fin = moment(ultimoTrabajo.fecha_fin)
        .tz("America/Lima")
        .format("YYYY-MM-DD HH:mm:ss");

      // Calcular disponibilidad
      const disponibilidad = calcularDisponibilidad(
        fecha_fin,
        fechaLimiteDate,
        horasNecesarias
      );

      if (disponibilidad == "disponible") {
        userDisponibles.push(user);
      }
    }
  }

  return res.json(userDisponibles);
};

function convertirHorasAMinutos(horasFormato) {
  const [horas, minutos] = horasFormato.split(":").map(Number);
  return horas * 60 + (minutos || 0); // Convierte las horas y minutos a minutos totales
}

function calcularDisponibilidad(
  fechaInicio,
  fechaLimite,
  horasNecesariasFormato
) {
  const horarios = {
    lunesAViernes: [
      { inicio: 8, fin: 13 },
      { inicio: 15, fin: 19 },
    ],
    sabado: [{ inicio: 8, fin: 13 }],
  };

  const minutosNecesarios = convertirHorasAMinutos(horasNecesariasFormato); // Convertimos a minutos
  let minutosAcumulados = 0;
  let fechaActual = new Date(fechaInicio); // Asegúrate de que es un objeto Date válido.

  while (fechaActual <= fechaLimite && minutosAcumulados < minutosNecesarios) {
    const diaSemana = fechaActual.getDay();

    // Define horarios de trabajo dependiendo del día de la semana
    let horariosTrabajo = [];
    if (diaSemana >= 1 && diaSemana <= 5) {
      // Lunes a Viernes
      horariosTrabajo = horarios.lunesAViernes;
    } else if (diaSemana === 6) {
      // Sábado
      horariosTrabajo = horarios.sabado;
    }

    for (const horario of horariosTrabajo) {
      const inicioBloque = new Date(fechaActual);
      inicioBloque.setHours(horario.inicio, 0, 0, 0);

      const finBloque = new Date(fechaActual);
      finBloque.setHours(horario.fin, 0, 0, 0);

      // Ajusta el inicio del bloque si `fechaInicio` está dentro del bloque
      const inicioTrabajo =
        fechaInicio > inicioBloque ? fechaInicio : inicioBloque;
      const finTrabajo = fechaLimite < finBloque ? fechaLimite : finBloque;

      if (inicioTrabajo < finTrabajo) {
        const minutosDisponibles = (finTrabajo - inicioTrabajo) / (1000 * 60); // Convertimos a minutos
        if (minutosAcumulados + minutosDisponibles >= minutosNecesarios) {
          // Si este bloque satisface lo restante
          return "disponible";
        } else {
          minutosAcumulados += minutosDisponibles;
        }
      }
    }

    // Avanza al siguiente día
    fechaActual.setDate(fechaActual.getDate() + 1);
    fechaActual.setHours(0, 0, 0, 0); // Reinicia la hora del día
  }

  return minutosAcumulados >= minutosNecesarios
    ? "disponible"
    : "No hay disponibilidad";
}

async function agregarTrabajoHoras(
  fechaInicio,
  horaInicio,
  horasTotales,
  trabajo_id,
  usuario_id
) {
  let minutosRestantes = horasTotales; // Convertimos a minutos

  // Convertimos la fecha de inicio a un objeto Date en UTC
  const [year, month, day] = fechaInicio.split("-");
  const fechaInicioOriginal = new Date(Date.UTC(year, month - 1, day));

  const [horaInicial, minutoInicial] = horaInicio.split(":").map(Number);
  fechaInicioOriginal.setUTCHours(horaInicial, minutoInicial);

  let fechaActual = new Date(fechaInicioOriginal); // Aseguramos que la fecha es en UTC

  const horariosPermitidos = {
    lunesAViernes: [
      { inicio: 8 * 60, fin: 13 * 60 }, // De 8:00 a 13:00 en minutos
      { inicio: 15 * 60, fin: 19 * 60 }, // De 15:00 a 19:00 en minutos
    ],
    sabado: [
      { inicio: 8 * 60, fin: 13 * 60 }, // De 8:00 a 13:00 en minutos
    ],
  };

  let datos = [];

  while (minutosRestantes > 0) {
    const diaSemana = fechaActual.getUTCDay();

    const bloquesDia =
      diaSemana >= 1 && diaSemana <= 5
        ? horariosPermitidos.lunesAViernes
        : diaSemana === 6
        ? horariosPermitidos.sabado
        : [];

    for (let bloque of bloquesDia) {
      if (minutosRestantes <= 0) break;

      const horaActualMinutos =
        fechaActual.getUTCHours() * 60 + fechaActual.getUTCMinutes();
      const horaInicioBloque = Math.max(horaActualMinutos, bloque.inicio);

      if (horaInicioBloque >= bloque.fin) continue; // Si ya pasó el bloque, salta al siguiente

      const minutosDisponiblesEnBloque = bloque.fin - horaInicioBloque;
      const minutosAsignados = Math.min(
        minutosDisponiblesEnBloque,
        minutosRestantes
      );

      const horaInicioFormato = `${String(
        Math.floor(horaInicioBloque / 60)
      ).padStart(2, "0")}:${String(horaInicioBloque % 60).padStart(2, "0")}:00`;
      const horaFinBloque = horaInicioBloque + minutosAsignados;
      const horaFinFormato = `${String(Math.floor(horaFinBloque / 60)).padStart(
        2,
        "0"
      )}:${String(horaFinBloque % 60).padStart(2, "0")}:00`;

      // Almacenamos los datos de la tarea
      datos.push({
        fecha: fechaActual.toISOString().split("T")[0],
        horainicio: horaInicioFormato,
        horafin: horaFinFormato,
        estado: "Pendiente",
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
      usuario_id: usuario_id,
    });
  }

  return datos;
}

export const addTrabajoHorario = async (req, res) => {
  const { fechaInicio, horaInicio, horasTotales, trabajo_id, usuario_id } =
    req.body;

  if (!fechaInicio || !horaInicio || !horasTotales) {
    return res.status(400).json({ error: "Todos los campos son requeridos" });
  }

  // Convertimos horasTotales al formato correcto (en minutos)
  let totalMinutos = 0;
  if (typeof horasTotales === "string" && horasTotales.includes(":")) {
    const [horas, minutos] = horasTotales.split(":").map(Number);
    totalMinutos = horas * 60 + minutos;
  } else if (!isNaN(Number(horasTotales))) {
    totalMinutos = Number(horasTotales) * 60; // Si es un número, asumimos que son horas
  } else {
    return res
      .status(400)
      .json({ error: "Formato inválido para horasTotales" });
  }

  try {
    const datos = await agregarTrabajoHoras(
      fechaInicio,
      horaInicio,
      totalMinutos,
      trabajo_id,
      usuario_id
    );
    res
      .status(200)
      .json({ message: "Trabajo agregado exitosamente", data: datos });
  } catch (error) {
    console.error("Error al agregar el trabajo:", error);
    res.status(500).json({ error: "Error al agregar el trabajo" });
  }
};

export const saveHorario = async (req, res) => {
  try {
    const {
      actividad,
      asistente_administrativa,
      carrera,
      trabajador_id,
      fecha_entrega,
      fecha_limite,
      hora_duracion,
      minuto_duracion,
      jefe_produccion,
      modalidad,
      nivel,
      nombre_cliente,
      numero_documento,
      numero_whatsapp,
      prioridad,
      universidad,
      init_date,
      fecha_inicio_horario,
      hora_inicio,
      minuto_inicio,
      descripcion_trabajo,
    } = req.body;

    const colores = [
      "#FF6B6B",
      "#FF8E72",
      "#FFCA3A",
      "#8AC926",
      "#1982C4",
      "#6A4C93",
      "#FF595E",
      "#FF924C",
      "#FFDD4A",
      "#70E000",
      "#4CC9F0",
      "#8338EC",
      "#FF4D6D",
      "#FF6F3C",
      "#FFA822",
      "#55A630",
      "#0077B6",
      "#9D4EDD",
      "#C9184A",
      "#FF7F11",
      "#FFD60A",
      "#80B918",
      "#007F5F",
      "#40916C",
      "#1D3557",
      "#E63946",
      "#F77F00",
      "#D62828",
      "#F4A261",
      "#2A9D8F",
      "#007EA7",
      "#293241",
      "#EE6C4D",
      "#8ECAE6",
      "#219EBC",
      "#3A0CA3",
      "#8338EC",
      "#1A535C",
      "#FF6F61",
      "#FF4D00",
      "#FFB400",
      "#FB8500",
      "#AACC00",
      "#0081A7",
      "#CC5803",
      "#006D77",
      "#6C757D",
      "#495057",
      "#37474F",
      "#4E4E50",
    ];

    const colorAleatorio = colores[Math.floor(Math.random() * colores.length)];

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
      entidad: universidad,
      color: colorAleatorio,
    });

    const trabajo_id = trabajo.id;

    let fechaInicio;
    let horaInicio;

    if (init_date == 1) {
      fechaInicio = fecha_inicio_horario;
      horaInicio = hora_inicio + ":" + minuto_inicio;
    } else {
      const ultimoTrabajo = await Horario.findOne({
        where: {
          usuario_id: trabajador_id,
        },
        order: [["fecha_fin", "DESC"]],
      });

      const fecha_fin = moment(ultimoTrabajo.fecha_fin)
        .tz("America/Lima")
        .format("YYYY-MM-DD HH:mm:ss");

      const [fecha, hora] = fecha_fin.split(" ");

      const [hour, min, segundos] = hora.split(":");

      fechaInicio = fecha;
      horaInicio = hour + ":" + min;
    }

    const datosParaEnviar = {
      fechaInicio: fechaInicio,
      horaInicio: horaInicio,
      horasTotales: hora_duracion + ":" + minuto_duracion,
      trabajo_id: trabajo_id,
      usuario_id: trabajador_id,
    };

    let config = {
      method: "post",
      url:
        process.env.URL_APP +
        ":" +
        process.env.PUERTO_APP_RED +
        "/api/trabajo-horario",
      data: datosParaEnviar,
    };

    try {
      const response = await axios(config);
      const datos = response.data;

      res.status(200).json({
        mensaje: "Ruta POST interna llamada exitosamente",
        data: datos,
      });
    } catch (error) {
      res.status(500).json({
        mensaje: "Error",
        data: error,
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const renderJefesProduccion = async (req, res) => {
  try {
    const query = `select * from trabajadores t
        inner join usuario u on u.trabajador_id = t.id
        inner join usuario_perfil up on up.usuario_id = u.id
        where up.perfil_id = 9`;

    const results = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      raw: true,
      nest: true,
    });

    return res.json(results);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const renderAsistentes = async (req, res) => {
  try {
    const query = `select * from trabajadores t
        inner join usuario u on u.trabajador_id = t.id
        inner join usuario_perfil up on up.usuario_id = u.id
        where up.perfil_id = 7`;

    const results = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      raw: true,
      nest: true,
    });

    return res.json(results);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const reorganizarHorario = (req, res) => {
    const horarios = [
        {
            fecha_inicio: "2024-12-02 15:00:00.000",
            fecha_fin: "2024-12-02 19:00:00.000",
        },
        {
            fecha_inicio: "2024-12-03 08:00:00.000",
            fecha_fin: "2024-12-03 13:00:00.000",
        },
        {
            fecha_inicio: "2024-12-03 15:00:00.000",
            fecha_fin: "2024-12-03 19:00:00.000",
        },
    ];
    
    // Configuración del horario fijo
    const HORARIO_FIJO = {
        lunes_viernes: [
            { inicio: "08:00:00", fin: "13:00:00" },
            { inicio: "15:00:00", fin: "19:00:00" },
        ],
        sabado: [{ inicio: "08:00:00", fin: "13:00:00" }],
    };

    const nuevoInicio = "2024-12-03 08:00:00.000";
    const nuevaDuracion = 2;

    const nuevoTrabajoInicio = new Date(nuevoInicio);
    const nuevoTrabajoFin = new Date(nuevoInicio);
    nuevoTrabajoFin.setHours(nuevoTrabajoFin.getHours() + nuevaDuracion);
  
    console.log(nuevoTrabajoFin)

    const nuevosHorarios = [];
    let desplazamientoPendiente = nuevaDuracion;

    for (let i = 0; i < horarios.length; i++) {
        const inicioActual = new Date(horarios[i].fecha_inicio);
        const finActual = new Date(horarios[i].fecha_fin);

        // Si el nuevo horario encaja antes del actual
        if (nuevoTrabajoFin <= inicioActual && desplazamientoPendiente > 0) {
            nuevosHorarios.push({
                fecha_inicio: nuevoTrabajoInicio.toISOString(),
                fecha_fin: nuevoTrabajoFin.toISOString(),
            });
            desplazamientoPendiente = 0;
        }

        // Si hay traslape con el horario actual
        if (
            nuevoTrabajoInicio < finActual &&
            nuevoTrabajoFin > inicioActual &&
            desplazamientoPendiente > 0
        ) {
            const desplazadoInicio = new Date(finActual);
            const desplazadoFin = new Date(finActual);
            desplazadoFin.setHours(desplazadoFin.getHours() + desplazamientoPendiente);

            nuevosHorarios.push({
                fecha_inicio: inicioActual.toISOString(),
                fecha_fin: nuevoTrabajoInicio.toISOString(),
            });

            nuevosHorarios.push({
                fecha_inicio: nuevoTrabajoInicio.toISOString(),
                fecha_fin: nuevoTrabajoFin.toISOString(),
            });

            nuevosHorarios.push({
                fecha_inicio: finActual.toISOString(),
                fecha_fin: desplazadoFin.toISOString(),
            });

            desplazamientoPendiente = 0;
        } else {
            // Si no hay traslape, agregar el horario actual sin cambios
            nuevosHorarios.push(horarios[i]);
        }
    }

    // Si el nuevo trabajo no fue insertado, agregarlo al final
    if (desplazamientoPendiente > 0) {
        nuevosHorarios.push({
            fecha_inicio: nuevoTrabajoInicio.toISOString(),
            fecha_fin: nuevoTrabajoFin.toISOString(),
        });
    }

    return res.json(nuevosHorarios);
}

export const calcularIntervalosTrabajo = (req, res) => {
  const {duracionHoras, fechaInicio} = req.body;
  const horario = {
    lunesAViernes: [
      { inicio: '08:00:00', fin: '13:00:00' },
      { inicio: '15:00:00', fin: '19:00:00' }
    ],
    sabado: [{ inicio: '08:00:00', fin: '13:00:00' }]
  };

  const feriados = ['2024-12-09','2024-12-25'];

  // Conversión de horas laborales a Day.js
  const convertirHorario = (fecha, rango) => ({
    inicio: dayjs(`${fecha.format('YYYY-MM-DD')} ${rango.inicio}`),
    fin: dayjs(`${fecha.format('YYYY-MM-DD')} ${rango.fin}`)
  });

  // Calcular el próximo día laborable, excluyendo feriados
  const siguienteDiaLaboral = (fecha) => {
    let nuevoDia = fecha.add(1, 'day').startOf('day');
    while (nuevoDia.day() === 0 || nuevoDia.day() === 6 || feriados.includes(nuevoDia.format('YYYY-MM-DD'))) {
      nuevoDia = nuevoDia.add(1, 'day');
    }
    return nuevoDia;
  };

  let trabajoRestante = duracionHoras; // Horas restantes para el trabajo
  let fechaActual = dayjs(fechaInicio); // Fecha inicial
  const intervalosTrabajo = []; // Lista de intervalos de trabajo

  while (trabajoRestante > 0) {
    const dia = fechaActual.day();
    const esFeriado = feriados.includes(fechaActual.format('YYYY-MM-DD'));

    // Saltar si el día actual es feriado o no es laborable
    if (esFeriado || dia === 0 || (dia === 6 && horario.sabado.length === 0)) {
      fechaActual = siguienteDiaLaboral(fechaActual);
      continue;
    }

    const horarioDia =
      dia >= 1 && dia <= 5
        ? horario.lunesAViernes
        : dia === 6
        ? horario.sabado
        : [];

    for (const rango of horarioDia) {
      const { inicio, fin } = convertirHorario(fechaActual, rango);
      if (fechaActual.isBefore(fin)) {
        const inicioTrabajo = fechaActual.isBefore(inicio) ? inicio : fechaActual;
        const horasDisponibles = Math.min(fin.diff(inicioTrabajo, 'hour', true), trabajoRestante);
        const finTrabajo = inicioTrabajo.add(horasDisponibles, 'hour');

        intervalosTrabajo.push({
          fecha_inicio: inicioTrabajo.format('YYYY-MM-DD HH:mm:ss'),
          fecha_fin: finTrabajo.format('YYYY-MM-DD HH:mm:ss')
        });

        trabajoRestante -= horasDisponibles;
        fechaActual = finTrabajo;

        if (trabajoRestante <= 0) {
          break;
        }
      }
    }

    if (trabajoRestante > 0) {
      fechaActual = siguienteDiaLaboral(fechaActual);
    }
  }

  return res.json(intervalosTrabajo);
}
