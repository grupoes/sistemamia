const rol = document.getElementById('rol_user');
const iduser = document.getElementById('user_id');
const nameLogin = document.getElementById('nameLogin');

const token_ = localStorage.getItem('token');

window.addEventListener('load', (e) => {

    getDataToken(token_);

    getNotificationNotContest(token_);
    
});


function getDataToken(token_) {
    fetch('/getData', {
        headers: {
            'Authorization': 'Bearer ' + token_,
        }
    })
    .then(res => res.json())
    .then(data => {
        rol.value = data.rol;
        iduser.value = data.id;

        nameLogin.textContent = data.name;
    })
}

setInterval(() => {
    getNotificationNotContest(token_);
}, 30000);

function getNotificationNotContest(token) {
    fetch('/contactosNoContestados', {
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    })
    .then(res => res.json())
    .then(data => {

        const datos = data.data;

        const cantidad = datos.length;

        const cantidad_contactos = document.getElementById('cantidad_contactos');

        cantidad_contactos.textContent = cantidad;

        let noti = "";

        const notificaciones_contactos = document.getElementById('notificaciones_contactos');

        datos.forEach(contacto => {
            noti +=`
            <a href="javascript:void(0);" class="dropdown-item notify-item border-bottom" onclick="chatDetail('${contacto.contacto}', '${contacto.nameContacto}', '${contacto.etiquetaName}', ${contacto.potencial_id}, ${contacto.etiqueta_id}, ${contacto.rol}, ${contacto.asistente}, '${contacto.nameAsistente}')">
                <div class="notify-icon">
                    <img src="img/logos/icon.png" class="img-fluid rounded-circle" alt="" />
                </div>
                <p class="notify-details">${contacto.nameContacto}</p>
                <p class="text-muted mb-0 user-msg">
                    <small>Responder por favor, ya pasaron ${contacto.dias} dias, ${contacto.horas} horas y ${contacto.minutos} minutos</small>
                </p>
            </a>
            `;
        });

        notificaciones_contactos.innerHTML = noti;
    })
}


const salir = document.getElementById('cerrarSesion');

salir.addEventListener('click', (e) => {
    e.preventDefault();

    localStorage.removeItem('token');

    window.location='/';
});


setInterval(() => {
    notificacionesContacto(token_);
}, 5000);

function notificacionesContacto(token) {
    fetch('/notificationContacto', {
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    })
    .then(res => res.json())
    .then(data => {
        const lista = document.getElementById('listNotification');

        let html = "";

        const cantidad = document.getElementById('cantidadNoti');

        const quanty = data.length;

        cantidad.textContent = quanty;

        data.forEach(noti => {

            let asiste = "";

            if(rol.value == 1 || rol.value == 3) {
                asiste += `- <span class="text-primary">${noti.nombre}</span>`;
            }

            html += `
            <a href="javascript:void(0);" class="dropdown-item notify-item border-bottom" title="${noti.descripcion}">
                <div class="notify-icon bg-primary"><i class="uil uil-user-plus"></i></div>
                <p class="notify-details">${noti.descripcion}<small class="text-muted">${noti.fecha}</small>
                </p>

                <p class="notify-details">${noti.contacto} ${asiste}</p>
            </a>
            `;
        });

        lista.innerHTML = html;
    })
}


const cantidadNoti = document.getElementById('cantidadNoti');

console.log(cantidadNoti);

function iniciarParpadeo() {
  cantidadNoti.classList.add('parpadeo');
}

function detenerParpadeo() {
  cantidadNoti.classList.remove('parpadeo');
}

// Ejemplo: si el valor es mayor a 0, inicia el parpadeo
if (parseInt(cantidadNoti.innerText) > 0) {
    console.log(cantidadNoti.innerText)
  iniciarParpadeo();
}