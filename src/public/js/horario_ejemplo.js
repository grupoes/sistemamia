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

        this.$activityName = $("#activity-name"),
        this.$activityDuration = $("#activity-duration"),
        this.$btnAddActivity = $("#btn-add-activity")
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

     /* Agregar nueva actividad con nombre y duración */
    CalendarApp.prototype.addActivity = function() {
        var $this = this;
        var name = this.$activityName.val();
        var duration = parseInt(this.$activityDuration.val(), 10);

        if (!name || isNaN(duration) || duration <= 0) {
            alert("Por favor, ingrese un nombre válido y una duración positiva.");
            return;
        }

        var currentDate = new Date();
        var startDate = this.findNextAvailableSlot(currentDate, duration);
        if (!startDate) {
            alert("No se puede programar la actividad en el horario laboral disponible.");
            return;
        }

        var eventData = {
            title: name,
            start: startDate,
            end: this.addHours(startDate, duration),
            allDay: false
        };
        this.$calendarObj.addEvent(eventData);
    },

    CalendarApp.prototype.findNextAvailableSlot = function(startDate, duration) {
        var current = new Date(startDate.getTime());
        while (true) {
            var dayOfWeek = current.getDay();
            var currentHour = current.getHours();
            var minutes = current.getMinutes();

            // Verificar si el horario actual está dentro de las horas laborales
            if (this.isWithinBusinessHours(current)) {
                var timeRemainingToday = this.calculateRemainingHoursToday(current);
                if (duration <= timeRemainingToday) {
                    return current;
                } else {
                    duration -= timeRemainingToday;
                    return current = this.moveToNextWorkPeriod(current);
                }
            } else {
                return current = this.moveToNextWorkPeriod(current);
            }
        }
    },

    /* Calcular horas restantes en el día laboral actual */
    CalendarApp.prototype.calculateRemainingHoursToday = function(current) {
        var dayOfWeek = current.getDay();
        var currentHour = current.getHours();
        var minutes = current.getMinutes();
        
        // Horario laboral de lunes a viernes
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            if (currentHour >= 8 && currentHour < 13) {
                return (13 - currentHour) + (60 - minutes) / 60;
            } else if (currentHour >= 15 && currentHour < 19) {
                return (19 - currentHour) + (60 - minutes) / 60;
            }
        }
        // Horario laboral de los sábados
        else if (dayOfWeek === 6 && currentHour >= 8 && currentHour < 13) {
            return (13 - currentHour) + (60 - minutes) / 60;
        }
        return 0;
    },

    CalendarApp.prototype.isWithinBusinessHours = function(date) {
        var dayOfWeek = date.getDay();
        var currentHour = date.getHours();

        // De lunes a viernes
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            if ((currentHour >= 8 && currentHour < 13) || (currentHour >= 15 && currentHour < 19)) {
                return true;
            }
        } 
        // Sábado
        else if (dayOfWeek === 6) {
            if (currentHour >= 8 && currentHour < 13) {
                return true;
            }
        }
        return false;
    },

     /* Mover al siguiente periodo laboral disponible */
     CalendarApp.prototype.moveToNextWorkPeriod = function(current) {
        var dayOfWeek = current.getDay();
        var currentHour = current.getHours();

        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            if (currentHour >= 13 && currentHour < 15) {
                current.setHours(15, 0, 0, 0);
            } else if (currentHour >= 19) {
                current.setDate(current.getDate() + 1);
                current.setHours(8, 0, 0, 0);
            } else {
                current.setDate(current.getDate() + 1);
                current.setHours(8, 0, 0, 0);
            }
        } else if (dayOfWeek === 6 && currentHour >= 13) {
            current.setDate(current.getDate() + 2); // Saltar al lunes
            current.setHours(8, 0, 0, 0);
        } else {
            current.setDate(current.getDate() + 1);
            current.setHours(8, 0, 0, 0);
        }
        return current;
    },

    CalendarApp.prototype.addHours = function(date, hours) {
        return new Date(date.getTime() + hours * 60 * 60 * 1000);
    },
    
    /* Initializing */
    CalendarApp.prototype.init = function() {
        
        /*  Initialize the calendar  */
        var today = new Date($.now());

        var defaultEvents =  [];

        var $this = this;

        // cal - init
        $this.$calendarObj = new FullCalendar.Calendar($this.$calendar[0], {
            allDaySlot: false,
            height: 'auto',
            aspectRatio: 1.8,
            plugins: [ 'bootstrap', 'interaction', 'dayGrid', 'timeGrid', 'list' ],
            slotDuration: '00:30:00', /* If we want to split day time each 15minutes */
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
            selectConstraint: {
                start: '08:00',
                end: '19:00',
            },
            validRange: function(nowDate) {
                return {
                    start: nowDate
                };
            },
            businessHours: [
                {
                    daysOfWeek: [ 1, 2, 3, 4, 5 ], // Lunes a viernes
                    startTime: '08:00',
                    endTime: '13:00'
                },
                {
                    daysOfWeek: [ 1, 2, 3, 4, 5 ], // Lunes a viernes
                    startTime: '15:00',
                    endTime: '19:00'
                },
                {
                    daysOfWeek: [ 6 ], // Sábado
                    startTime: '08:00',
                    endTime: '13:00'
                }
            ],
            dateClick: function (info) { $this.onSelect(info); },
            eventClick: function(info) { $this.onEventClick(info); }
        });

        $this.$calendarObj.render();

        // Añadir evento para el botón de agregar actividad
        $this.$btnAddActivity.on('click', function(e) {
            e.preventDefault();
            console.log('click en boton');
            
            $this.addActivity();
        });

        // on new event button click
        $this.$btnNewEvent.on('click', function(e) {
            $this.onSelect({date: new Date(), allDay: true});
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
/*function($) {
    "use strict";
    $.CalendarApp.init()
}(window.jQuery);*/

$(document).ready(function() {
    $.CalendarApp.init()
});
