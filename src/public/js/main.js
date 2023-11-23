const rol = document.getElementById('rol_user');
const iduser = document.getElementById('user_id');
const nameLogin = document.getElementById('nameLogin');

window.addEventListener('load', (e) => {
    const token_ = localStorage.getItem('token');

    getDataToken(token_);

    setInterval(() => {
        getNotificationNotContest(token_);
    }, 300000);
    
    
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

