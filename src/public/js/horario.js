/*
Template Name: Shreyu - Responsive Bootstrap 5 Admin Dashboard
Author: CoderThemes
Website: https://coderthemes.com/
Contact: support@coderthemes.com
File: Calendar init js
*/


!function($) {
    "use strict";

    var CalendarApp = function() {
        this.$body = $("body")
        this.$modal = $('#event-modal'),
        this.$calendar = $('#calendar'),
        this.$formEvent = $("#form-event"),
        this.$btnNewEvent = $("#btn-new-event"),
        this.$btnDeleteEvent = $("#btn-delete-event"),
        this.$btnSaveEvent = $("#btn-save-event"),
        this.$modalTitle = $("#modal-title"),
        this.$calendarObj = null,
        this.$selectedEvent = null,
        this.$newEventData = null,

        this.$selectAuxiliar= $("#event-select-auxiliar")
    };


    /* on click on event */
    CalendarApp.prototype.onEventClick =  function (info) {
        this.$formEvent[0].reset();
        this.$formEvent.removeClass("was-validated");
        
        this.$newEventData = null;
        this.$btnDeleteEvent.show();
        this.$modalTitle.text('Edit Event');
        

        this.$modal.modal('show');

        this.$selectedEvent = info.event;
        $("#event-title").val(this.$selectedEvent.title);
        $("#event-category").val(this.$selectedEvent.classNames[0]);
    },

    /* on select */
    CalendarApp.prototype.onSelect = function (info) {
        this.$formEvent[0].reset();
        this.$formEvent.removeClass("was-validated");
        
        this.$selectedEvent = null;
        this.$newEventData = info;
        this.$btnDeleteEvent.hide();
        this.$modalTitle.text('Add New Event');

        
        this.$modal.modal('show');

        this.$calendarObj.unselect();
    },

    CalendarApp.prototype.actualizarEventosCalendario = async function (id) {
        try {
            const respuesta = await fetch('/horario-auxiliar-calendar/' + id);
            const datos = await respuesta.json();
            const resp = datos.data;
    
            const inicio_primera_vez = document.getElementById('inicio_primera_vez');
            const init_date = document.getElementById('init_date');
    
            if (resp.length === 0) {
                inicio_primera_vez.removeAttribute('hidden');
                init_date.value = 1;
            } else {
                inicio_primera_vez.setAttribute('hidden', true);
                init_date.value = 0;
            }
    
            this.$calendarObj.removeAllEvents();
            this.$calendarObj.addEventSource(resp);
            this.$calendarObj.rerenderEvents();
        } catch (error) {
            console.error('Error al actualizar eventos del calendario:', error);
        }
    };
    
    /* Initializing */
    CalendarApp.prototype.init = function() {
        
        /*  Initialize the calendar  */
        var today = new Date($.now());

        var defaultEvents = []

        /*var defaultEvents =  [
            {
                title: 'Proyecto',
                start: '2024-11-22 08:00:00',
                end: '2024-11-22 13:00:00',
                className: 'bg-warning'
            },
            {
                title: 'tesis',
                start: today,
                end: today,
                className: 'bg-success'
            },
            {
                title: 'enfoque',
                start: '2024-11-26 13:00:00',
                end: '2024-11-26 14:00:00',
                className: 'bg-info'
            },
            {
                title: 'Buy Design Assets',
                start: new Date($.now() + 338000000),
                end: new Date($.now() + 338000000 * 1.2),
                className: 'bg-primary',
            },
            {
                id: 1,
                title: "variable 1 + variable 2",
                start: "2024-11-25T13:00:00.000Z",
                end: "2024-11-25T17:00:00.000Z",
                className: "bg-primary"
            },
            {
                id: 2,
                title: "variable 1 + variable 2",
                start: "2024-03-25T17:00:00.000Z",
                end: "2024-03-26T14:00:00.000Z",
                className: "bg-secondary"
            }

        ];*/

        var $this = this;

        // cal - init
        $this.$calendarObj = new FullCalendar.Calendar($this.$calendar[0], {
            allDaySlot: false,
            height: 'auto',
            aspectRatio: 1.8,
            plugins: [ 'bootstrap', 'interaction', 'dayGrid', 'timeGrid', 'list' ],
            slotDuration: '00:15:00', /* If we want to split day time each 15minutes */
            minTime: '08:00:00',
            maxTime: '20:00:00',  
            themeSystem: 'bootstrap',
            bootstrapFontAwesome: false,
            allDayText: '',
            locale: 'es',
            firstDay: 1,
            slotLabelFormat: {
                hour: 'numeric',
                minute: '2-digit',
                omitZeroMinute: false,
                meridiem: 'short'
            },
            buttonText: {
                today: 'Hoy',
                month: 'Mes',
                week: 'Semana',
                day: 'Día',
                list: 'Lista',
                prev: 'Anterior',
                next: 'Siguiente'
            },
            defaultView: 'timeGridWeek',  
            handleWindowResize: true,   
            //height: $(window).height() - 200,   
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
            },
            events: defaultEvents,
            editable: false,
            droppable: true, // this allows things to be dropped onto the calendar !!!
            eventLimit: true, // allow "more" link when too many events
            selectable: true,
            dateClick: function (info) { $this.onSelect(info); },
            eventClick: function(info) { $this.onEventClick(info); }
        });

        $this.$calendarObj.render();

        // Formulario para guardar datos
        const formDatos = document.getElementById('formDatos');
        formDatos.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(formDatos);
            const formDataObj = {};
            formData.forEach((value, key) => {
                formDataObj[key] = value;
            });

            try {
                const respuesta = await fetch('/guardarTrabajo', {
                    method: 'POST',
                    body: JSON.stringify(formDataObj),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (respuesta.ok) {
                    // Actualizar el calendario con los eventos correspondientes
                    const id = $this.$selectAuxiliar.val();
                    await $this.actualizarEventosCalendario(id);
                } else {
                    console.error('Error al enviar el formulario');
                }

            } catch (error) {
                console.error('Error al procesar el formulario:', error);
            }
        });

        // on new event button click
        $this.$btnNewEvent.on('click', function(e) {
            $this.onSelect({date: new Date(), allDay: true});
        });

        // save event
        $this.$formEvent.on('submit', function(e) {
            e.preventDefault();
            var form = $this.$formEvent[0];

            // validation
            if (form.checkValidity()) {
                if ($this.$selectedEvent) {
                    $this.$selectedEvent.setProp('title', $("#event-title").val());
                    $this.$selectedEvent.setProp('classNames', [$("#event-category").val()]);
                } else {
                    var eventData = {
                        title: $("#event-title").val(),
                        start: $this.$newEventData.date,
                        allDay: $this.$newEventData.allDay,
                        className: $("#event-category").val()
                    }
                    $this.$calendarObj.addEvent(eventData);
                }
                $this.$modal.modal('hide');
            } else {
                e.stopPropagation();
                form.classList.add('was-validated');
            }
        });

        //select auxiliar
        this.$selectAuxiliar.on('change', async function(e) {
            const id = e.target.value;

            const nombre_trabajador = e.target.options[e.target.selectedIndex].text;
        
            const title_trabajador = document.getElementById('title_trabajador');

            title_trabajador.textContent = nombre_trabajador;

            $this.$calendarObj.removeAllEvents();

            await $this.actualizarEventosCalendario(id);
        });

        // delete event
        $($this.$btnDeleteEvent.on('click', function(e) {
            if ($this.$selectedEvent) {
                $this.$selectedEvent.remove();
                $this.$selectedEvent = null;
                $this.$modal.modal('hide');
            }
        }));
    },

   //init CalendarApp
    $.CalendarApp = new CalendarApp, $.CalendarApp.Constructor = CalendarApp
    
}(window.jQuery),

//initializing CalendarApp
function($) {
    "use strict";
    $.CalendarApp.init()
}(window.jQuery);


const auxiliares = document.getElementById('event-select-auxiliar');
const btn_disponibilidad = document.getElementById('btn_disponibilidad');

const hora_duracion = document.getElementById('hora_duracion');
const minuto_duracion = document.getElementById('minuto_duracion');
const fecha_entrega = document.getElementById('fecha_entrega');

btn_disponibilidad.addEventListener('click', (e) => {
    let horas_necesarias = hora_duracion.value + ":" + minuto_duracion.value;

    let datos = {
        horasNecesarias: horas_necesarias,
        fechaLimite: fecha_entrega.value
    }

    btn_disponibilidad.disabled = true;
    btn_disponibilidad.textContent = "Consultando..."
    renderAuxiliares(datos);
})

function renderAuxiliares(datos) {
    fetch('/disponibilidad', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(res => res.json())
    .then(data => {

        btn_disponibilidad.disabled = false;
        btn_disponibilidad.textContent = "Consultar Disponibilidad"

        let html = "<option value=''>Seleccione...</option>";
        data.forEach(auxiliar => {
            html += `<option value="${auxiliar.id}">${auxiliar.trabajadore.nombres} ${auxiliar.trabajadore.apellidos}</option>`;
        });

        auxiliares.innerHTML = html;
    })
}

renderTipoActividaddes();

const actividad = document.getElementById('actividad');

function renderTipoActividaddes() {
    fetch('/activities')
    .then(res => res.json())
    .then(data => {
        let datos = data.data;

        let html = `<option value="">Seleccione...</option>`;

        datos.forEach(act => {
            html += `
                <option value="${act.id}">${act.name}</option>
            `;
        });
        
        actividad.innerHTML = html;
    })
}