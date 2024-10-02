const urlchat = document.getElementById('chaturl');

var socket = io(urlchat.value);

const contactos = document.getElementById('contactos-whatsapp');

const cardBody = document.querySelector("#cardBody");

const token = localStorage.getItem('token');

const dominio = document.getElementById('dominio').value;

const filterEtiqueta = document.getElementById('filtroEtiqueta');
const plataforma_id = document.getElementById('plataforma_id');

const contentOffcanvas = document.getElementById('contentOffcanvas');
const contentModalReenvio = document.getElementById('contentModalReenvio');

function mostrar_chat(numero) {
    fetch('/messageNumber/' + numero)
        .then(res => res.json())
        .then(data => {
            let html = "";

            const datos = data.data;

            const conversation = document.getElementById('conversation-' + numero);

            if (!Array.isArray(datos)) {
                conversation.innerHTML = html;
            }

            datos.forEach(msj => {
                let fecha_y_hora = convertTimestampToDate(msj.timestamp);

                if (msj.from != '51938669769') {
                    switch (msj.typeMessage) {
                        case "text":
                            html += viewFromText(msj, fecha_y_hora);
                            break;
            
                        case "image":
                            html += viewFromImage(msj, fecha_y_hora);
                            break;
                        case "video":
                            html += viewFromVideo(msj, fecha_y_hora);
                            break;
                        case "document":
                            html += viewFromDocument(msj, fecha_y_hora);
                            break;
                        case "audio":
                            html += viewFromAudio(msj, fecha_y_hora);
                            break;
                        default:
                            break;
                    }


                } else {
                    console.log(msj.typeMessage);
                    switch (msj.typeMessage) {
                        case "text":
                            html += viewReceipText(msj, fecha_y_hora);
                            break;
            
                        case "image":
                            html += viewReceipImage(msj, fecha_y_hora);
                            break;
                        case "video":
                            html += viewReceipVideo(msj, fecha_y_hora);
                            break;
                        case "document":
                            html += viewReceipDocument(msj, fecha_y_hora);
                            break;
                        case "audio":
                            html += viewReceipAudio(msj, fecha_y_hora);
                            break;
                        default:
                            break;
                    }

                }
            });

            conversation.innerHTML = html;

            conversation.scrollTop = conversation.scrollHeight;

            grabarAudio();

            //loadContact();
        })
}

let listenerFile = false;

function fileWhatsapp() {
    document.getElementById("fileInput").setAttribute("accept", "image/*,video/*");
    document.getElementById("fileInput").click();

    const $offcanvas = $('#myOffcanvas').offcanvas({
        backdrop: true
    });

    if(!listenerFile) {
        fileInput.addEventListener('change', (e) => {
        
            $offcanvas.offcanvas('show');
    
            let file = e.target.files[0];
            console.log(file.type);
    
            if (file) {
                let reader = new FileReader();
    
                reader.onload = function (event) {
                    // Mostrar la vista previa de la imagen dentro del div
                    if (file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'image/gif' || file.type == 'image/webp' || file.type == 'image/svg+xml') {
                        $("#offcanvas-body").html('<img src="' + event.target.result + '" alt="Image Preview" style="max-width:100%; max-height: 300px;"> <input type="text" class="form-control" name="fileDescription" id="fileDescription" placeholder="Añade un comentario" style="margin-top: 15px" /> <input type="hidden" id="typeArchive" value="1" />');
                    }
    
                    if (file.type == 'video/mp4' || file.type === 'video/webm') {
                        $("#offcanvas-body").html('<video controls style="max-width:100%; max-height: 300px;"><source src="' + event.target.result + '" type="'+file.type+'">Your browser does not support the video tag.</video> <input type="text" class="form-control" name="fileDescription" id="fileDescription" placeholder="Añade un comentario" style="margin-top: 15px" /> <input type="hidden" id="typeArchive" value="2" />');
                    }
    
                }
    
                reader.readAsDataURL(file);
            }

            this.value = '';
        });

        listenerFile = true;
    }

}

let listenerAttached = false;

function documentoFile() {
    document.getElementById("fileInput").setAttribute("accept", ".pdf, .xls, .xlsx, .rar, .zip, .doc, .docx, .ppt, .pptx, .txt");
    document.getElementById("fileInput").click();

    const $offcanvas = $('#myOffcanvas').offcanvas({
        backdrop: true
    });

    if (!listenerAttached) {
        fileInput.addEventListener('change', (event) => {
        
            $offcanvas.offcanvas('show');
    
            let file = event.target.files[0];
            console.log(file);
    
            if (file) {
                let reader = new FileReader();
    
                reader.onload = function (event) {
                    // Mostrar la vista previa de la imagen dentro del div
                    const vista = `
                    <div class="p357zi0d gndfcl4n o4u7okr9 cl7oiv0o fbgy3m38 l9g3jx6n oq31bsqd lyvj5e2u ej3x2ktq"><div class="p357zi0d ggj6brxn m0h2a7mj rjo8vgbg f8m0rgwh gndfcl4n"><span class="f8jlpxt4 tl2vja3b">${file.name}</span></div></div>
                    <div class="card" style="width: 18rem;">
                        <div class="card-body text-center">
                        <svg viewBox="0 0 88 110" height="110" width="88" preserveAspectRatio="xMidYMid meet" class=""><defs><rect id="b" x="0" y="0" width="54" height="36" rx="2.37"></rect><path d="M3 0h56.928a5 5 0 0 1 3.536 1.464l15.072 15.072A5 5 0 0 1 80 20.07V101a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3z" id="a"></path></defs><g transform="translate(4 3)" fill="none" fill-rule="evenodd"><use fill="#000" filter="url(#filter-3)" xlink:href="#a"></use><use fill="#FFF" xlink:href="#a"></use><path stroke-opacity="0.08" stroke="#000" d="M3-.5h56.929a5.5 5.5 0 0 1 3.889 1.61l15.071 15.072a5.5 5.5 0 0 1 1.611 3.89V101a3.5 3.5 0 0 1-3.5 3.5H3A3.5 3.5 0 0 1-.5 101V3A3.5 3.5 0 0 1 3-.5z" fill="url(#linearGradient-1)"></path><rect fill-opacity="0.2" fill="#000" x="13" y="84" width="54" height="2" rx="0.5"></rect><rect fill-opacity="0.2" fill="#000" x="13" y="89" width="27" height="2" rx="0.5"></rect><rect fill-opacity="0.2" fill="#000" x="13" y="24" width="54" height="2" rx="0.5"></rect><rect fill-opacity="0.2" fill="#000" x="13" y="29" width="54" height="2" rx="0.5"></rect><rect fill-opacity="0.2" fill="#000" x="13" y="34" width="40" height="2" rx="0.5"></rect><g><g transform="translate(13 42)"><mask id="c" fill="#fff"><use xlink:href="#b"></use></mask><use fill-opacity="0.1" fill="#000" xlink:href="#b"></use><circle fill-opacity="0.1" fill="#000" mask="url(#c)" cx="37.5" cy="11.5" r="5.5"></circle><path d="m34.565 31.195 7.912-7.89a2.37 2.37 0 0 1 3.348 0l25.144 25.073L44.15 75.119l-19.556-19.5-11.259 11.228-26.817-26.742 25.143-25.072a2.37 2.37 0 0 1 3.348 0l16.208 16.162a2.37 2.37 0 0 0 3.347 0z" fill-opacity="0.1" fill="#000" mask="url(#c)"></path></g></g><path d="M61.5.5v15a3 3 0 0 0 3 3h15" stroke-opacity="0.12" stroke="#000" fill="#FFF"></path></g></svg>
                        <h5 class="card-title">No hay vista previa disponible</h5>
                        <!--<p class="card-text">18 MB - DOCX</p>-->
                        </div>
                    </div>
    
                    <input type="text" class="form-control" name="fileDescription" id="fileDescription" placeholder="Añade un comentario" style="margin-top: 15px" />
                    <input type="hidden" id="typeArchive" value="3" />
                    `;
                    $("#offcanvas-body").html(vista);
    
    
                }
    
                reader.readAsDataURL(file);
            }
    
            this.value = '';
        });

        listenerAttached = true;
    }
}


function convertTimestampToDate(timestamp) {
    const date = new Date(timestamp * 1000); // Multiplicamos por 1000 porque JavaScript usa milisegundos

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript van de 0 a 11
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

socket.on('audioReproducido', () => {
    // Obtener el elemento de audio
    const audioPlayer = document.getElementById('audioPlayer');

    audioPlayer.play().then(() => {
        // Reproducir el audio
        audioPlayer.play();
    }).catch((error) => {
        console.log(error);
    });
  
    
});

socket.on("messageStatus", data => {

    const icono = document.getElementById('chat-'+data.codigo);

    if(icono) {
        console.log("si existe el icono o el chat esta abierto");
        const iconoUpdate = socketStateMessage(data);

        icono.innerHTML = iconoUpdate;
    }

    const iconoList = document.getElementById('list-'+data.codigo);

    if (iconoList) {
        iconoList.removeAttribute('class');
        if(data.status === 'sent') {
            iconoList.classList.add('bi', 'bi-check', 'ms-1');
        } else {
            if (data.status === 'delivered') {
                iconoList.classList.add('bi', 'bi-check-all', 'ms-1');
            } else {
                if (data.status === 'read') {
                    iconoList.classList.add('bi', 'bi-check-all', 'ms-1', 'text-primary');
                } else {
                    iconoList.classList.add('bi', 'bi-exclamation-circle', 'ms-1', 'text-danger');
                }
            }
        }

    }

    /* socket.emit('getToken', { token: token, from: data.from, rol: rol.value, iduser: iduser.value, sonido: false, etiqueta: filterEtiqueta.value, plataforma_id: plataforma_id.value }); */

});

socket.on("messageContacts", data => {
    console.log("messageContacts");
    console.log(data);
    if(data.data.rol == 2 || data.data.rol == 6) {
        if(data.data.idAsistente == iduser.value) {
            viewItemContactList(data.data);
        }
    } else {
        if(data.data.rol == rol.value) {
            viewItemContactList(data.data);
        }
    }

});

function viewItemContactList(data) {
    
    let html = "";

    if(document.getElementById('item-contacto-'+data.numero)) {
        document.getElementById('item-contacto-'+data.numero).remove();
    }

    let dataMessage = data.message;

    let hourMessage = formatDate(dataMessage.timestamp);

        let countMessage = "";
        let asistente = "";

        if (data.cantidad > 0) {
            countMessage = `<span class="float-end badge bg-danger text-white" id="cantidad-message-${data.numero}">${data.cantidad}</span>`;
        }

        if(data.rol === 1 || data.rol === 3) {
            asistente = `<p style="margin: 0;font-size: 12px;color: dodgerblue;">${data.nameAsistente}</p>`;
        }

        let mensaje = ""

        if(dataMessage.typeMessage === 'text') {
            mensaje = dataMessage.message;
        }

        if (dataMessage.typeMessage === 'audio') {
            mensaje = `<i class="bi bi-headphones"></i> Audio`;
        }

        if (dataMessage.typeMessage === 'video') {
            mensaje = `<i class="bi bi-camera-video-fill"></i> Video`;
        }

        if (dataMessage.typeMessage === 'document') {
            mensaje = `<i class="bi bi-file-earmark-fill"></i> Archivo`;
        }

        if (dataMessage.typeMessage === 'image') {
            mensaje = `<i class="bi bi-image-fill"></i> Imagen`;
        }

        let checkMessage = "";

        if(data.statusMessage != '') {

            if(data.check == 1) {
                if(data.statusMessage == 'sent') {
                    checkMessage = `<i class="bi bi-check ms-1" id="list-${dataMessage.codigo}"  style="font-size: 16px"></i>`;
                } else {
                    if(data.statusMessage == 'delivered') {
                        checkMessage = `<i class="bi bi-check-all ms-1" id="list-${dataMessage.codigo}" style="font-size: 16px"></i>`;
                    } else {
                        if (data.statusMessage == 'read') {
                            checkMessage = `<i class="bi bi-check-all ms-1 text-primary" id="list-${dataMessage.codigo}" style="font-size: 16px"></i>`;
                        } else {
                            checkMessage = `<i class="bi bi-exclamation-circle ms-1 text-danger" id="list-${dataMessage.codigo}" style="font-size: 16px"></i>`;
                        }
                    }
                }

            }


        }

        let itemDelete = "";
        let seguimiento = "";


        if(data.rol == 1 || data.rol == 3) {
            itemDelete += `
            <div class="dropdown-divider"></div>
            <!-- item-->
            <a href="javascript:void(0);" class="dropdown-item text-danger" onclick="deleteContacto('${data.numero}')">
                <i class="uil uil-trash me-2"></i>Eliminar
            </a>
            `;

            seguimiento += `
            <a href="javascript:void(0);" class="dropdown-item">
                <i class="uil uil-exit me-2"></i>Seguimiento
            </a>`;
        }

        let nameContact = data.nameContacto;
        nameContact = nameContact.replace("'", "");

        html += `
        <div class="d-flex border-top pt-2" id="item-contacto-${data.numero}">
            <img src="img/logos/icon.png" class="avatar rounded me-1" alt="shreyu">
            <div class="flex-grow-1" style="cursor: pointer" onclick="chatDetail('${data.numero}','${nameContact}', '${data.etiqueta}', ${data.potencial_id}, ${data.etiqueta_id}, ${data.rol}, ${data.idAsistente}, '${data.nameAsistente}')">
                ${asistente}
                <h5 class="mt-1 mb-0 fs-15">${nameContact} <span class="float-end text-muted fs-12">${hourMessage}</span></h5>
                <h6 class="text-muted fw-normal mt-1 mb-2">
                    <span style="display: inline-block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width: 160px;">${checkMessage}${mensaje}</span>
                    ${countMessage}
                </h6>
            </div>
            <div class="dropdown align-self-center float-end">
                <a href="#" class="dropdown-toggle arrow-none text-muted" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="uil uil-angle-down" style="font-size: 20px"></i>
                </a>
                <div class="dropdown-menu dropdown-menu-end">
                    <!-- item-->
                    <a href="javascript:void(0);" class="dropdown-item">
                        <i class="uil uil-edit-alt me-2"></i>Editar Contacto
                    </a>
                    <!-- item-->
                    <a href="javascript:void(0);" class="dropdown-item">
                        <i class="uil uil-exit me-2"></i>Fijar Chat
                    </a>

                    <a href="javascript:void(0);" class="dropdown-item">
                        <i class="uil uil-exit me-2"></i>Seguimiento
                    </a>

                    <a href="javascript:void(0);" class="dropdown-item">
                        <i class="uil uil-comment-alt-edit me-2"></i>Editar Etiqueta
                    </a>
                    ${itemDelete}
                </div>
            </div>
        </div>
        `;

    $("#contactos-whatsapp").prepend(html);
}


filterEtiqueta.addEventListener('change', (e) => {
    renderChatContactos();
});

plataforma_id.addEventListener('change', (e) => {
    renderChatContactos();
});

function loadContact() {

    contactos.innerHTML = '<p class="text-center text-primary">Cargando...</p>';

    const post = {
        etiqueta: filterEtiqueta.value,
        plataforma_id: plataforma_id.value
    };

    fetch("/numeroWhatsapp", {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(post)
    })
        .then(res => res.json())
        .then(data => {
            viewContact(data);
        })
}

//aca la nueva funcion para cargar el chat de los contactos
renderChatContactos();

function renderChatContactos() {
    contactos.innerHTML = '<p class="text-center text-primary">Cargando...</p>';

    const etiqueta = filterEtiqueta.value;
    const plataforma = plataforma_id.value;

    fetch("/lista-chat/"+etiqueta+"/"+plataforma, {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
    })
    .then(res => res.json())
    .then(data => {
        const html = viewListChatContact(data.data, 1);
        contactos.innerHTML = html;
    })
    
}

function viewListChatContact(data, tipo) {
    let html = "";
    data.forEach(contact => {
        let hourMessage = formatDate(contact.ultimo_timestamp);

        let countMessage = "";
        let asistente = "";

        if (contact.total_mensajes_sent > 0) {
            countMessage = `<span class="float-end badge bg-danger text-white" id="cantidad-message-${contact.contacto}">${contact.total_mensajes_sent}</span>`;
        }

        if(rol.value === "1" || rol.value === "3") {
            asistente = `<p style="margin: 0;font-size: 12px;color: dodgerblue;">${contact.asistente}</p>`;
        }

        let checkMessage = "";

        if(contact.estadoMensaje) {
            if(contact.estadoMensaje == 'sent') {
                checkMessage = `<i class="bi bi-check ms-1" id="list-${contact.codigo}" style="font-size: 16px"></i>`;
            } else {
                if(contact.estadoMensaje == 'delivered') {
                    checkMessage = `<i class="bi bi-check-all ms-1" id="list-${contact.codigo}" style="font-size: 16px"></i>`;
                } else {
                    if (contact.estadoMensaje == 'read') {
                        checkMessage = `<i class="bi bi-check-all ms-1 text-primary" id="list-${contact.codigo}" style="font-size: 16px"></i>`;
                    } else {
                        checkMessage = `<i class="bi bi-exclamation-circle ms-1 text-danger" id="list-${contact.codigo}" style="font-size: 16px"></i>`;
                    }
                }
            }

        }

        let mensaje = ""

        if(contact.typemessage === 'text') {
            mensaje = contact.ultimo_mensaje;
        }

        if (contact.typemessage === 'audio') {
            mensaje = `<i class="bi bi-headphones"></i> Audio`;
        }

        if (contact.typemessage === 'video') {
            mensaje = `<i class="bi bi-camera-video-fill"></i> Video`;
        }

        if (contact.typemessage === 'document') {
            mensaje = `<i class="bi bi-file-earmark-fill"></i> Archivo`;
        }

        if (contact.typemessage === 'image') {
            mensaje = `<i class="bi bi-image-fill"></i> Imagen`;
        }

        let itemDelete = "";

        if(rol.value === "1" || rol.value === "3") {
            itemDelete += `
            <div class="dropdown-divider"></div>
            <!-- item-->
            <a href="javascript:void(0);" class="dropdown-item text-danger" onclick="deleteContacto('${contact.contacto}')">
                <i class="uil uil-trash me-2"></i>Eliminar
            </a>
            `;
        }

        let opciones = "";

        if(tipo === 1) {
            opciones = `
            <div class="dropdown align-self-center float-end">
                <a href="#" class="dropdown-toggle arrow-none text-muted" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="uil uil-angle-down" style="font-size: 20px"></i>
                </a>
                <div class="dropdown-menu dropdown-menu-end">
                    <!-- item-->
                    <a href="javascript:void(0);" class="dropdown-item">
                        <i class="uil uil-exit me-2"></i>Fijar Chat
                    </a>

                    <a href="javascript:void(0);" class="dropdown-item" onclick="modalSeguimiento(${contact.contacto}, '${contact.nombre_contacto}')">
                        <i class="uil uil-exit me-2"></i>Seguimiento
                    </a>
                    ${itemDelete}
                </div>
            </div>
            `;
        }

        html += `
        <div class="d-flex border-top pt-2" id="item-contacto-${contact.contacto}">
            <img src="img/logos/icon.png" class="avatar rounded me-1" alt="shreyu">
            <div class="flex-grow-1" style="cursor: pointer" onclick="chatDetail(${contact.contacto})">
                ${asistente}
                <h5 class="mt-1 mb-0 fs-15">${contact.nombre_contacto} <span class="float-end text-muted fs-12">${hourMessage}</span></h5>
                <h6 class="text-muted fw-normal mt-1 mb-2">
                    <span style="display: inline-block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width: 160px;" title='${contact.ultimo_mensaje}'>${checkMessage}${mensaje}</span>
                    ${countMessage}
                </h6>
            </div>
            ${opciones}
        </div>
        `;
    });

    return html;
}

function viewContact(data) {
    let html = "";
    const datos = data.data;
    const rol = data.rol;

    datos.forEach(contact => {
        let hourMessage = formatDate(contact.time);

        let countMessage = "";
        let asistente = "";

        if (contact.cantidad > 0) {
            countMessage = `<span class="float-end badge bg-danger text-white" id="cantidad-message-${contact.numero}">${contact.cantidad}</span>`;
        }

        if(contact.rol === 1 || contact.rol === 3) {
            asistente = `<p style="margin: 0;font-size: 12px;color: dodgerblue;">${contact.asistente}</p>`;
        }

        let mensaje = ""

        if(contact.type === 'text') {
            mensaje = contact.mensaje;
        }

        if (contact.type === 'audio') {
            mensaje = `<i class="bi bi-headphones"></i> Audio`;
        }

        if (contact.type === 'video') {
            mensaje = `<i class="bi bi-camera-video-fill"></i> Video`;
        }

        if (contact.type === 'document') {
            mensaje = `<i class="bi bi-file-earmark-fill"></i> Archivo`;
        }

        if (contact.type === 'image') {
            mensaje = `<i class="bi bi-image-fill"></i> Imagen`;
        }

        let checkMessage = "";

        if(contact.statusMessage != '') {

            if(contact.statusMessage == 'sent') {
                checkMessage = `<i class="bi bi-check ms-1" id="list-${contact.codigo}" style="font-size: 16px"></i>`;
            } else {
                if(contact.statusMessage == 'delivered') {
                    checkMessage = `<i class="bi bi-check-all ms-1" id="list-${contact.codigo}" style="font-size: 16px"></i>`;
                } else {
                    if (contact.statusMessage == 'read') {
                        checkMessage = `<i class="bi bi-check-all ms-1 text-primary" id="list-${contact.codigo}" style="font-size: 16px"></i>`;
                    } else {
                        checkMessage = `<i class="bi bi-exclamation-circle ms-1 text-danger" id="list-${contact.codigo}" style="font-size: 16px"></i>`;
                    }
                }
            }

        }

        let itemDelete = "";
        let seguimiento = "";

        let nameContact = contact.contact;
        nameContact = nameContact.replace("'", "");


        if(rol == 1 || rol == 3) {
            itemDelete += `
            <div class="dropdown-divider"></div>
            <!-- item-->
            <a href="javascript:void(0);" class="dropdown-item text-danger" onclick="deleteContacto('${contact.numero}')">
                <i class="uil uil-trash me-2"></i>Eliminar
            </a>
            `;
        }

        html += `
        <div class="d-flex border-top pt-2" id="item-contacto-${contact.numero}">
            <img src="img/logos/icon.png" class="avatar rounded me-1" alt="shreyu">
            <div class="flex-grow-1" style="cursor: pointer" onclick="chatDetail('${contact.numero}','${nameContact}', '${contact.etiqueta}', ${contact.potencial_id}, ${contact.etiqueta_id}, ${rol}, ${contact.idAsistente}, '${contact.asistente}')">
                ${asistente}
                <h5 class="mt-1 mb-0 fs-15">${contact.contact} <span class="float-end text-muted fs-12">${hourMessage}</span></h5>
                <h6 class="text-muted fw-normal mt-1 mb-2">
                    <span style="display: inline-block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width: 160px;">${checkMessage}${mensaje}</span>
                    ${countMessage}
                </h6>
            </div>
            <div class="dropdown align-self-center float-end">
                <a href="#" class="dropdown-toggle arrow-none text-muted" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="uil uil-angle-down" style="font-size: 20px"></i>
                </a>
                <div class="dropdown-menu dropdown-menu-end">
                    <!-- item-->
                    <a href="javascript:void(0);" class="dropdown-item">
                        <i class="uil uil-edit-alt me-2"></i>Editar Contacto
                    </a>
                    <!-- item-->
                    <a href="javascript:void(0);" class="dropdown-item">
                        <i class="uil uil-exit me-2"></i>Fijar Chat
                    </a>

                    <a href="javascript:void(0);" class="dropdown-item" onclick="modalSeguimiento('${contact.numero}', '${nameContact}')">
                        <i class="uil uil-exit me-2"></i>Seguimiento
                    </a>

                    <a href="javascript:void(0);" class="dropdown-item">
                        <i class="uil uil-comment-alt-edit me-2"></i>Editar Etiqueta
                    </a>
                    ${itemDelete}
                </div>
            </div>
        </div>
        `;
    });

    contactos.innerHTML = html;
}

//loadContact();

function formatDate(timestamp) {
    var now = new Date();
    var date = new Date(timestamp * 1000); // Convierte el timestamp a milisegundos
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;

    if (now.getDate() === day && now.getMonth() + 1 === month && now.getFullYear() === year) {
        return strTime;
    } else if (now.getDate() - 1 === day && now.getMonth() + 1 === month && now.getFullYear() === year) {
        return "ayer";
    } else {
        return day + '/' + month + '/' + year;
    }
}

// #e7e4e4

function chatPrincipalView() {
    cardBody.innerHTML = `<div class="d-flex align-items-center justify-content-center" style="height: 580px;">
        <img src="/img/logos/logo_color.png" alt="example image" style="width: 40%;">
    </div>`;
}

chatPrincipalView();

function chatDetail(numero) {

    if(document.getElementById('cantidad-message-'+numero)) {
        socket.emit( 'updateQuantyMessage', { numero: numero } );
    }

    fetch('/getContactoData/'+numero, {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
    })
    .then(res => res.json())
    .then(data => {

        let asignar = "";
        let asist = "";
        let seguimiento = "";

        const datos = data.data;

        console.log(datos);

        if(data.rol === 1 || data.rol === 3) {
            asignar = `<a class="dropdown-item" href="javascript: void(0);" onclick="asignarChat(${datos.potencialcliente}, ${datos.id})"><i
            class="bi bi-search fs-18 me-2" ></i>Asignar</a>`;
            asist = `<span class="text-primary">${datos.asistente}</span>`;
        }

        let html = `
        <div class="d-flex pb-2 border-bottom align-items-center">
            <img src="img/logos/icon.png" class="me-2 rounded-circle" height="48" alt="Cliente" />
            <div>
                <h5 class="mt-0 mb-0 fs-14" id="nameContacto">${datos.nameContact}</h5>
                <p class="mb-0" id="numberWhatsapp">${datos.from}</p>
                ${asist}
                <input type="hidden" id="whatsappNumber" value="${datos.from}">
                <input type="hidden" id="potencialId" value="${datos.potencialCliente}">
            </div>
            <div class="flex-grow-1">
                <ul class="list-inline float-end mb-0">
                    <li class="list-inline-item fs-18 me-3 dropdown">
                        <span class="badge badge-soft-success py-1" id="etiquetaTitle">${datos.descripcion}</span>
                    </li>
                    <li class="list-inline-item fs-18 me-3 dropdown">
                        <a href="javascript: void(0);" class="text-dark" data-bs-toggle="modal" data-bs-target="#voicecall">
                            <i class="bi bi-telephone-plus"></i>
                        </a>
                    </li>
                    <li class="list-inline-item fs-18 me-3 dropdown">
                        <a href="javascript: void(0);" class="text-dark" data-bs-toggle="modal" data-bs-target="#videocall">
                            <i class="bi bi-camera-video"></i>
                        </a>
                    </li>
                    <li class="list-inline-item fs-18 dropdown">
                        <a href="javascript: void(0);" class="dropdown-toggle text-dark" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            <i class="bi bi-three-dots-vertical"></i>
                        </a>
                        <div class="dropdown-menu dropdown-menu-end">
                            <a class="dropdown-item" href="javascript: void(0);" onclick="viewProfle()">
                                <i class="bi bi-person-circle fs-18 me-2"></i>Ver Contacto
                            </a>
                            <a class="dropdown-item" href="javascript: void(0);" onclick="editContact()">
                                <i class="bi bi-person-check fs-18 me-2"></i>Editar Contacto
                            </a>
                            <a class="dropdown-item" href="javascript: void(0);" onclick="etiquetaCliente(${datos.potencialcliente}, ${datos.etiqueta})"><i
                                    class="bi bi-music-note-list fs-18 me-2"></i>Etiqueta</a>
                            ${asignar}

                            <a class="dropdown-item" href="javascript: void(0);" onclick="modalSeguimiento('${datos.from}', '${datos.nameContact}')"><i class="bi bi-arrow-bar-right fs-18 me-2" ></i>Seguimiento</a>

                            <a class="dropdown-item" href="javascript: void(0);" onclick="modalEnvioPdf('${datos.from}')"><i class="bi bi-file-earmark-pdf-fill fs-18 me-2" ></i>Enviar Pdf</a>
                            
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="mt-1" id="contentChat">
            <ul class="conversation-list px-0 h-100" data-simplebar
                style="min-height: 405px; max-height: 405px; overflow: hidden scroll;" id="conversation-${datos.from}">


            </ul>
            
            <div class="mt-2 bg-light p-3 rounded" style="position: relative">

                <div id="emojis" style="display: none;">
                    <button type="button" class="btn-close position-absolute top-0 end-0 m-2" onclick="cerrar_ventana_emojis()"></button>
                    <div class="card-body p-0" style="height: 130px; overflow-x: scroll; margin-top: 7px" >
                        
                        <div id="list-emojis">
                            
                        </div>
                    </div>
                </div>

                <form class="needs-validation" novalidate="" name="chat-form" id="chat-form" method="post" onsubmit="envioFormulario(event)">
                    <input type="hidden" name="numberWhat" value="${datos.from}">
                    <div id="responderMessage">
                        
                    </div>
                    <div class="row">
                        <div class="col mb-2 mb-sm-0">
                            <!--<input type="text" class="form-control border-0" name="mensaje_form"
                                placeholder="Ingrese el mensaje" required="" id="contentMensaje">-->
                            <textarea class="form-control" rows="1" id="contentMensaje" name="mensaje_form" required="" style="resize: none;" placeholder="Ingrese el mensaje" oninput="detectarAltoInputMensaje(this)" onkeydown="detectarEnterEnElTextArea(event, this)" onpaste="pegarImagenInput(event)" spellcheck="true"></textarea>
                            <ul id="listaSugerencias"></ul>
                            <div class="" id="horas_transcurridas" style="display:none; text-align:center;">
                                <span class="hora-estilo">01:45:30 H </span>
                            </div>
                        </div>
                        <div class="col-sm-auto">
                            <div class="btn-group">
                                <a href="#" class="btn btn-light" onclick="allEmojis(event)"><i class="bi bi-emoji-smile fs-18"></i></a>
                                <input type="file" id="fileInput" style="display: none;" />
                                <audio id="audio" controls="" style="display: none"></audio>
                                <button type="button" class="btn btn-primary" id="sendAudio" style="display: none">ok</button>
                                <div class="dropdown" style="padding: 7px;">
                                    <a href="#" class="dropdown-toggle arrow-none text-muted" data-bs-toggle="dropdown" aria-expanded="true">
                                        <i class="uil uil-ellipsis-v"></i>
                                    </a>
                                    <div class="dropdown-menu dropdown-menu-end" data-popper-placement="bottom-end" style="position: absolute; inset: 0px auto auto 0px; margin: 0px; transform: translate(-143px, 21px);">
                                        <!-- item-->
                                        <a href="javascript:void(0);" class="dropdown-item" onclick="fileWhatsapp()">
                                            <i class="uil-image-upload me-2"></i>fotos y videos
                                        </a>
                                        <!-- item-->
                                        <a href="javascript:void(0);" class="dropdown-item" onclick="documentoFile()">
                                            <i class="uil-file-upload-alt me-2"></i>Documento
                                        </a>
                                        <a href="javascript:void(0);" class="dropdown-item" onclick="plantillaGet()">
                                            <i class="uil-file-landscape-alt me-2"></i>Plantilla
                                        </a>
                                    </div>
                                </div>
                                <a href="#" class="btn btn-light" id="btnAudio"><i class="bi bi-mic-fill fs-18"></i></a>
                                <div class="d-grid">
                                    <button type="submit" class="btn btn-success chat-send" id="sendChat"><i
                                            class='uil uil-message'></i></button>
                                </div>
                            
                        </div>
                    </div>
                </form>
            </div>

            
        </div>
        `;

        cardBody.innerHTML = html;

        mostrar_chat(numero);

        detectarScrollChat(numero);
    });

}

function chatMessage(numero) {
    fetch("/messageNumber/" + numero)
        .then(res => res.json())
        .then(data => {
            console.log(data);
        })
}

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        chatPrincipalView();
    }
});

socket.on("messageChat", data => {
    console.log(data);
    console.log('messageChat');

    /*const audio = new Audio('./audios/whatsapp/whatsapp-campana.mp3');
    audio.volume = 0.5;
    audio.play();*/

    const datos = data.data_chat;
    const message = data.new_message;

    socket.emit('getToken', { token: token, from: datos.from, rol: rol.value, iduser: iduser.value, sonido: true, etiqueta: filterEtiqueta.value, plataforma_id: plataforma_id.value, new_message: message });

    let fecha_y_hora = convertTimestampToDate(datos.timestamp);

    if (datos.from != '51938669769') {
        switch (datos.typeMessage) {
            case "text":
                let text = viewFromText(datos, fecha_y_hora);
                const lista = $("#conversation-" + datos.from);
                lista.append(text);
                break;

            case "image":
                let image = viewFromImage(datos, fecha_y_hora);
                const listaImage = $("#conversation-" + datos.from);
                listaImage.append(image);
                break;
            case "video":
                let video = viewFromVideo(datos, fecha_y_hora);
                const listaVideo = $("#conversation-" + datos.from);
                listaVideo.append(video);
                break;
            case "document":
                let document = viewFromDocument(datos, fecha_y_hora);
                const listaDocument = $("#conversation-" + datos.from);
                listaDocument.append(document);
                break;
            case "audio":
                let audio = viewFromAudio(datos, fecha_y_hora);
                const listaAudio = $("#conversation-" + datos.from);
                listaAudio.append(audio);
                break;
            default:
                break;
        }
    } else {
        switch (datos.typeMessage) {
            case "text":
                let text = viewReceipText(datos, fecha_y_hora);
                const lista = $("#conversation-" + datos.receipt);
                lista.append(text);
                break;

            case "image":
                let image = viewReceipImage(datos, fecha_y_hora);
                const listaImage = $("#conversation-" + datos.receipt);
                listaImage.append(image);
                break;
            case "video":
                let videoRec = viewReceipVideo(datos, fecha_y_hora);
                const listaVideo = $("#conversation-" + datos.receipt);
                listaVideo.append(videoRec);
                break;
            case "document":
                let documentRec = viewReceipDocument(datos, fecha_y_hora);
                const listaDoc = $("#conversation-" + datos.receipt);
                listaDoc.append(documentRec);
                break;
            case "audio":
                let audioRec = viewReceipAudio(datos, fecha_y_hora);
                const listaAudio = $("#conversation-" + datos.receipt);
                listaAudio.append(audioRec);
                break;
            default:
                break;
        }
    }

});

function viewFromText(data, hora) {

    let responseData = "";

    if(data.mensajeRelacionado) {

        if(data.mensajeRelacionado.typeMessage === 'text') {
            responseData = mensajeRespondidoFromText(data.mensajeRelacionado);
        }

        if(data.mensajeRelacionado.typeMessage === 'image') {
            responseData = mensajeRespondidoFromImagen(data.mensajeRelacionado);
        }

        if(data.mensajeRelacionado.typeMessage === 'audio') {
            responseData = mensajeRespondidoFromAudio(data.mensajeRelacionado);
        }

        if(data.mensajeRelacionado.typeMessage === 'video') {
            responseData = mensajeRespondidoFromVideo(data.mensajeRelacionado);
        }

        if(data.mensajeRelacionado.typeMessage === 'document') {
            responseData = mensajeRespondidoFromDocument(data.mensajeRelacionado);
        }
    }

    let messageReceipt = data.message;

    messageReceipt = messageReceipt.replace(/\r\n|\n/g, "<br>");

    let publicidad = "";

    if(data.media_type != "" && data.media_type != null) {

        let icono_video = "";

        if(data.media_type === 'video') {
            icono_video = `
            <!-- Icono de reproductor -->
            <a href="${data.media_url}" target="_blank" class="play-icon">
                <i class="bi bi-play-circle-fill" style="font-size: 30px"></i>  
            </a>
            `;
        }

        publicidad = `
        <div class="card">
            <div class="row g-0 align-items-center">
                <div class="col-md-2 relative-position">
                    <img src="${data.thumbnail_url}" class="card-img" alt="...">

                    ${icono_video}
                </div>
                <div class="col-md-10">
                    <div class="card-body">
                        <h6 class="card-title fs-16">${data.headline}</h6>
                        <p class="card-text text-muted">
                            ${data.body}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    let html = `
        <li class="clearfix">
            <div class="conversation-text ms-0">
                <div class="d-flex">
                    
                    <div class="ctext-wrap" style="padding: 0;">
                        ${publicidad}
                        ${responseData}
                        <p id="${data.codigo}" style="padding: 5px 10px 5px 10px;">${messageReceipt}</p>                                
                    </div>                                                                    
                    <div class="conversation-actions dropdown dropend">
                        <a href="javascript: void(0);" class="text-dark ps-1" data-bs-toggle="dropdown" aria-expanded="false"><i class='bi bi-three-dots-vertical fs-14'></i></a>                
                        <div class="dropdown-menu">
                            <a class="dropdown-item" href="#" onclick="responderFrom(event, '${data.codigo}')">
                                <i class="bi bi-reply fs-18 me-2"></i>Responder
                            </a>   
                            <a class="dropdown-item" href="#">
                                <i class="bi bi-star fs-18 me-2"></i>Starred
                            </a>   
                            <a class="dropdown-item" href="#">
                                <i class="bi bi-trash fs-18 me-2"></i>Eliminar
                            </a>   
                            <a class="dropdown-item" href="#">
                                <i class="bi bi-files fs-18 me-2"></i>Copy
                            </a>                                                                            
                        </div>
                    </div>
                </div>                                                                
                <p class="text-muted fs-12 mb-0 mt-1">${hora}</p>
            </div>                                                            
        </li>`;

    return html;

}

function viewFromImage(data, hora) {
    let html = `
            <li class="clearfix">
                <div class="conversation-text ms-0">
                    <div class="d-flex">
                        <div class="card mb-1 shadow-none border text-start ctext-wrap">
                            <div class="p-2">
                                <div class="row align-items-center">
                                    <div class="col-auto">
                                        <img src="${dominio}/img/archivos/${data.id_document}.jpg" alt="" height="150" style="width: 100%;" onclick="openFullscreen(this)">
                                        <p style="margin-top: 5px">${data.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="conversation-actions dropdown dropend">
                            <a href="javascript: void(0);" class="text-dark ps-1" data-bs-toggle="dropdown"
                                                aria-expanded="false"><i class='bi bi-three-dots-vertical fs-14'></i></a>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="#" onclick="descargarImagen('${dominio}/img/archivos/${data.id_document}.jpg', '${data.id_document}.jpg')">
                                    <i class="bi bi-download fs-18 me-2"></i>Descargar
                                </a>
                                <a class="dropdown-item" href="#" onclick="responderFrom(event, '${data.codigo}')">
                                    <i class="bi bi-reply fs-18 me-2"></i>Responder
                                </a>
                                <a class="dropdown-item" href="#">
                                    <i class="bi bi-trash fs-18 me-2"></i>Delete
                                </a>
                                <a class="dropdown-item" href="#">
                                    <i class="bi bi-files fs-18 me-2"></i>Copy
                                </a>
                            </div>
                        </div>
                    </div>
                    <p class="text-muted fs-12 mb-0 mt-1">${hora}</p>
                </div>
            </li>`;

        return html;
}

function viewFromVideo(data, fecha) {
    let html = `
            <li class="clearfix">
                <div class="conversation-text ms-0">
                    <div class="d-flex">
                        <div class="card mb-1 shadow-none border text-start ctext-wrap">
                            <div class="p-2">
                                <div class="row align-items-center">
                                    <div class="col-auto">

                                        <video width="320" height="240" controls>
                                            <source src="${dominio}/videos/archivos/${data.id_document}.mp4" type="video/mp4">
                                            Tu navegador no soporta la etiqueta de video.
                                        </video>

                                        <p style="margin-top: 5px">${data.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="conversation-actions dropdown dropend">
                            <a href="javascript: void(0);" class="text-dark ps-1" data-bs-toggle="dropdown"
                                                aria-expanded="false"><i class='bi bi-three-dots-vertical fs-14'></i></a>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="#" onclick="descargarImagen('${dominio}/videos/archivos/${data.id_document}.mp4', '${data.id_document}.mp4')">
                                    <i class="bi bi-download fs-18 me-2"></i>Descargar
                                </a>
                                <a class="dropdown-item" href="#">
                                    <i class="bi bi-star fs-18 me-2"></i>Starred
                                </a>
                                <a class="dropdown-item" href="#">
                                    <i class="bi bi-trash fs-18 me-2"></i>Delete
                                </a>
                                <a class="dropdown-item" href="#">
                                    <i class="bi bi-files fs-18 me-2"></i>Copy
                                </a>
                            </div>
                        </div>
                    </div>
                    <p class="text-muted fs-12 mb-0 mt-1">${fecha}</p>
                </div>
            </li>`;

        return html;
}

function viewFromAudio(data, fecha) {
    let html = `
            <li class="clearfix">
                <div class="conversation-text ms-0">
                    <div class="d-flex">
                        <div class="card mb-1 shadow-none border text-start ctext-wrap">
                            <div class="p-2">
                                <div class="row align-items-center">
                                    <div class="col-auto">

                                        <audio controls id="${data.codigo}">
                                            <source src="${dominio}/audios/archivos/${data.id_document}.ogg" type="audio/ogg">
                                            Tu navegador no soporta la etiqueta de audio.
                                        </audio>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="conversation-actions dropdown dropend">
                            <a href="javascript: void(0);" class="text-dark ps-1" data-bs-toggle="dropdown"
                                                aria-expanded="false"><i class='bi bi-three-dots-vertical fs-14'></i></a>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="#" onclick="descargarImagen('${dominio}/audios/archivos/${data.id_document}.ogg', '${data.id_document}.ogg')">
                                    <i class="bi bi-download fs-18 me-2"></i>Descargar
                                </a>
                                <a class="dropdown-item" href="#" onclick="responderFrom(event, '${data.codigo}')">
                                    <i class="bi bi-reply fs-18 me-2"></i>responder
                                </a>
                                <a class="dropdown-item" href="#" onclick="reenviarMensaje(event, '${data.codigo}', 0)">
                                    <i class="bi bi-reply-all fs-18 me-2"></i>Reenviar
                                </a>
                                <a class="dropdown-item" href="#">
                                    <i class="bi bi-files fs-18 me-2"></i>Copy
                                </a>
                            </div>
                        </div>
                    </div>
                    <p class="text-muted fs-12 mb-0 mt-1">${fecha}</p>
                </div>
            </li>`;

        return html;
}

function viewFromDocument(data, fecha) {
    let html = `
    <li class="clearfix">
        <div class="conversation-text ms-0">
            <div class="d-flex">
                <div class="card mb-1 shadow-none border text-start">
                    <div class="p-2">
                        <div class="row align-items-center">
                            <!--<div class="col-auto">
                                <div class="avatar-sm bg-primary text-white">
                                    <span class="avatar-title rounded">.ZIP</span>
                                </div>
                            </div>-->
                            <div class="col ps-0">
                                <a href="javascript:void(0);" class="text-muted fw-bold">${data.filename}</a>
                                <p style="margin-top: 5px">${data.description}</p>
                                <!--<p class="mb-0">2.3 MB</p>-->
                            </div>
                            <div class="col-auto">
                                <a href="javascript:void(0);" class="ps-3 fs-24">
                                    <i class="bi bi-arrow-down-square"></i>    
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="conversation-actions dropdown dropend">
                    <a href="javascript: void(0);" class="text-dark ps-1" data-bs-toggle="dropdown" aria-expanded="false"><i class='bi bi-three-dots-vertical fs-14'></i></a>                
                    <div class="dropdown-menu">
                        <a class="dropdown-item" href="#" onclick="descargarImagen('${dominio}/documentos/archivos/${data.filename}', '${data.filename}')">
                            <i class="bi bi-download fs-18 me-2"></i>Descargar
                        </a>   
                        <a class="dropdown-item" href="#">
                            <i class="bi bi-star fs-18 me-2"></i>Starred
                        </a>   
                        <a class="dropdown-item" href="#">
                            <i class="bi bi-trash fs-18 me-2"></i>Delete
                        </a>   
                        <a class="dropdown-item" href="#">
                            <i class="bi bi-files fs-18 me-2"></i>Copy
                        </a>                                                                            
                    </div>
                </div>
            </div>
            <p class="text-muted fs-12 mb-0 mt-1">${fecha}</p>
        </div>
    </li>
    `;

    return html;
}

function viewReceipText(data, fecha) {

    const iconoStatus = checkStateMessage(data);
    
    let resp = "";

    if (data.mensajeRelacionado) {

        if(data.mensajeRelacionado.typeMessage === 'text') {
            resp = mensajeRespondidoReceipText(data.mensajeRelacionado);
        }
        
        if(data.mensajeRelacionado.typeMessage === 'image') {
            resp = mensajeRespondidoReceipImagen(data.mensajeRelacionado);
        }

        if(data.mensajeRelacionado.typeMessage === 'audio') {
            resp = mensajeRespondidoReceipAudio(data.mensajeRelacionado);
        }
    } else {
        
    }

    let messageReceipt = data.message;

    messageReceipt = messageReceipt.replace(/\r\n|\n/g, "<br>");

    let html = `
        <li class="clearfix odd">
            <div class="conversation-text ms-0">
                <div class="d-flex justify-content-end">
                    <div class="conversation-actions dropdown dropstart">
                        <a href="javascript: void(0);" class="text-dark pe-1" data-bs-toggle="dropdown" aria-expanded="false"><i class='bi bi-three-dots-vertical fs-14'></i></a>                
                        <div class="dropdown-menu">
                            <a class="dropdown-item" href="#" onclick="responderFrom(event, '${data.codigo}')">
                                <i class="bi bi-reply fs-18 me-2"></i>Responder
                            </a>   
                            <a class="dropdown-item" href="#">
                                <i class="bi bi-star fs-18 me-2"></i>Starred
                            </a>   
                            <a class="dropdown-item" href="#">
                                <i class="bi bi-trash fs-18 me-2"></i>Eliminar
                            </a>   
                            <a class="dropdown-item" href="#">
                                <i class="bi bi-files fs-18 me-2"></i>Copy
                            </a>                                                                            
                        </div>
                    </div>  
                    <div class="ctext-wrap">
                        ${resp}
                        <p id="${data.codigo}" style="text-align: left;">${messageReceipt}</p>
                    </div>  
                </div>                                                          
                <p class="text-muted fs-12 mb-0 mt-1">${fecha}<span id="chat-${data.codigo}">${iconoStatus}</span></p>
            </div>
        </li>`;

    return html;
}

function viewReceipImage(data, fecha) {

    const iconoStatus = checkStateMessage(data);

    let resp = "";

    if (data.mensajeRelacionado) {
        resp = mensajeRespondidoReceipImagen(data.mensajeRelacionado);
    }

    let html = `
            <li class="clearfix odd">
                <div class="conversation-text ms-0">
                    <div class="d-flex justify-content-end">
                        <div class="conversation-actions dropdown dropstart">
                            <a href="javascript: void(0);" class="text-dark ps-1" data-bs-toggle="dropdown"
                                                aria-expanded="false"><i class='bi bi-three-dots-vertical fs-14'></i></a>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="#" onclick="descargarImagen('${dominio}/img/archivos/${data.filename}', '${data.filename}')">
                                    <i class="bi bi-download fs-18 me-2"></i>Descargar
                                </a>
                                <a class="dropdown-item" href="#">
                                    <i class="bi bi-star fs-18 me-2"></i>Starred
                                </a>
                                <a class="dropdown-item" href="#">
                                    <i class="bi bi-trash fs-18 me-2"></i>Delete
                                </a>
                                <a class="dropdown-item" href="#">
                                    <i class="bi bi-files fs-18 me-2"></i>Copy
                                </a>
                            </div>
                        </div>
                        <div class="ctext-wrap">
                            <div class="p-2" id="${data.codigo}">
                                <div class="row align-items-center">
                                    <div class="col-auto">
                                        <img src="${dominio}/img/archivos/${data.filename}" alt="" height="150" style="width: 100%;" onclick="openFullscreen(this)">
                                        <p style="margin-top: 5px">${data.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p class="text-muted fs-12 mb-0 mt-1">${fecha}<span id="chat-${data.codigo}">${iconoStatus}</span></p>
                </div>
            </li>`;

        return html;
}

function viewReceipVideo(data, fecha) {
    const iconoStatus = checkStateMessage(data);
    let html = `
            <li class="clearfix odd">
                <div class="conversation-text ms-0">
                    <div class="d-flex justify-content-end">
                        <div class="conversation-actions dropdown dropstart">
                            <a href="javascript: void(0);" class="text-dark ps-1" data-bs-toggle="dropdown"
                                                aria-expanded="false"><i class='bi bi-three-dots-vertical fs-14'></i></a>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="#" onclick="descargarImagen('${dominio}/videos/archivos/${data.filename}', '${data.filename}')">
                                    <i class="bi bi-download fs-18 me-2"></i>Descargar
                                </a>
                                <a class="dropdown-item" href="#">
                                    <i class="bi bi-star fs-18 me-2"></i>Starred
                                </a>
                                <a class="dropdown-item" href="#">
                                    <i class="bi bi-trash fs-18 me-2"></i>Delete
                                </a>
                                <a class="dropdown-item" href="#">
                                    <i class="bi bi-files fs-18 me-2"></i>Copy
                                </a>
                            </div>
                        </div>
                        <div class="ctext-wrap">
                            <div class="p-2" id="${data.codigo}">
                                <div class="row align-items-center">
                                    <div class="col-auto">

                                        <video width="320" height="240" controls>
                                            <source src="${dominio}/videos/archivos/${data.filename}" type="video/mp4">
                                            Tu navegador no soporta la etiqueta de video.
                                        </video>
                                        <p style="margin-top: 5px">${data.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p class="text-muted fs-12 mb-0 mt-1">${fecha}<span id="chat-${data.codigo}">${iconoStatus}</span></p>
                </div>
            </li>`;

        return html;
}

function viewReceipDocument(data, fecha) {
    const iconoStatus = checkStateMessage(data);
    let html = `
            <li class="clearfix odd">
                <div class="conversation-text ms-0">
                    <div class="d-flex justify-content-end">
                        <div class="conversation-actions dropdown dropstart">
                            <a href="javascript: void(0);" class="text-dark ps-1" data-bs-toggle="dropdown"
                                                aria-expanded="false"><i class='bi bi-three-dots-vertical fs-14'></i></a>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="#" onclick="descargarImagen('${dominio}/documentos/archivos/${data.filename}', '${data.filename}')">
                                    <i class="bi bi-download fs-18 me-2"></i>Descargar
                                </a>
                                <a class="dropdown-item" href="#">
                                    <i class="bi bi-star fs-18 me-2"></i>Starred
                                </a>
                                <a class="dropdown-item" href="#">
                                    <i class="bi bi-trash fs-18 me-2"></i>Delete
                                </a>
                                <a class="dropdown-item" href="#">
                                    <i class="bi bi-files fs-18 me-2"></i>Copy
                                </a>
                            </div>
                        </div>
                        <div class="ctext-wrap">
                            <div class="p-2" id="${data.codigo}">
                                <div class="row align-items-center">
                                    <div class="col-auto">
                                        <a href="javascript:void(0);" class="text-muted fw-bold">${data.filename}</a>
                                        <p style="margin-top: 5px">${data.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p class="text-muted fs-12 mb-0 mt-1">${fecha}<span id="chat-${data.codigo}">${iconoStatus}</span></p>
                </div>
            </li>`;

        return html;
}

function viewReceipAudio(data, fecha) {
    const iconoStatus = checkStateMessage(data);
    let html = `
            <li class="clearfix odd">
                <div class="conversation-text ms-0">
                    <div class="d-flex justify-content-end">
                        <div class="conversation-actions dropdown dropstart">
                            <a href="javascript: void(0);" class="text-dark ps-1" data-bs-toggle="dropdown"
                                                aria-expanded="false"><i class='bi bi-three-dots-vertical fs-14'></i></a>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="#" onclick="descargarImagen('${dominio}/audios/archivos/${data.filename}', '${data.filename}')">
                                    <i class="bi bi-download fs-18 me-2"></i>Descargar
                                </a>
                                <a class="dropdown-item" href="#" onclick="responderFrom(event, '${data.codigo}')">
                                    <i class="bi bi-reply fs-18 me-2"></i>Responder
                                </a>
                                <a class="dropdown-item" href="#" onclick="reenviarMensaje(event, '${data.codigo}', 1)">
                                    <i class="bi bi-reply-all fs-18 me-2"></i>Reenviar
                                </a>
                                <a class="dropdown-item" href="#">
                                    <i class="bi bi-files fs-18 me-2"></i>Copy
                                </a>
                            </div>
                        </div>
                        <div class="ctext-wrap">
                            <div class="p-2" id="${data.codigo}">
                                <div class="row align-items-center">
                                    <div class="col-auto">
                                        <audio controls>
                                            <source src="${dominio}/audios/archivos/${data.filename}" type="audio/ogg">
                                            Tu navegador no soporta la etiqueta de audio.
                                        </audio>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p class="text-muted fs-12 mb-0 mt-1">${fecha}<span id="chat-${data.codigo}">${iconoStatus}</span></p>
                </div>
            </li>`;

        return html;
}

function envioFormulario(e) {
    e.preventDefault();

    const form_envio = document.getElementById('chat-form');
    const contentMensaje = document.getElementById('contentMensaje');
    const whatsappNumber = document.getElementById('whatsappNumber');
    const sendChat = document.getElementById('sendChat');

    let rescod = "";

        if(document.getElementById('codigoRes')) {
            rescod = document.getElementById('codigoRes').value;
        }

        if (contentMensaje.value === "") {
            return false;
        }

        sendChat.disabled = true;

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer EAALqfu5fdToBO4ZChxiynoV99ZARXPrkiDIfZA3fi1TRfeujYI2YlPzH9fUB8PF6BbWJAEowNhCprGP2LqZA9MhWcLcxgImVkk8LKKASpN23vtHVZA4JZC9z15pDLFe1AwXDIaLNAZA75PN4f9Ji25tGC5ue8ZA7jWEfHgo2oYZCSrIAFZAzJ3Nj86iCfJToOhZB83jZCvVheSZBOyuc04zxE");

        if(rescod === "") {
            var raw = JSON.stringify({
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": whatsappNumber.value,
                "type": "text",
                "text": {
                    "preview_url": false,
                    "body": contentMensaje.value
                }
            });
        } else {
            var raw = JSON.stringify({
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "context": {
                    "message_id": rescod
                },
                "to": whatsappNumber.value,
                "type": "text",
                "text": {
                    "preview_url": false,
                    "body": contentMensaje.value
                }
            });
        }

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://graph.facebook.com/v17.0/149168884944344/messages", requestOptions)
            .then(response => response.json())
            .then(result => {
                //console.log(result);
                //console.log(result.messages[0].id);

                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                var raw = JSON.stringify({
                    "text": contentMensaje.value,
                    "messageId": result.messages[0].id,
                    "numberWhatsapp": whatsappNumber.value
                });

                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };

                fromRes = whatsappNumber.value;
                idRes = rescod;

                let datos = {
                    id: result.messages[0].id,
                    from: "51938669769",
                    message: contentMensaje.value,
                    nameContact: "Grupo Es consultores",
                    receipt: whatsappNumber.value,
                    timestamp: Math.floor(Date.now() / 1000),
                    type: "text",
                    estadoMessage: "sent",
                    documentId: "",
                    id_document: "",
                    filename: "",
                    fromRes: fromRes,
                    idRes: idRes
                };

                fetch(dominio+"/insertChat", {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(datos)
                })
                .then(r => r.json())
                .then(resp => {
                    //console.log(resp)
                    const conversation = document.getElementById('conversation-'+whatsappNumber.value);
                    conversation.scrollTop = conversation.scrollHeight;
                })

            })
            .catch(error => console.log('error', error))
            .finally(() => {
                contentMensaje.value = "";
                document.getElementById('responderMessage').innerHTML = "";
                sendChat.disabled = false;

                const emojis = document.getElementById('emojis');
                emojis.style.display = 'none';
            });


}

function formMessage() {
    const form_envio = document.getElementById('chat-form');
    const contentMensaje = document.getElementById('contentMensaje');
    const whatsappNumber = document.getElementById('whatsappNumber');
    const sendChat = document.getElementById('sendChat');

    form_envio.addEventListener('submit', (e) => {
        e.preventDefault();

        let rescod = "";

        if(document.getElementById('codigoRes')) {
            rescod = document.getElementById('codigoRes').value;
        }

        if (contentMensaje.value === "") {
            return false;
        }

        sendChat.disabled = true;

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer EAALqfu5fdToBO4ZChxiynoV99ZARXPrkiDIfZA3fi1TRfeujYI2YlPzH9fUB8PF6BbWJAEowNhCprGP2LqZA9MhWcLcxgImVkk8LKKASpN23vtHVZA4JZC9z15pDLFe1AwXDIaLNAZA75PN4f9Ji25tGC5ue8ZA7jWEfHgo2oYZCSrIAFZAzJ3Nj86iCfJToOhZB83jZCvVheSZBOyuc04zxE");

        if(rescod === "") {
            var raw = JSON.stringify({
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": whatsappNumber.value,
                "type": "text",
                "text": {
                    "preview_url": false,
                    "body": contentMensaje.value
                }
            });
        } else {
            var raw = JSON.stringify({
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "context": {
                    "message_id": rescod
                },
                "to": whatsappNumber.value,
                "type": "text",
                "text": {
                    "preview_url": false,
                    "body": contentMensaje.value
                }
            });
        }

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://graph.facebook.com/v17.0/149168884944344/messages", requestOptions)
            .then(response => response.json())
            .then(result => {
                //console.log(result);
                //console.log(result.messages[0].id);

                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                var raw = JSON.stringify({
                    "text": contentMensaje.value,
                    "messageId": result.messages[0].id,
                    "numberWhatsapp": whatsappNumber.value
                });

                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };

                fromRes = whatsappNumber.value;
                idRes = rescod;

                let datos = {
                    id: result.messages[0].id,
                    from: "51938669769",
                    message: contentMensaje.value,
                    nameContact: "Grupo Es consultores",
                    receipt: whatsappNumber.value,
                    timestamp: Math.floor(Date.now() / 1000),
                    type: "text",
                    estadoMessage: "sent",
                    documentId: "",
                    id_document: "",
                    filename: "",
                    fromRes: fromRes,
                    idRes: idRes
                };

                fetch(dominio+"/insertChat", {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(datos)
                })
                .then(r => r.json())
                .then(resp => {
                    //console.log(resp)
                    const conversation = document.getElementById('conversation-'+whatsappNumber.value);
                    conversation.scrollTop = conversation.scrollHeight;
                })

            })
            .catch(error => console.log('error', error))
            .finally(() => {
                contentMensaje.value = "";
                document.getElementById('responderMessage').innerHTML = "";
                sendChat.disabled = false;
            });
    })
}

function envioFormularioMensaje() {
    const form_envio = document.getElementById('chat-form');
    const contentMensaje = document.getElementById('contentMensaje');
    const whatsappNumber = document.getElementById('whatsappNumber');
    const sendChat = document.getElementById('sendChat');

    form_envio.addEventListener('submit', (e) => { 
        
    });
}

function viewProfle() {
    $("#viewProfile").modal("show");
}

const enviarImagen = document.getElementById("enviarImagen");

enviarImagen.addEventListener('click', (e) => {

    let file = fileInput.files[0];

    const numero = document.getElementById("whatsappNumber");
    const fileDescription = document.getElementById('fileDescription');
    const typeArchive = document.getElementById('typeArchive');

    e.target.disabled = true;
    e.target.textContent = 'Enviando Mensaje...';

    let formData = new FormData();

    if (file) {

        formData.append('imagen', file);
        formData.append('numero', numero.value);
        formData.append('description', fileDescription.value);

        fetch('subir_imagen', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            //console.log(data);
    
            e.target.disabled = false;
            e.target.textContent = 'Enviar';
    
            if (data.message == 'ok') {
                $('#myOffcanvas').offcanvas('hide');
    
                const conversation = document.getElementById('conversation-'+numero.value);
                conversation.scrollTop = conversation.scrollHeight;
    
            } else {
                alert(data.message);
            }
        })

    } else {

        const imgBase64 = document.querySelector("#offcanvas-body img").src;

        formData.append('imagen', imgBase64);
        formData.append('numero', numero.value);
        formData.append('description', fileDescription.value);

        const formDataObj = {};

        formData.forEach((value, key) => {
            formDataObj[key] = value;
        });

        fetch('subir_imagen_paste', {
            method: 'POST',
            body: JSON.stringify(formDataObj),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(res => res.json())
        .then(data => {
            //console.log(data);
    
            e.target.disabled = false;
            e.target.textContent = 'Enviar';
    
            if (data.message == 'ok') {
                $('#myOffcanvas').offcanvas('hide');
    
                const conversation = document.getElementById('conversation-'+numero.value);
                conversation.scrollTop = conversation.scrollHeight;
    
            } else {
                alert(data.message);
            }
        })
    }

});

function descargarImagen(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'download';  // Si no proporcionas un nombre, usará 'download'
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function grabarAudio() {

    const recordButton = document.getElementById('btnAudio');
    const audioElement = document.getElementById('audio');
    const sendButton = document.getElementById('sendAudio');

    const numeroW = document.getElementById('whatsappNumber');
    //console.log(numeroW.value);

    let mediaRecorder;
    let audioChunks = [];
    let audioBlob;

    recordButton.addEventListener('mousedown', (e) => {
        audioElement.style.display = "inline";
        sendButton.style.display = "inline";
        e.target.style.color = "red";
        //console.log("hola");
        audioChunks = []; // Limpiar chunks anteriores
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.ondataavailable = event => {
                    audioChunks.push(event.data);
                };

                mediaRecorder.onstop = () => {
                    audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    audioElement.src = audioUrl;
                    // Enviar al servidor
                    if (stream) {
                        stream.getTracks().forEach(track => track.stop());
                    }
                };

                mediaRecorder.start();
            })
            .catch(error => console.error('Error accediendo al micrófono:', error));
    });

    recordButton.addEventListener('mouseup', (e) => {
        e.target.style.color = "black";
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();

        }
    });

    sendButton.addEventListener('click', (e) => {
        // Enviar al servidor
        const formData = new FormData();
        formData.append('audio', audioBlob);
        formData.append('numero', numeroW.value);

        //console.log(audioBlob);

        e.target.disabled = true;

        fetch('/uploadAudio', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            //console.log(data);
            e.target.disabled = false;
            audioElement.style.display = "none";
            sendButton.style.display = "none";

            const conversation = document.getElementById('conversation-'+numeroW.value);
            conversation.scrollTop = conversation.scrollHeight;

        })
        .catch(error => console.error('Error:', error));
    });

}

function openFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { /* Firefox */
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { /* IE/Edge */
        element.msRequestFullscreen();
    }
}

function mensajeRespondidoFromText(data) {
    return `<p style="padding: 5px 10px 5px 10px; background: #e3dddd;"><a href="#${data.codigo}" onclick="verRes(event,'${data.codigo}')">${data.message}</a> </p>`;
}

function mensajeRespondidoFromImagen(data) {
    return `<p style="padding: 5px 10px 5px 10px; background: #e3dddd;"><a href="#${data.codigo}" onclick="verRes(event,'${data.codigo}')"><img src="https://esconsultoresyasesores.com:4000/img/archivos/${data.filename}" style="width: 40px; height: 30px" /></a> </p>`;
}

function mensajeRespondidoFromAudio(data) {
    return `<p style="padding: 5px 10px 5px 10px; background: #e3dddd;"><a href="#${data.codigo}" onclick="verRes(event,'${data.codigo}')"><i class="bi bi-headphones"></i> Audio</a> </p>`;
}

function mensajeRespondidoFromVideo(data) {
    return `<p style="padding: 5px 10px 5px 10px; background: #e3dddd;"><a href="#${data.codigo}" onclick="verRes(event,'${data.codigo}')"><i class="bi bi-camera-video"></i> Video</a> </p>`;
}

function mensajeRespondidoFromDocument(data) {
    return `<p style="padding: 5px 10px 5px 10px; background: #e3dddd;"><a href="#${data.codigo}" onclick="verRes(event,'${data.codigo}')"><i class="bi bi-file-text"></i> ${data.filename}</a> </p>`;
}

//receipt
function mensajeRespondidoReceipText(data) {
    return `<p style="padding: 5px 10px 5px 10px; background: #e3dddd;"><a href="#${data.codigo}" onclick="verRes(event,'${data.codigo}')">${data.message}</a> </p>`;
}

function mensajeRespondidoReceipImagen(data) {
    return `<p style="padding: 5px 10px 5px 10px; background: #e3dddd;"><a href="#${data.codigo}" onclick="verRes(event,'${data.codigo}')"><img src="https://esconsultoresyasesores.com:4000/img/archivos/${data.filename}" /></a> </p>`;
}

function mensajeRespondidoReceipAudio(data) {
    return `<p style="padding: 5px 10px 5px 10px; background: #e3dddd;"><a href="#${data.codigo}" onclick="verRes(event,'${data.codigo}')"> <i class="bi bi-headphones"></i> Audio </a> </p>`;
}

function verRes(e,codigo) {
    e.preventDefault();
    const targetElement = document.getElementById(codigo);
    targetElement.scrollIntoView({ behavior: 'smooth' });

    const parent = targetElement.parentElement;

    parent.style.background = '#e3dddd';

    setInterval(() => {
        parent.removeAttribute('style');
    }, 2000);

    
}

function responderFrom(e, codigo) {
    e.preventDefault();
    const resm = document.getElementById('responderMessage');
    const numWhat = document.getElementById('whatsappNumber');

    fetch('/chatOne/'+codigo)
    .then(res => res.json())
    .then(data => {
        const men = data.data.message;
        const datos = data.data;

        if(datos.typeMessage === 'text') {
            resm.innerHTML = `
            <div class="resCustom" style="position: relative;border: 1px solid #ccc;padding: 5px;margin-bottom: 5px;">
                <p style="margin-bottom: 0px;padding: 5px;">${men}</p>
                <input type="hidden" name="codigoRes" id="codigoRes" value="${codigo}" />
                <span class="close-btn" style="position: absolute;top: 5px;right: 10px;cursor: pointer;font-size: 20px;" onclick="cerrarRes()">&times;</span>
            </div>
        `;
        }

        if (datos.typeMessage === 'audio') {
            resm.innerHTML = `
            <div class="resCustom" style="position: relative;border: 1px solid #ccc;padding: 5px;margin-bottom: 5px;">
                <p style="margin-bottom: 0px;padding: 5px;"><i class="bi bi-headphones"></i> Audio</p>
                <input type="hidden" name="codigoRes" id="codigoRes" value="${codigo}" />
                <span class="close-btn" style="position: absolute;top: 5px;right: 10px;cursor: pointer;font-size: 20px;" onclick="cerrarRes()">&times;</span>
            </div>
            `;
        }

        if (datos.typeMessage === 'image') {

            let ruta = "";

            if(numWhat.value == datos.from) {
                ruta = `${dominio}/img/archivos/${datos.id_document}.jpg`;
            } else {
                ruta = `${dominio}/img/archivos/${datos.filename}`;
            }

            resm.innerHTML = `
            <div class="resCustom" style="position: relative;border: 1px solid #ccc;padding: 5px;margin-bottom: 5px;">
                <div class="d-flex justify-content-between align-items-center">
                    <p style="margin-bottom: 0px; padding: 5px;"><i class="bi bi-image-fill"></i> Imagen</p>
                    <img src="${ruta}" alt="Imagen" style="max-height: 35px;margin-right: 25px;">
                </div>
                
                <input type="hidden" name="codigoRes" id="codigoRes" value="${codigo}" />
                <span class="close-btn" style="position: absolute;top: 5px;right: 10px;cursor: pointer;font-size: 20px;" onclick="cerrarRes()">&times;</span>
            </div>
            `;
        }

    
    })
}

function cerrarRes() {
    const resm = document.getElementById('responderMessage');
    resm.innerHTML = "";
}

const embudohtml = document.getElementById('embudo');
const etiquetahtml = document.getElementById('etiqueta');
const idpot = document.getElementById('idpot');
const numContEti = document.getElementById('numContEti');

function etiquetaCliente(potencial, etiqueta) {
    $("#modalEtiqueta").modal("show");

    const num = document.getElementById('whatsappNumber');
    numContEti.value = num.value;

    idpot.value = potencial;

    const formData = new FormData();

    formData.append('potencial', potencial);
    formData.append('etiqueta', etiqueta);

    fetch('/getEmbudoEtiqueta/'+etiqueta)
    .then(res => res.json())
    .then(data => {

        let select_embudo = "";
        let select_etiqueta = "";

        let embudoData = data.embudo;
        let etiquetaData = data.etiqueta;

        embudoData.forEach(embudo => {
            if(embudo.id === data.embudo_id) {
                select_embudo += `<option value="${embudo.id}" selected="">${embudo.descripcion}</option>`;
            } else {
                select_embudo += `<option value="${embudo.id}">${embudo.descripcion}</option>`;
            }
            
        });

        embudohtml.innerHTML = select_embudo;

        etiquetaData.forEach(etiq => {
            if(etiq.id === etiqueta) {
                select_etiqueta += `<option value="${etiq.id}" selected="">${etiq.descripcion}</option>`;
            } else {
                select_etiqueta += `<option value="${etiq.id}">${etiq.descripcion}</option>`;
            }
            
        });

        etiquetahtml.innerHTML = select_etiqueta;

    })
}

embudohtml.addEventListener('change', (e) => {
    e.preventDefault();

    const id = e.target.value;

    fetch('/getEtiquetaEmbudo/'+id)
    .then(res => res.json())
    .then(data => {
        const eti = data.etiquetas;
        let html = "";

        eti.forEach(etiqueta => {
            html += `<option value="${etiqueta.id}">${etiqueta.descripcion}</option>`;
        });

        etiquetahtml.innerHTML = html;
    })
});

const editar_etiqueta = document.getElementById('editar_etiqueta');

editar_etiqueta.addEventListener('click', (e) => {
    e.preventDefault();

    const embudo = embudohtml.value;
    const etiqueta = etiquetahtml.value;
    const potencial = idpot.value;

    fetch('/actualizarEtiqueta', {
        method: 'POST',
        body: JSON.stringify({
            embudo: embudo,
            etiqueta: etiqueta,
            potencial: potencial
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(data => {
        if(data.message === 'ok') {
            $("#modalEtiqueta").modal("hide");
            Swal.fire({
                position: "top-center",
                icon: "success",
                title: "Se cambio la etiqueta correctamente",
                showConfirmButton: false,
                timer: 1500
            });

            chatDetail(numContEti.value)

        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Ocurrio un error, comunicarse con el administrador!"
            });
        }
    })

});

function asignarChat(cliente, asignado) {
    $("#modalAsignar").modal("show");

    const idpotencial = document.getElementById('idcp');

    idpotencial.value = cliente;

    fetch('/getEmpleadosAsignar')
    .then(res => res.json())
    .then(data => {
        const trabajador = document.getElementById('trabajador');
        
        let option = "";

        let datos = data.data;

        datos.forEach(tra => {
            if(tra.id === asignado) {
                option += `<option value="${tra.id}" selected>${tra.nombres} ${tra.apellidos}</option>`;
            } else {
                option += `<option value="${tra.id}">${tra.nombres} ${tra.apellidos}</option>`;
            }
            
        });

        trabajador.innerHTML = option;
    })
}

const btnAsignar = document.getElementById('btnAsignarEmpleado');

btnAsignar.addEventListener('click', (e) => {
    e.preventDefault();
    e.target.disabled = true;

    const whatsapp = document.getElementById('whatsappNumber');
    const cliente = document.getElementById('idcp');
    const tra = document.getElementById('trabajador');

    fetch('/asignarAsistente', {
        method: 'POST',
        body: JSON.stringify({
            asistente: tra.value,
            numero: whatsapp.value,
        }),
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(res => res.json())
    .then(data => {
        e.target.disabled = true;
        if(data.message === 'ok') {
            $("#modalAsignar").modal("hide");

            Swal.fire({
                position: "top-center",
                icon: "success",
                title: "Se asigno correctamente",
                showConfirmButton: false,
                timer: 1500
            })

            chatDetail(whatsapp.value);

        } else {
           Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Ocurrio un error, comunicate con el administrador del sistema!",
            });
        }
    })

});

//Agregar Contacto
const newContacto = document.getElementById('newContact');
const btnAgregar = document.getElementById('btnNuevoContacto');

const plataforma = document.getElementById('plataforma_contacto');


function renderOptionPlataforma(docPlataforma, type) {
    fetch('/getPlataformas')
    .then(res => res.json())
    .then(data => {
        if(data.message === 'ok') {

            let html = "";

            if(type == 0) {
                html = `<option value="0">Todos</option>`;
            } else {
                html = `<option value="">Seleccione...</option>`;
            }
            
            const datos = data.data;

            datos.forEach(platf => {
                html += `<option value="${platf.id}">${platf.nombre}</option>`;
            });

            docPlataforma.innerHTML = html;

        }
    });
}

newContacto.addEventListener('click', (e) => {
    e.preventDefault();

    $("#modalNuevoContacto").modal('show');

    document.getElementById('contentContactNew').innerHTML = "";
    document.getElementById('check_automatico').innerHTML = "";
    document.getElementById('dataPlantilla').innerHTML = "";
    document.getElementById('contentPlantilla').innerHTML = "";

    document.getElementById('nombreContacto').value = "";
    document.getElementById('nWhatsapp').value = "";
    document.getElementById('plataforma_contacto').value = "";
    document.getElementById('tipo_contacto').value = "";

    document.getElementById('embudoCliente').value = "";
    document.getElementById('etiquetaCliente').innerHTML = `<option value=""></option>`;

    renderOptionPlataforma(plataforma, 1);
    
});

btnAgregar.addEventListener('click', (e) => {
    e.preventDefault();

    const nameContacto = document.getElementById('nombreContacto');
    const codigopais = document.getElementById('codigopais');
    const nWhatsapp = document.getElementById('nWhatsapp');
    const plataforma_contacto = document.getElementById('plataforma_contacto');
    const type_contact = document.getElementById('tipo_contacto');
    const asignar = document.getElementById('asignar_automaticamente');

    const carreraContacto = document.getElementById('carreraContacto');

    const etiquetaCliente = document.getElementById('etiquetaCliente');

    const numero = nWhatsapp.value;

    if (numero.length != 9) {
        alert('Ingrese el número de whatsapp de 9 dígitos');
        return false;
    }

    if(plataforma_contacto.value == "") {
        alert('Seleccione una plataforma del contacto');
        return false;
    }

    if(type_contact.value == "") {
        alert('Seleccione el tipo de contacto');
        return false;
    }

    if (etiquetaCliente.value == "") {
        alert('Seleccione una etiqueta por favor');
        return false;
    }

    let numerosWht = 0;
    let tipoW = 0;

    if(plataforma_contacto.value == 1) {
        numerosWht = document.getElementById('numeros_whatsapp').value;
        tipoW = document.getElementById('publicidad_facebook').value;
    }

    let tipoPublicidad = 0;
    let publicidad = 0;

    if(plataforma_contacto.value == 4) {
        tipoPublicidad = document.getElementById('tipo_publicidad').value;

        if(tipoPublicidad == 1) {
            publicidad = document.getElementById('publicidad_facebook').value;
        } else {
            publicidad = 0;
        }
        
    }

    const numeroChat = codigopais.value+""+numero;

    let clickAsignar = 1;
    let asignado = 0;

    if(rol.value != 2) {
        if(type_contact.value == 1) {
            if(!asignar.checked) {
                clickAsignar = 0;
                asignado = document.getElementById('asignarAgente').value;
            }
        } else {
            clickAsignar = 0;
            asignado = document.getElementById('asignarAgente').value;
        }
    }

    const selectedPlantilla = document.getElementById('plantillaNuevo');

    const inputs = document.querySelectorAll('.variables');

    const inputVariables = [];

    if(inputs) {
        inputs.forEach(input => {
            inputVariables.push(input.value);
        });
    }

    const check_plantilla = document.getElementById('check_plantilla');

    let plantillaCheck = 0;
    
    if(check_plantilla.checked) {
        if(selectedPlantilla.value == "") {
            alert('Seleccione una plantilla');
            return false;
        }

        plantillaCheck = 1;
    }

    e.target.disabled = true;

    fetch('/addContact', {
        method: 'POST',
        body: JSON.stringify({
            numero: numeroChat,
            name: nameContacto.value,
            plataforma_contacto: plataforma_contacto.value,
            tipo_contacto: type_contact.value,
            clickAsignar: clickAsignar,
            asignado: asignado,
            idPlantilla: selectedPlantilla.value,
            variables: inputVariables,
            numerosWht: numerosWht,
            tipoW: tipoW,
            tipoPublicidad: tipoPublicidad,
            publicidad: publicidad,
            carreraContacto: carreraContacto,
            plantillaCheck: plantillaCheck,
            etiquetaCliente: etiquetaCliente.value
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        e.target.disabled = false;
        if(data.message === 'ok') {
            $("#modalNuevoContacto").modal("hide");
            Swal.fire({
                position: 'top-center',
                icon: 'success',
                title: 'Se agrego correctamente',
                showConfirmButton: false,
                timer: 2000
            })
        } else {
            if (data.message === 'existe') {
                alert(data.data);
            } else {
                $("#modalNuevoContacto").modal("hide");
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "No se conecto con la Api de Whatsapp! - "+data.message
                });
            }
        }
    })
});

//ver contactos
const misContactos = document.getElementById('misContactos');

const buscar = document.getElementById('buscarContact');

const lista = document.getElementById('listaCont');

misContactos.addEventListener('click', (e) => {
    e.preventDefault();

    buscar.value = "";
    lista.innerHTML = "";

    $("#modalContacts").modal('show');

    contactosLista(buscar.value);
});

buscar.addEventListener('keyup', (e) => {
    const busqueda = e.target.value;
    console.log("hola");

    contactosLista(busqueda);
});

function contactosLista(buscar) {
    fetch('/getContacts', {
        method: 'POST',
        body: JSON.stringify({
            buscar: buscar
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    .then(res => res.json())
    .then(data => {
        const datos = data.data;

        let html = "";

        datos.forEach(contact => {

            let separacion = "";

            if(rol.value != 2 && rol.value != 6) {
                separacion = `
                <div class="dropdown align-self-center float-end">
                    <span class="text-primary">${contact.asistente}</span>
                </div>
                `;
            }

            html += `
            <div class="d-flex border-top pt-2" style="cursor: pointer" onclick="itemContact(${contact.from})">
                <img src="img/logos/icon.png" class="avatar rounded me-3" alt="shreyu">
                <div class="flex-grow-1">
                    <h5 class="mt-1 mb-0 fs-15">${contact.nameContact}</h5>
                    <h6 class="text-muted fw-normal mt-1 mb-2">${contact.from}</h6>
                </div>
                ${separacion}
            </div>
            `;
        });

        lista.innerHTML = html;
    })
}

function itemContact(numero) {

    $("#modalContacts").modal('hide');

    chatDetail(numero);
}

const escogePlantilla = document.getElementById('escogePlantilla');

function plantillaGet() {
    $("#modalPlantilla").modal("show");

    document.getElementById('contenidoPlantilla').innerHTML = "";

    fetch('/getPlantillas')
    .then(res => res.json())
    .then(data => {

        if(data.message === 'ok') {
            const plantilas = data.data;

            let html = `<option value="">Seleccione...</option>`;

            plantilas.forEach(plantilla => {
                html += `<option value="${plantilla.id}">${plantilla.nombre}</option>`;
            });

            escogePlantilla.innerHTML = html;

        } else {
            alert('Intente de nuevo o contactarse con el administrador');
        }

    })
}

escogePlantilla.addEventListener('change', (e) =>  {
    e.preventDefault();

    const contentPlantilla = document.getElementById('contenidoPlantilla');

    const id = e.target.value;

    let html = "";

    if(id == "" || id == "3") {
        contentPlantilla.innerHTML = html;
        return;
    }

    fetch('/getPlantilla/'+id)
    .then(res => res.json())
    .then(data => {
        console.log(data);

        let inputVariable = "";
        let cabecera = "";

        if(data.plantilla.cabecera === 'si') {
            if(data.plantilla.tipoCabecera === 'video') {
                cabecera = `
                <div class="col-md-12">
                    <div class="mb-3">
                        <video width="440" height="260" controls>
                            <source src="${data.plantilla.url_cabecera}" type="video/mp4">
                            Tu navegador no soporta el elemento de video.
                        </video>
                    </div>
                </div>
                `;
            }

            if(data.plantilla.tipoCabecera === 'image') {
                cabecera = `
                <div class="col-md-12">
                    <div class="mb-3">
                        <img src="${data.plantilla.url_cabecera}" style="width: 100%" />
                    </div>
                </div>
                `;
            }
        }

        const variables = data.variables;

        variables.forEach(variable => {
            inputVariable += `

            <textarea class="form-control input-content-variable" rows="1" style="resize: none" oninput="detectarAltoInputMensaje(this)" id="contentVariable"></textarea>
            <span class="input-group-text" id="basic-addon2">{{{${variable.nombre}}}}</span>
            `;
        });

        html += `
        ${cabecera}
        <div class="col-md-12">
            <div class="mb-3">
                <label for="cuerpo" class="col-form-label">Cuerpo:</label>
                <p>${data.plantilla.contenido}</p>
            </div>
        </div>
        <div class="col-md-12">
            <label for="cuerpo_" class="col-form-label">Variables:</label> <a href="javascript:void(0);" onclick="showItemsEmojis(event)"> <i class="bi bi-emoji-smile fs-18"></i> </a> <span id="closeTemplate"> </span>

            <div id="listaEmojisTemplate" style="display:none;height: 75px; overflow-y: scroll; overflow-x: hidden">
            
            </div>

            <div class="input-group mb-3">
                ${inputVariable}
            </div>
        </div>
        `;

        contentPlantilla.innerHTML = html;
    })

});

const btnEnviarPlatilla = document.getElementById('btnEnviarPlatilla');

btnEnviarPlatilla.addEventListener('click', (e) => {
    const idPlantilla = escogePlantilla.value;
    const numberWhat = document.getElementById('whatsappNumber');

    const inputs = document.querySelectorAll('.input-content-variable');

    const inputVariables = [];

    inputs.forEach(input => {
        inputVariables.push(input.value);
    });

    e.target.disabled = true;

    fetch('/sendPlantilla', {
        method: 'POST',
        body: JSON.stringify({
            idPlantilla: idPlantilla,
            numero: numberWhat.value,
            variables: inputVariables
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    .then(res => res.json())
    .then(data => {
        e.target.disabled = false;
        console.log(data);
        if(data.message === 'ok') {
            $("#modalPlantilla").modal('hide');
            Swal.fire({
                position: 'top-center',
                icon: 'success',
                title: 'Se envio correctamente la plantilla',
                showConfirmButton: false,
                timer: 2000
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se pudo enviar la plantilla!'
            })
        }
       
    })
    .catch(err => console.log(err.message));
});

function editContact() {
    $("#modalEditarContacto").modal('show');
    const n = document.getElementById('whatsappNumber');
    const nameCont = document.getElementById('nContacto');
    const nueveDi = document.getElementById('what');

    const conta = document.getElementById('nameContacto');

    nueveDi.value = n.value;
    nameCont.value = conta.textContent;

}

const editarContact = document.getElementById('btnEditarContacto');

editarContact.addEventListener('click', (e) => {

    const nombre_contacto = document.getElementById('nContacto');
    const whatsapp = document.getElementById('whatsappNumber');

    e.target.disabled = true;

    fetch('/editContact', {
        method: 'PUT',
        body: JSON.stringify({
            nombre_contacto: nombre_contacto.value,
            whatsapp: whatsapp.value
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    .then(res => res.json())
    .then(data => {
        e.target.disabled = false;
        if (data.message === 'ok') {
            $("#modalEditarContacto").modal('hide');
            Swal.fire({
                position: 'top-center',
                icon: 'success',
                title: 'Se edito correctamente el contacto',
                showConfirmButton: false,
                timer: 2000
            })

            chatDetail(data.data.from);

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se pudo editar el contacto, intentalo otra vez!'
            })
        }

    })
    .catch((err) => console.log(err.message));
});

const tipo_contacto = document.getElementById('tipo_contacto');
const contentContactNew = document.getElementById('contentContactNew');
const check_automatico = document.getElementById('check_automatico');


tipo_contacto.addEventListener('change', (e) => {
    const option = e.target.value;
    
    let htmlOption = "";

    if (option == "") {
        document.getElementById('dataPlantilla').innerHTML = "";
        document.getElementById('contentContactNew').innerHTML = "";
        document.getElementById('check_automatico').innerHTML = "";
        return;
    }

    if(rol.value != 2) {
        if(option == 1) {

            fetch('/getAsignationName')
            .then(res => res.json())
            .then(data => {
                console.log(data);

                htmlOption += `
                <div class="col-md-12">
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="asignar_automaticamente" checked="" onchange="checkAsignar(event)">
                        <label class="form-check-label" for="asignar_automaticamente">Asignar automáticamente <span id="nameAsig">(${data.nombres} ${data.apellidos})</span></label>
                    </div>
                </div>
                `;

                document.getElementById('check_automatico').innerHTML = "";

                contentContactNew.innerHTML = htmlOption;
            })

        } else {
            fetch('/getAgentes', {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            .then(res => res.json())
            .then(data => {
                if(data.message === 'ok') {
                    selectHtmlAgente(data);
                }
            })
        }
    }
    
    contentContactNew.innerHTML = htmlOption;
    document.getElementById('contentPlantilla').innerHTML = "";

    fetch('/getPlantillas')
    .then(res => res.json())
    .then(data => {
        const dataPlantilla = document.getElementById('dataPlantilla');

        let optionPlantilla = "";

        const datos = data.data;

        datos.forEach(plantilla => {
            optionPlantilla += `<option value="${plantilla.id}">${plantilla.nombre}</option>`;
        });

        let data_platilla = `
        <div class="col-md-12">
            <label for="check_plantilla" class="col-form-label">Enviar Plantilla </label> <input type="checkbox" class="form-check-input" id="check_plantilla" name="check_plantilla" onchange="check_plantilla(event)" value="1" />
            <div class="mb-3">
                <label for="plantillaNuevo" class="col-form-label">Plantilla </label>
                <select name="plantillaNuevo" id="plantillaNuevo" class="form-select">
                    <option value="">Seleccione...</option>
                    ${optionPlantilla}
                </select>
            </div>
        </div>
        `;

        dataPlantilla.innerHTML = data_platilla;
    })
});

function check_plantilla(e) {
    const plantillaNuevo = document.getElementById('plantillaNuevo');
    if(e.target.checked) {
        plantillaNuevo.setAttribute('onchange', 'plantillaSelect(event)');
    } else {
        plantillaNuevo.removeAttribute('onchange');

        const contentPlantilla = document.getElementById('contentPlantilla');

        contentPlantilla.innerHTML = "";

        plantillaNuevo.value = "";
    }
}


function checkAsignar(e) {
    if(!e.target.checked){
        fetch('/getAgentes', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res => res.json())
        .then(data => {
            if(data.message === 'ok') {
                selectHtmlAgente(data);
            }
        })
    } else {
        fetch('/getAsignationName')
        .then(res => res.json())
        .then(data => {
            const nameAsig =document.getElementById('nameAsig');

            nameAsig.innerHTML = `(${data.nombres} ${data.apellidos})`;
        })

        check_automatico.innerHTML = "";
    }
}

function selectHtmlAgente(data) {
    const datos = data.data;

    let option = "";

    datos.forEach(agente => {
        if(agente.id == data.id) {
            option += `<option value="${agente.id}" selected="">${agente.nombres} ${agente.apellidos}</option>`;
        } else {
            option += `<option value="${agente.id}">${agente.nombres} ${agente.apellidos}</option>`;
        }
        
    });

    let html = `
        <div class="col-md-12">
            <div class="mb-3">
                <label for="asignarAgente" class="col-form-label">Agente:</label>
                <select name="asignarAgente" id="asignarAgente" class="form-select">
                    <option value="">Seleccione...</option>
                    ${option}
                </select>
            </div>
        </div>
    `;

    check_automatico.innerHTML = html;
}

function plantillaSelect(e) {
    const id = e.target.value;

    const contentPlantilla = document.getElementById('contentPlantilla');

    contentPlantilla.innerHTML = "";

    fetch('/getPlantilla/'+id)
    .then(res => res.json())
    .then(data => {

        const variables = data.variables;

        let existeVariables = "";

        if(variables.length > 0) {

            let varian = "";

            variables.forEach(variable => {
                let dinamico = "";

                if(data.plantilla.id == 3) {
                    dinamico = `<input type="text" class="form-control variables" placeholder="Esto es dinamico" value="" id="cuerpo_variable" readonly>`;
                } else {
                    /* dinamico = `<input type="text" class="form-control variables" placeholder="Ingrese el contenido de la variable" value="" id="cuerpo_variable">`; */
                    let placeholder = "";

                    if(data.plantilla.id == 20) {
                        placeholder = "el Mg. Erik Pezo"
                    }

                    dinamico = `
                        <textarea rows="1" id="cuerpo_variable" class="form-control variables" style="resize: none;" oninput="detectarAltoInputMensaje(this)">${placeholder}</textarea>
                    `;
                }

                varian += `
                <div class="input-group mb-3">
                    ${dinamico}
                    <span class="input-group-text" id="basic-addon2">${variable.nombre}</span>
                </div>
                `;
            });

            existeVariables = `
            <div class="col-md-12">
                <label for="cuerpo_variable" class="col-form-label">Variables: </label> <a href="javascript:void(0);" id="emojis_add_contact" onclick="showEmojisAddContact(event)"><i class="bi bi-emoji-smile fs-18"></i></a> <span id="deletex">  </span>

                <div style="height: 75px; overflow-y: scroll; display: none; overflow-x: hidden" id="addContactEmojis">
                    <a href="javascript:void(0);" class="item-emoji" style="font-size: 24px">😀</a>
                </div>

                ${varian}
            </div>
            `;
        }
        
        const content = `
        <div class="col-md-12">
            <div class="mb-3">
                <label for="cuerpo_nuevo" class="col-form-label">Cuerpo:</label>
                <p>${data.plantilla.contenido}</p>
            </div>
        </div>

        ${existeVariables}
        `;

        contentPlantilla.innerHTML = content;

    })
}

function checkStateMessage(data) {

    let icono = "";

    const dataStatus = data.estadoMensaje;

    if(dataStatus) {
        if(dataStatus.status === 'sent') {
            icono = `<i class="bi bi-check ms-1" style="font-size: 16px"></i>`;
        } else if(dataStatus.status === 'delivered') {
            icono = `<i class="bi bi-check-all ms-1" style="font-size: 16px"></i>`;
        } else if(dataStatus.status === 'read') {
            icono = `<i class="bi bi-check-all ms-1 text-primary" style="font-size: 16px"></i>`;
        } else {
            icono = `<i class="bi bi-arrow-clockwise ms-1 text-danger" style="font-size: 16px"></i>`;
        }

    } else {
        icono = `<i class="bi bi-arrow-clockwise ms-1 text-primary" style="font-size: 16px; cursor: pointer" onclick="reenviarTemplate(${data.id})"></i>`;
    }

    return icono;
}

function socketStateMessage(data) {
    let icono = "";
    if(data.status === 'sent') {
        icono = `<i class="bi bi-check ms-1" style="font-size: 16px"></i>`;
    } else {
        if (data.status === 'delivered') {
            icono = `<i class="bi bi-check-all ms-1" style="font-size: 16px"></i>`;
        } else {
            if (data.status === 'read') {
                icono = `<i class="bi bi-check-all ms-1 text-primary" style="font-size: 16px"></i>`;
            } else {
                icono = `<i class="bi bi-exclamation-circle ms-1 text-danger" style="font-size: 16px"></i>`;
            }
        }
    }

    return icono;
}

//filtro de etiqueta del contacto
const filtroEmbudo = document.getElementById('filtroEmbudo');

filtroEmbudo.addEventListener('change', (e) => {
    const valor = e.target.value;

    fetch('/getEtiquetaEmbudo/'+valor)
    .then(res => res.json())
    .then(data => {
        const eti = data.etiquetas;
        let html = `<option value="0">TODOS</option>`;

        const filtroEtiqueta = document.getElementById('filtroEtiqueta');

        eti.forEach(etiqueta => {
            html += `<option value="${etiqueta.id}">${etiqueta.descripcion}</option>`;
        });

        filtroEtiqueta.innerHTML = html;

        if(valor == 0) {
            renderChatContactos();
        }
    })

});

//filter contacto
const filterContacto = document.getElementById('filterContacto');
const consultarFiltro = document.getElementById('consultarFiltro');

const contentChatWhatsapp = document.getElementById('contentChatWhatsapp');
const contentFiltros = document.getElementById('contentFiltros');

const contentFilterContact = document.getElementById('contentFilterContact');
const reporteSeguimiento = document.getElementById('reporteSeguimiento');

filterContacto.addEventListener('click', (e) => {
    e.preventDefault();

    contentChatWhatsapp.classList.remove("col-xl-9");
    contentChatWhatsapp.classList.add('col-xl-5');

    contentFiltros.style.display = "block";

    // Agregar transición
    contentFiltros.style.transition = "opacity 0.5s ease";
    contentFiltros.style.opacity = 0;

    // Se muestra suavemente
    setTimeout(() => {
        contentFiltros.style.opacity = 1; 
    }, 50);

    viewFilterPlataformaContacto();
});

reporteSeguimiento.addEventListener('click', (e) => {
    e.preventDefault();

    contentChatWhatsapp.classList.remove("col-xl-9");
    contentChatWhatsapp.classList.add('col-xl-5');

    contentFiltros.style.display = "block";

    // Agregar transición
    contentFiltros.style.transition = "opacity 0.5s ease";
    contentFiltros.style.opacity = 0;

    // Se muestra suavemente
    setTimeout(() => {
        contentFiltros.style.opacity = 1; 
    }, 50);

    viewSeguimientos();
});

function viewFilterPlataformaContacto() {
    let view = `
    <h4 class="mb-3">Plataforma - Filtro de Contactos</h4>
        <div class="row">
            <div class="col-md-6">
                <div class="mb-1">
                    <label class="form-label" for="dateInit">Fecha Inicio</label>
                    <input type="date" class="form-control" id="dateInit">
                </div>
            </div>
            <div class="col-md-6">
                <div class="mb-1">
                    <label class="form-label" for="dateEnd">Fecha Fin</label>
                    <input type="date" class="form-control" id="dateEnd">
            </div>
        </div>
        <div class="col-md-6">
            <div class="mb-1">
                <label class="form-label" for="platform">Plataforma</label>
                <select name="platform" id="platform" class="form-select">

                </select>
            </div>
        </div>
        <div class="col-md-6">
            <div class="mb-1">
                <button type="button" class="btn btn-primary mt-3" id="consultarFiltro" onclick="consultarFiltroPlataforma(event)">Consultar</button>
            </div>
        </div>
    </div>

    <div class="row" id="content_filtro">

    </div>
    `;

    contentFilterContact.innerHTML = view;

    const platform = document.getElementById('platform');

    renderOptionPlataforma(platform, 0);
}

function viewSeguimientos() {

    fetch('/lista-seguimientos')
    .then(res => res.json())
    .then(data => {

        if(data.message !== 'ok') {
            return alert('Ocurrio un error');
        }

        const datos = data.response;

        let html = "";

        datos.forEach(contacto => {

            let carrera = contacto.arrayExtra.carrera;

            if(contacto.arrayExtra.carrera === null) {
                carrera = "";
            }

            let segui = contacto.arrayExtra.seguimientos;

            html += `
            <tr>
                <th>${contacto.from}</th>
                <th>${contacto.nameContact}</th>
                <th>${contacto.arrayExtra.asistente}</th>
                <th>${contacto.arrayExtra.nameEtiqueta}</th>
                <th>${carrera}</th>
                <th></th>
                <th></th>
            </tr>
            `;

            segui.forEach(seg => {

                let fechaHora = new Date(seg.createdAt);
                fecha = fechaHora.toLocaleDateString('es-ES');

                let hora = fechaHora.toLocaleTimeString('es-ES');

                html += `
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>${carrera}</td>
                    <td>${fecha} ${hora}</td>
                    <td>${seg.description}</td>
                </tr>
                `;
            });
        });

        let view = `
        <h4 class="mb-3">Seguimiento Contactos</h4>
        <div class="row" id="content_filtro">
            <div class="table-responsive" >
                <table class="table" id="tablaSeguimiento">
                    <thead>
                        <tr>
                            <th>Numero</th>
                            <th>Contacto</th>
                            <th>Asistente</th>
                            <th>Etiqueta</th>
                            <th>Carrera</th>
                            <th>Fecha</th>
                            <th>Seguimiento</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${html}
                    </tbody>
                </table>
            </div>
        </div>
        `;
        contentFilterContact.innerHTML = view;

        $("#tablaSeguimiento").DataTable({
            "ordering": false,
            dom: 'Bfrtip',
            buttons: [
                'excel'
            ]
        });
    })
}

function consultarFiltroPlataforma(e) {

    const dateInit = document.getElementById('dateInit');
    const dateEnd = document.getElementById('dateEnd');
    const platf = document.getElementById('platform');

    if(dateInit.value == "") {
        return alert('Ingrese una fecha de Inicio por favor');
    }

    if(dateEnd.value == "") {
        return alert('Ingrese una fecha de Fin por favor');
    }

    e.target.disabled = true;
    e.target.textContent = 'Consultando...';

    const post = {
        dateInit: dateInit.value,
        dateEnd: dateEnd.value,
        plataforma: platf.value
    };

    fetch("/filtroContact", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(post)
    })
    .then(res => res.json())
    .then(data => {
        e.target.disabled = false;
        e.target.textContent = 'Consultar';

        if(data.message === 'ok') {
            viewFilterContacts(data);
        } else {
            alert('ocurrio un error');
        }
    })
}

function viewFilterContacts(data) {
    const content_filtro = document.getElementById('content_filtro');

    let tbody = "";

    const datos = data.data;

    datos.forEach(contact => {
        let register = "";

        if(contact.user_register == 0) {
            register = "SOFTWARE";
        } else {
            register = contact.arrayExtra.user_register;
        }

        const fechaHora = new Date(contact.createdAt);
        const fecha = fechaHora.toLocaleDateString('es-ES'); // Cambia 'es-ES' al código local que prefieras

        // Formatear la hora en español
        const hora = fechaHora.toLocaleTimeString('es-ES');

        //chatDetail('${contact.numero}','${nameContact}', '${contact.etiqueta}', ${contact.potencial_id}, ${contact.etiqueta_id}, ${rol}, ${contact.idAsistente}, '${contact.asistente}')

        tbody += `
        <tr>
            <td> <a href="javascript:void(0);" onclick="chatDetail('${contact.from}', '${contact.nameContact}','${contact.arrayExtra.nameEtiqueta}',${contact.arrayExtra.potencial_id}, ${contact.arrayExtra.etiqueta_id}, ${contact.arrayExtra.rol}, ${contact.asistente}, '${contact.arrayExtra.asistente}')">${contact.nameContact}</a> </td>
            <td>${contact.from}</td>
            <td>${fecha}</td>
            <td>${hora}</td>
            <td>${register}</td>
            <td>${contact.arrayExtra.asistente}</td>
            <td></td>
            <td>${contact.arrayExtra.origen}</td>
            <td>${contact.arrayExtra.tipo_origen}</td>
            <td>${contact.arrayExtra.nameEtiqueta}</td>
        </tr>
        `;
    });

    let htmlTable = `
    <div class="table-responsive table-nowrap mt-3" style="height: 370px; overflow-y: scroll">
        <table class="table table-sm table-centered mb-0 fs-13" id="tablaFiltro">
            <thead class="table-light">
                <tr>
                    <th>Contacto</th>
                    <th style="width: 30%;">Whatsapp</th>
                    <th style="width: 30%;">Fecha</th>
                    <th style="width: 30%;">Hora</th>
                    <th>Registrado</th>
                    <th>Asistente</th>
                    <th>Carrera</th>
                    <th>Origen</th>
                    <th>Tipo Origen</th>
                    <th>Etiqueta</th>
                </tr>
            </thead>
            <tbody>
                ${tbody}
            </tbody>
        </table>
    </div>
    `;

    content_filtro.innerHTML = htmlTable;

    $('#tablaFiltro').DataTable({
        "ordering": false,
        dom: 'Bfrtip',
        buttons: [
            'excel'
        ]
    });
}

//reenviar mensajes
function reenviarMensaje(e, codigo, from) {
    e.preventDefault();

    const buscarContacto = document.getElementById('buscarContacto');
    const codigoMensaje = document.getElementById('codigoMensaje');
    const sendType = document.getElementById('sendType');

    codigoMensaje.value = codigo;
    sendType.value = from;

    $('#modalReenvio').modal('show');

    obtenerContactosReenviar(buscarContacto.value, from);
}

function obtenerContactosReenviar(buscar) {
    fetch('/obtenerContactos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ buscar: buscar })
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        viewContactosReenvio(data);
    })
}

function viewContactosReenvio(data){
    let contactos = data.data;

    let viewContactos = "";

    contactos.forEach(contacto => {
        viewContactos += `
        <div class="d-flex border-top pt-2">
            <input type="radio" id="contact-${contacto.from}" name="getContacto" class="form-check-input" value="${contacto.from}" style="margin-right: 20px;">
            <div class="flex-grow-1">
                <h5 class="mt-1 mb-0 fs-15">${contacto.nameContact}</h5>
                <h6 class="text-muted fw-normal mt-1 mb-2">${contacto.from}</h6>
            </div>
            
        </div>
        `;
    });

    contentModalReenvio.innerHTML = viewContactos;
}

function searchContacto(e) {
    const buscar = e.target.value;

    obtenerContactosReenviar(buscar);
}

const reenviar_mensaje_contacto = document.getElementById('reenviar_mensaje_contacto');

reenviar_mensaje_contacto.addEventListener('click', (e) => {
    const radios = document.querySelectorAll('input[name="getContacto"]');

    let seleccionado = "";
    radios.forEach(radio => {
        if (radio.checked) {
            seleccionado = radio.value; 
        }
    });

    if(seleccionado === "") {
        alert('Seleccione un contacto para reenviar el mensaje');
        return;
    }

    const codigoMensaje = document.getElementById('codigoMensaje');
    const sendType = document.getElementById('sendType');

    e.target.disabled = true;
    e.target.textContent = 'Enviando...';

    const post = {
        codigo: codigoMensaje.value,
        contacto: seleccionado,
        sendType: sendType.value
    }

    fetch('/reenviarMensaje', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(post)
    })
    .then(res => res.json())
    .then(data => {
        e.target.disabled = false;
        e.target.textContent = 'Enviar';

        $('#modalReenvio').modal('hide');

        if(data.mensaje === 'ok') {
            Swal.fire({
                position: 'top-center',
                icon: 'success',
                title: 'Se reenvio correctamente el mensaje',
                showConfirmButton: false,
                timer: 2000
            })
        }
    })

});

//'20607393711', 'LA FINCA REGIONAL S.A.C.', 'JR. ALFONSO UGARTE  NRO. C9   SAN MARTíN -  SAN MARTíN  -  TARAPOTO', '942815322', 'lafincatarapoto@gmail.com', '1', '20607393711.png', '76', 'LA FINCA REGIONAL S.A.C.', NULL, NULL, 'LAFINCAR', 'Lafinca21', 'FINCA2021', '1', '1', '1', NULL, '0', NULL, '0', NULL, NULL, '1', '220901', NULL, '2023-11-15 15:47:43'

Notification.requestPermission().then(resultado => {
    console.log('Respuesta: ', resultado);
});

setInterval(() => {
    socket.emit('mensajes_no_respondidos', { token });
}, 300000);

socket.on('mostrar_notificaciones_chat', data => {
    if(Notification.permission === 'granted') {

        const datos = data.data;

        datos.forEach(contacto => {
            //console.log(`Responde por favor, ya paso ${contacto.dias} con ${contacto.minutos}`);
             new Notification(contacto.nameContacto, {
                icon: './img/logos/icon.png',
                body: `Responde por favor, ya paso ${contacto.dias} dias, ${contacto.horas} horas y ${contacto.minutos} minutos`
            });

        });
    
    }
})

/* contentMensaje.addEventListener('input', function() {
    this.style.height = 'auto'; // Resetea la altura
    this.style.height = (this.scrollHeight) + 'px'; // Ajusta la altura
}); */

function detectarAltoInputMensaje(textarea) {
    textarea.style.height = 'auto';

    // Luego, ajusta la altura al scrollHeight del textarea
    textarea.style.height = textarea.scrollHeight + 'px';
}

function restablecerAltoTextarea(textarea) {
    const alturaNormal = '36px';  // Cambia esto por la altura inicial deseada
    textarea.style.height = alturaNormal;
}

function detectarEnterEnElTextArea(event, textarea) {
    if (event.key === 'Enter' && !event.shiftKey) {
        // Previene el comportamiento predeterminado (insertar salto de línea)
        event.preventDefault();
        // Envía el formulario
        envioFormulario(event);
        //formMessage();

        restablecerAltoTextarea(textarea);
    }
}

function pegarImagenInput(e) {
    const datosPegados = e.clipboardData.items[0];

    if(datosPegados.type.includes('image')) {

        fileInput.value = null;
        // Acceder a la propiedad files
        fileInput.files[0] = null;

        // O reiniciar la lista
        fileInput.files.length = 0;

        const img = e.clipboardData.items[0].getAsFile();  

        if(img){
            console.log(img.name); // nombre del archivo
            console.log(img.lastModifiedDate); // fecha de modificación
            console.log(img.type); // tipo MIME
            console.log(img.size); // tamaño en bytes

            const $offcanvas = $('#myOffcanvas').offcanvas({
                backdrop: true
            });

            $offcanvas.offcanvas('show');

            // Previsualizar la imagen
            const reader = new FileReader();
            reader.onload = function() {

                $("#offcanvas-body").html('<img src="' + reader.result + '" alt="Image Preview" name="imagenCargada" style="max-width:100%; max-height: 300px;" id="imagenCargada"> <input type="text" class="form-control" name="fileDescription" id="fileDescription" placeholder="Añade un comentario" style="margin-top: 15px" />');
            }

            reader.readAsDataURL(img);
        }
    } 

    console.log(datosPegados);
}

function cerrar_ventana_chat() {
    contentChatWhatsapp.classList.remove("col-xl-5");
    contentChatWhatsapp.classList.add('col-xl-9');

    contentFiltros.style.display = "none";
}

function allEmojis(e) {
    e.preventDefault();

    const emojis = document.getElementById('emojis');

    emojis.style.display = 'block';

    fetch('/emojisAll')
    .then(res => res.json())
    .then(data => {
        console.log(data);
        const list_emojis = document.getElementById('list-emojis');

        let view = "";

        const datos = data.data;

        datos.forEach(emoji => {
            view += `<a href="javascript:void(0);" class="item-emoji" style="font-size: 24px">${emoji.character}</a>`;
        });

        list_emojis.innerHTML = view;

        print_emoji_input();
    })

}

function cerrar_ventana_emojis() {
    const emojis = document.getElementById('emojis');

    emojis.style.display = 'none';
}


function print_emoji_input() {
    const lista_emojis = document.getElementById('list-emojis');

    lista_emojis.addEventListener('click', (e) => {
        if(e.target.classList.contains('item-emoji')) {
            const inputMessage = document.getElementById('contentMensaje');
            const emoji = e.target.textContent;
            
            insertEmojiAtCursor(inputMessage, emoji);
        }
    });
}

function insertEmojiAtCursor(inputField, emoji) {
    // Obtener la posición actual del cursor en el campo de entrada
    const startPos = inputField.selectionStart;
    const endPos = inputField.selectionEnd;

    // Obtener el texto actual del campo de entrada
    const textBefore = inputField.value.substring(0, startPos);
    const textAfter = inputField.value.substring(endPos);

    // Insertar el emoji en la posición del cursor
    inputField.value = textBefore + emoji + textAfter;

    // Mover el cursor después del emoji insertado
    const newCursorPos = startPos + emoji.length;
    inputField.selectionStart = newCursorPos;
    inputField.selectionEnd = newCursorPos;

    inputField.focus();
}

function showEmojisAddContact(e) {
    const addContactEmojis = document.getElementById('addContactEmojis');

    const deletex = document.getElementById('deletex');

    deletex.innerHTML = `<a href="javascript:void(0);" id="closeEmojis" onclick="closeEmojisAddContact()" style="margin-left: 10px; color: red">X</a>`;

    addContactEmojis.style.display = 'block';

    fetch('/emojisAll')
    .then(res => res.json())
    .then(data => {

        let view = "";

        const datos = data.data;

        datos.forEach(emoji => {
            view += `<a href="javascript:void(0);" class="add-contact-item-emoji" style="font-size: 24px">${emoji.character}</a>`;
        });

        addContactEmojis.innerHTML = view;

        print_emoji_input_add_contact();
    })
}

function print_emoji_input_add_contact() {
    const addContactEmojis = document.getElementById('addContactEmojis');

    addContactEmojis.addEventListener('click', (e) => {
        if(e.target.classList.contains('add-contact-item-emoji')) {
            const variable = document.getElementById('cuerpo_variable');
            const emoji = e.target.textContent;
            
            insertEmojiAtCursor(variable, emoji);
        }
    });
}

function closeEmojisAddContact() {
    const addContactEmojis = document.getElementById('addContactEmojis');
    addContactEmojis.style.display = 'none';

    const deletex = document.getElementById('deletex');
    deletex.innerHTML = "";
}

function showItemsEmojis() {
    const listaEmojisTemplate = document.getElementById('listaEmojisTemplate');
    const closeTemplate = document.getElementById('closeTemplate');

    listaEmojisTemplate.style.display = 'block';

    closeTemplate.innerHTML = `<a href="javascript:void(0);" style="color: red; margin-left: 15px" onclick="closeEmojisTemplate(event)"> X </a>`;

    fetch('/emojisAll')
    .then(res => res.json())
    .then(data => {

        let view = "";

        const datos = data.data;

        datos.forEach(emoji => {
            view += `<a href="javascript:void(0);" class="template-item-emoji" style="font-size: 24px">${emoji.character}</a>`;
        });

        listaEmojisTemplate.innerHTML = view;

        print_emoji_input_template();
    })
}

function closeEmojisTemplate() {
    const listaEmojisTemplate = document.getElementById('listaEmojisTemplate');
    const closeTemplate = document.getElementById('closeTemplate');

    closeTemplate.innerHTML = '';
    listaEmojisTemplate. style.display = 'none';

}

function print_emoji_input_template() {
    const listaEmojisTemplate = document.getElementById('listaEmojisTemplate');

    listaEmojisTemplate.addEventListener('click', (e) => {
        if(e.target.classList.contains('template-item-emoji')) {
            const variable = document.getElementById('contentVariable');
            const emoji = e.target.textContent;
            
            insertEmojiAtCursor(variable, emoji);
        }
    });
}

function deleteContacto(numero) {
    Swal.fire({
        title: "¿Desea eliminar este contacto?",
        text: "¡No podrás revertir esto.!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {

            fetch('/deleteContact/'+numero, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {
                if(data.message === 'ok') {
                    
                    Swal.fire({
                        position: "top-center",
                        icon: "success",
                        title: "Contacto eliminado correctamente",
                        showConfirmButton: false,
                        timer: 1500
                    });

                    socket.emit('deleteContact', { contacto: numero });

                } else {
                    Swal.fire({
                        position: "top-end",
                        icon: "danger",
                        title: "Ocurrio un error",
                        showConfirmButton: false,
                        timer: 2500
                    });
                }
            });
        }
    });
}

socket.on('updateMessageQuanty', data => {
    const numero = data.numero
    if(document.getElementById('cantidad-message-'+numero)) {
        document.getElementById('cantidad-message-'+numero).remove();
    }

});

socket.on('updateDeleteListContact', data => {
    const numero = data.contacto;

    if(document.getElementById('item-contacto-'+numero)) {
        const deleteItem = document.getElementById('item-contacto-'+numero);
        deleteItem.remove();
    }
});

function detectarScrollChat(numero) {
    const scroll = document.getElementById('conversation-'+numero);

    scroll.addEventListener('scroll', (e) => {
        socket.emit( 'updateQuantyMessageAll', { numero: numero } );
    });
}

const view_plataforma = document.getElementById('view_plataforma');

plataforma.addEventListener('change', (e) => {
    const valor = e.target.value;

    if(valor === '4') {
        viewPlataformaPublicidad();
        return;
    }

    if(valor === '1') {
        viewPlataformaDirectoWhatsapp();
        return;
    }

    view_plataforma.innerHTML = "";

});

function viewPlataformaPublicidad() {
    let html = `
    <div class="col-md-6">
        <div class="mb-3">
            <label for="tipo_contacto" class="col-form-label">Tipo Publicidad:</label>
            <select name="tipo_publicidad" id="tipo_publicidad" class="form-select" onchange="elegirTipoPublicidad(event)" required="">
                <option value="">Seleccione...</option>
                <option value="1">Publicidad Paga Facebook</option>
                <option value="2">Publicidad Orgánica Facebook</option>
            </select>
        </div>
    </div>

    <div class="col-md-6" id="publicidadFacebook">

    </div>
    `;

    view_plataforma.innerHTML = html;
}

function elegirTipoPublicidad(e) {

    const publicidadFacebook = document.getElementById('publicidadFacebook');
    const valor = e.target.value;

    if (valor === '1') {

        fetch('/allPublicidad')
        .then(res => res.json())
        .then(data => {
            if(data.message === 'ok') {

                const datos = data.data;

                let options = `<option value="">Seleccione...</option>`;

                datos.forEach(pub => {
                    options += `<option value="${pub.id}">${pub.codigo} - ${pub.nombre}</option>`;
                });

                let html = `
                <div class="mb-3">
                    <label for="tipo_contacto" class="col-form-label">Publicidad Facebook:</label>
                        <select name="publicidad_facebook" id="publicidad_facebook" class="form-select" required="">
                        ${options}
                    </select>
                </div>
                `;

                publicidadFacebook.innerHTML = html;
            }
        })

        
    } else {
        publicidadFacebook.innerHTML = "";
    }
}

function viewPlataformaDirectoWhatsapp() {

    fetch('/allWhatsapp')
    .then(res => res.json())
    .then(data => {
        let options = "";

        if(data.message === 'ok') {
            const datos = data.data;

            datos.forEach(numero => {
                if(numero.status == 1) {
                    options += `<option value="${numero.id}">${numero.numero} - ${numero.nombre}</option>`;
                }
                
            });

        }

        let html = `
        <div class="col-md-6">
            <div class="mb-3">
                <label for="tipo_contacto" class="col-form-label">Numeros de Whatsapp:</label>
                <select name="numeros_whatsapp" id="numeros_whatsapp" class="form-select" onchange="elegirNumero(event)" required="">
                    <option value="">Seleccione...</option>
                    ${options}
                </select>
            </div>
        </div>

        <div class="col-md-6" id="publicidadFacebook">

        </div>
        `;

        view_plataforma.innerHTML = html;
    })
    
}

function elegirNumero(e) {
    let html = `
        <div class="mb-3">
            <label for="tipo_contacto" class="col-form-label">Tipo:</label>
            <select name="publicidad_facebook" id="publicidad_facebook" class="form-select" required="">
                <option value="">Seleccione</option>
                <option value="1">Recomendados</option>
                <option value="2">Recompra</option>
                <option value="3">Directo</option>
                <option value="4">Publicidad Online</option>
                <option value="5">Otros</option>
            </select>
        </div>
        `;

    publicidadFacebook.innerHTML = html;
}

const formSeguimiento = document.getElementById('formSeguimiento');
const viewfechaNotificar = document.getElementById('viewfechaNotificar');

function modalSeguimiento(numero, contacto) {
    $("#modalSeguimiento").modal('show');

    const titleSeguimiento = document.getElementById('titleSeguimiento');
    titleSeguimiento.textContent = 'Agregar Seguimiento | ' + numero + ' - ' + contacto;
    
    const wcontacto = document.getElementById('wcontacto');
    wcontacto.value = numero;

    formSeguimiento.reset();
    viewfechaNotificar.innerHTML = "";

    vistaDescription(numero);
}

function modalEnvioPdf(number_whatsapp) {
    const num = document.getElementById('numWhat');
    num.value = number_whatsapp;

    $("#modalEnvioPdf").modal('show');
}

formSeguimiento.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(formSeguimiento);

    const wcontacto = document.getElementById('wcontacto');

    const formDataObj = {};

    formData.forEach((value, key) => {
        formDataObj[key] = value;
    });

    fetch('/add-seguimiento', {
        method: 'POST',
        body: JSON.stringify(formDataObj),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(res => res.json())
    .then(data => {
        if(data.message === 'ok') {
            formSeguimiento.reset();
            viewfechaNotificar.innerHTML = "";
            vistaDescription(wcontacto.value);
            alert('Se agrego correctamente el seguimiento');
        } else {
            alert('Ocurrio un error');
        }
    })
})

function fechaNotificar(e) {

    let html = "";

    if (e.target.checked) {
        html += `
        <div class="mb-3">
            <label for="notificar_fecha" class="col-form-label">Fecha:</label>
            <input type="date" class="form-control" id="notificar_fecha" name="notificar_fecha">
        </div>
        `;
    }

    viewfechaNotificar.innerHTML = html;
}

function vistaDescription(numero) {
    fetch('/all-seguimientos/'+numero)
    .then(res => res.json())
    .then(data => {
        if(data.message === 'ok') {
            const bodySeguimientos = document.getElementById('bodySeguimientos');

            const perfil = document.getElementById('rol_user');

            let html = "";

            const datos = data.response;

            datos.forEach((seg, index) => {

                let fechaHora = new Date(seg.createdAt);
                fecha = fechaHora.toLocaleDateString('es-ES');

                let hora = fechaHora.toLocaleTimeString('es-ES');

                let btnDelete = "";

                if (perfil.value != 2 && perfil.value != 6) {
                    btnDelete += `
                        <button type="button" class="btn btn-danger btn-sm" onclick="deleteSeguimiento(${seg.id}, '${numero}')"><i class="bi bi-trash"></i></button>
                    `;
                }


                html += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${seg.description}</td>
                        <td>${fecha} ${hora}</td>
                        <td>
                            ${btnDelete}
                        </td>
                    </tr>
                `;
            });

            bodySeguimientos.innerHTML = html;
        }
    })
}

function deleteSeguimiento(id, numero) {
    Swal.fire({
        title: "¿Está seguro?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, bórralo!"
      }).then((result) => {
        if (result.isConfirmed) {
            fetch('/delete-seguimiento/'+id)
            .then(res => res.json())
            .then(data => {
                if(data.message === 'ok') {
                    Swal.fire({
                        position: "top-center",
                        icon: "success",
                        title: "Eliminado correctamente",
                        showConfirmButton: false,
                        timer: 1500
                    });

                    vistaDescription(numero);
                } else {
                    alert(data.response);
                }
            })
        }
      });
}

function reenviarTemplate(idChat) {
    fetch('/chatId/'+idChat)
    .then(res => res.json())
    .then(data => {
        if(data.message === 'ok') {
            Swal.fire({
                position: "top-center",
                icon: "success",
                title: "Enviado correctamente",
                showConfirmButton: false,
                timer: 1500
            });

            const codigo = data.data;

            updateIconoCheck(codigo);

        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "No se envio la plantilla, intente nuevamente!",
            });
        }
    })
}

function updateIconoCheck(codigo) {
    fetch('/statusMessageCodigo/'+codigo)
    .then(res => res.json())
    .then(data => {
        if(data.message === 'ok') {

        }
    })
}

//para las interacciones por fechas
const interaccionesContact = document.getElementById('interaccionesContact');
interaccionesContact.addEventListener('click', (e) => {
    console.log("hola");

    contentChatWhatsapp.classList.remove("col-xl-9");
    contentChatWhatsapp.classList.add('col-xl-5');

    contentFiltros.style.display = "block";

    // Agregar transición
    contentFiltros.style.transition = "opacity 0.5s ease";
    contentFiltros.style.opacity = 0;

    // Se muestra suavemente
    setTimeout(() => {
        contentFiltros.style.opacity = 1; 
    }, 50);

    viewInteracciones();
});

function viewInteracciones() {
    let view = `
    <h4 class="mb-3">Filtro de Contactos - Interacciones</h4>
        <div class="row">
            <div class="col-md-6">
                <div class="mb-1">
                    <label class="form-label" for="dateInit">Fecha Inicio</label>
                    <input type="date" class="form-control" id="fechaInicio">
                </div>
            </div>
            <div class="col-md-6">
                <div class="mb-1">
                    <label class="form-label" for="dateEnd">Fecha Fin</label>
                    <input type="date" class="form-control" id="fechaFin">
            </div>
        </div>
        <div class="col-md-6">
            <div class="mb-1">
                <button type="button" class="btn btn-primary mt-3" id="consultarInteracciones" onclick="consultarInteracciones(event)">Consultar</button>
            </div>
        </div>
    </div>

    <div class="row" id="content_filtro" style="overflow-y: scroll;max-height: 500px;position: relative;">

    </div>
    `;

    contentFilterContact.innerHTML = view;
}

function consultarInteracciones(e) {
    const fechaInicio = document.getElementById('fechaInicio');
    const fechaFin = document.getElementById('fechaFin');

    if(fechaInicio.value === "") {
        return alert('seleccione una fecha de inicio');
    }

    if(fechaFin.value === "") {
        return alert('seleccione una fecha de fin');
    }

    if(fechaInicio.value > fechaFin.value) {
        return alert('La fecha de inicio debe ser menor o igual a la fecha de fin');
    }

    const post = {
        fecha_inicio: fechaInicio.value,
        fecha_fin: fechaFin.value
    };

    fetch("/interacciones", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(post)
    })
        .then(res => res.json())
        .then(data => {
            console.log(data);

            if(data.message === 'ok') {
                viewInteraccionesData(data.data);
            } else {
                alert(data.message);
            }

            
        })
}

function viewInteraccionesData(data) {
    const content_ = document.getElementById('content_filtro');

    let datos = "";

    data.forEach(contact => {
        datos += `
        <tr>
            <td><a href="#">${contact.from}</a></td>
            <td>${contact.nameContact}</td>
            <td>${contact.etiqueta}</td>
        </tr>
        `;
    });

    let html = `
    <table class="table" id="tableInteracciones">
        <thead>
            <tr>
                <th>Número</th>
                <th>Nombre</th>
                <th>Etiqueta</th>
            </tr>
        </thead>

        <tbody>
            ${datos}
        </tbody>
    </table>
    `;
    
    content_.innerHTML = html;

    $("#tableInteracciones").DataTable();
}

const search_chat_list = document.getElementById('search-chat-list');
const search_contactos_chat = document.getElementById('search-contactos-whatsapp');

search_chat_list.addEventListener('keyup', (e) => {
    const buscar = e.target.value;
    
    if (buscar.length >= 3) {
        contactos.setAttribute('hidden', true);
        search_contactos_chat.removeAttribute('hidden');

        renderSearchMessage(buscar);

    } else {
        search_contactos_chat.setAttribute('hidden', true);
        contactos.removeAttribute('hidden');
    }
});

function renderSearchMessage(buscar) {
    fetch('/searchMessage/'+buscar, {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(data => {
        
        const listSearch = document.getElementById('listSearch');

        let viewSearch = "";

        if(data.message === 'ok') {
            if(data.contactos.length > 0) {

                viewSearch += `<h5>CHAT</h5>`;
                viewSearch += viewListChatContact(data.contactos, 1);
                
            }

            if(data.messages.length > 0) {

                viewSearch += `<h5>MENSAJES</h5>`;
                viewSearch += viewListChatContact(data.messages, 0);
                
            }
        }

        console.log(data.messages);

        listSearch.innerHTML = viewSearch;
    })
}

const closeSearch = document.getElementById('closeSearch');

closeSearch.addEventListener('click', (e) => {
    search_chat_list.value = "";
    search_contactos_chat.setAttribute('hidden', true);
    contactos.removeAttribute('hidden');
});

const pdfenviar = document.getElementById('enviar_template_pdf');

pdfenviar.addEventListener('click', (e) => {
    const numero = document.getElementById('numWhat');
    const archivo = document.getElementById('archivo_pdf');
    const variable = document.getElementById('variabletext');

    if(archivo.files.length === 0) {
        return alert('seleccione un archivo pdf');
    }

    if(variable.value === "") {
        return alert('ingrese el contenido de la plantilla');
    }

    pdfenviar.disabled = true;
    pdfenviar.textContent = "Enviando...";
    
    const formData = new FormData();
    formData.append('numero', numero.value);
    formData.append('variable', variable.value);
    formData.append('archivo', archivo.files[0]);

    fetch("/enviopdf", {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        pdfenviar.disabled = false;
        pdfenviar.textContent = "Enviar";

        if(data.message === 'ok') {
            $("#modalEnvioPdf").modal('hide');
            Swal.fire({
                position: 'top-center',
                icon: 'success',
                title: 'Se envio correctamente la plantilla',
                showConfirmButton: false,
                timer: 2000
            })

            archivo.value = "";
            variable.value = "";

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se pudo enviar la plantilla!'
            })
        }
    })

})

const embudoCliente = document.getElementById('embudoCliente');

embudoCliente.addEventListener('change', (e) => {
    const valor = e.target.value;

    fetch('/getEtiquetaEmbudo/'+valor)
    .then(res => res.json())
    .then(data => {
        const eti = data.etiquetas;
        let html = `<option value="">Seleccionar...</option>`;

        const etiquetaCliente = document.getElementById('etiquetaCliente');

        eti.forEach(etiqueta => {
            html += `<option value="${etiqueta.id}">${etiqueta.descripcion}</option>`;
        });

        etiquetaCliente.innerHTML = html;

        
    })
})