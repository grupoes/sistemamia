const rol = document.getElementById('rol_user');
const iduser = document.getElementById('user_id');
const nameLogin = document.getElementById('nameLogin');
const token_ = localStorage.getItem('token');
const overlayLoader = document.querySelector('.overlay-loader');
console.log(overlayLoader)
let currentPath;
let menu;
window.addEventListener('load', (e) => {

    getDataToken(token_);

    //getNotificationNotContest(token_);
    
});

function getDataToken(token_) {
    fetch('/getData')
    .then(res => res.json())
    .then(data => {
        rol.value = data.rol;
        iduser.value = data.id;
        nameLogin.textContent = data.name;
        obtenerMenu(iduser.value);
    })
}

/*setInterval(() => {
    getNotificationNotContest(token_);
}, 30000);*/

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

salir.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('/logout', {
            method: 'GET',
            credentials: 'include', 
        });
        if (response.ok) {
            window.location = '/';
        } else {
            console.error('Error al cerrar sesión:', response.statusText);
            alert('No se pudo cerrar la sesión. Inténtalo de nuevo.');
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Ocurrió un error al cerrar la sesión.');
    }
});


setInterval(() => {
    notificacionesContacto(token_);
}, 40000);

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
            <a href="javascript:void(0);" onclick="chatDetail(${noti.numero}, '${noti.contacto}', '${noti.etiquetaName}', ${noti.potencial}, ${noti.etiqueta_id}, ${noti.role}, ${noti.user}, '${noti.nombre}')" class="dropdown-item notify-item border-bottom" title="${noti.descripcion}">
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

function iniciarParpadeo() {
  cantidadNoti.classList.add('parpadeo');
}

function detenerParpadeo() {
  cantidadNoti.classList.remove('parpadeo');
}

// Ejemplo: si el valor es mayor a 0, inicia el parpadeo
if (parseInt(cantidadNoti.innerText) > 0) {
    iniciarParpadeo();
}

function obtenerMenu(idusuario) {
    fetch(`/accesos/listar-modulos-por-perfiles/${idusuario}`)
        .then((res) => {
            if (!res.ok) {
                return res.json().then((data) => Promise.reject(data));
            }
            return res.json();
        })
        .then((data) => {
            menu = data.data;
            construirMenuDinamico();
            document.dispatchEvent(new Event("mainJsReady"));
        })
        .catch((error) => {
           console.log(error)
        });
}

function construirMenuDinamico() {
    const sideMenu = document.getElementById('side-menu');
    const modulosPadresOrdenados = [...menu].sort((a, b) => a.orden - b.orden);
    modulosPadresOrdenados.forEach(moduloPadre => {
        moduloPadre.modulos.sort((a, b) => a.orden - b.orden);
        const modulosHijos = moduloPadre.modulos.filter(modulo =>
            modulo.funciones.some(funcion => funcion.prefijo.includes('listar'))
        );
        if (modulosHijos.length === 0) {
            return;
        }
        const liPadre = document.createElement('li');
        liPadre.innerHTML = `
            <a href="#${moduloPadre.enlace}" data-bs-toggle="collapse">
                <i class="${moduloPadre.icono}"></i>
                <span> ${moduloPadre.nombre} </span>
                <span class="menu-arrow"></span>
            </a>
            <div class="collapse" id="${moduloPadre.enlace}">
                <ul class="nav-second-level"></ul>
            </div>
        `;
        const ulHijos = liPadre.querySelector('.nav-second-level');
        modulosHijos.forEach(modulo => {
            const liHijo = document.createElement('li');
            liHijo.innerHTML = `<a href="/${modulo.url}" class="protected-link">${modulo.nombre}</a>`;
            ulHijos.appendChild(liHijo);
        });
        sideMenu.appendChild(liPadre);
    });
    overlayLoader.classList.remove('show');
    document.getElementsByTagName('body')[0].style.overflow = '';
    establecerClasesActivas();
}

function establecerClasesActivas() {
    currentPath = window.location.pathname;
    const sideMenu = document.getElementById('side-menu');
    const menuItems = sideMenu.querySelectorAll('li');
    menuItems.forEach(li => {
        const link = li.querySelector('a[href]'); 
        if (link && link.getAttribute('href') === currentPath) {
            li.classList.add('menuitem-active');
            link.classList.add('active');
            let parent = li.closest('.collapse');
            while (parent) {
                parent.classList.add('show');
                const parentLi = parent.closest('li');
                if (parentLi) {
                    parentLi.classList.add('menuitem-active');
                }
                parent = parentLi ? parentLi.closest('.collapse') : null;
            }
        }
    });
}

