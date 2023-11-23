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

            loadContact();
        })
}

let listenerFile = false;

function fileWhatsapp() {
    document.getElementById("fileInput").click();

    const $offcanvas = $('#myOffcanvas').offcanvas({
        backdrop: false
    });

    if(!listenerFile) {
        fileInput.addEventListener('change', (event) => {
        
            $offcanvas.offcanvas('show');
    
            let file = event.target.files[0];
            console.log(file.type);
    
            if (file) {
                let reader = new FileReader();
    
                reader.onload = function (event) {
                    // Mostrar la vista previa de la imagen dentro del div
                    if (file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'image/gif' || file.type == 'image/webp' || file.type == 'image/svg+xml') {
                        $("#offcanvas-body").html('<img src="' + event.target.result + '" alt="Image Preview" style="max-width:100%; max-height: 300px;"> <input type="text" class="form-control" name="fileDescription" id="fileDescription" placeholder="Añade un comentario" style="margin-top: 15px" />');
                    }
    
                    if (file.type == 'video/mp4' || file.type === 'video/webm') {
                        $("#offcanvas-body").html('<video controls style="max-width:100%; max-height: 300px;"><source src="' + event.target.result + '" type="'+file.type+'">Your browser does not support the video tag.</video> <input type="text" class="form-control" name="fileDescription" id="fileDescription" placeholder="Añade un comentario" style="margin-top: 15px" />');
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
    document.getElementById("fileInput").click();

    const $offcanvas = $('#myOffcanvas').offcanvas({
        backdrop: false
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

    socket.emit('getToken', { token: token, from: data.from, rol: rol.value, iduser: iduser.value, sonido: false, etiqueta: filterEtiqueta.value, plataforma_id: plataforma_id.value });

});

socket.on("messageContacts", data => {
    if(data.rol == 2) {
        if(data.id == iduser.value) {
            viewContact(data);
        }
    } else {
        if(data.rol == rol.value) {
            viewContact(data);
        }
    }

});


filterEtiqueta.addEventListener('change', (e) => {
    loadContact();
});

plataforma_id.addEventListener('change', (e) => {
    loadContact();
});

function loadContact() {
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

function viewContact(data) {
    let html = "";
    const datos = data.data;
    const rol = data.rol;

    datos.forEach(contact => {
        let hourMessage = formatDate(contact.time);

        let countMessage = "";
        let asistente = "";

        if (contact.cantidad > 0) {
            countMessage = `<span class="float-end badge bg-danger text-white">${contact.cantidad}</span>`;
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
                checkMessage = `<i class="bi bi-check ms-1" style="font-size: 16px"></i>`;
            } else {
                if(contact.statusMessage == 'delivered') {
                    checkMessage = `<i class="bi bi-check-all ms-1" style="font-size: 16px"></i>`;
                } else {
                    if (contact.statusMessage == 'read') {
                        checkMessage = `<i class="bi bi-check-all ms-1 text-primary" style="font-size: 16px"></i>`;
                    } else {
                        checkMessage = `<i class="bi bi-exclamation-circle ms-1 text-danger" style="font-size: 16px"></i>`;
                    }
                }
            }

        }

        let nameContact = contact.contact;
        nameContact = nameContact.replace("'", "");

        html += `
        <a href="javascript:void(0);" class="text-body" onclick="chatDetail('${contact.numero}','${nameContact}', '${contact.etiqueta}', ${contact.potencial_id}, ${contact.etiqueta_id}, ${rol}, ${contact.idAsistente}, '${contact.asistente}')">
            <div class="d-flex align-items-start p-2">
                <div class="position-relative">
                    <span class="user-status"></span>
                    <img src="img/logos/icon.png" class="me-2 rounded-circle" height="48" alt="Michael H" />
                </div>
                <div class="w-100 overflow-hidden">
                    ${asistente}
                    <h5 class="mt-0 mb-0 fs-14">
                        <span class="float-end text-muted fs-12">${hourMessage}</span>
                        ${contact.contact}
                    </h5>
                    <p class="mt-1 mb-0 text-muted fs-14">
                        ${countMessage}
                        <span class="text-dark" style="display: inline-block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width: 220px;">${checkMessage}${mensaje}</span>
                    </p>
                </div>
            </div>
        </a>
        `;
    });

    contactos.innerHTML = html;
}

loadContact();

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

function chatDetail(numero, name, etiqueta, potencial, etiqueta_id, rol, asignado, asistente) {

    let asignar = "";
    let asist = ""

    if(rol === 1 || rol === 3) {
        asignar = `<a class="dropdown-item" href="javascript: void(0);" onclick="asignarChat(${potencial}, ${asignado})"><i
        class="bi bi-search fs-18 me-2" ></i>Asignar</a>`;
        asist = `<span class="text-primary">${asistente}</span>`;
    }

    let html = `
    <div class="d-flex pb-2 border-bottom align-items-center">
        <img src="img/logos/icon.png" class="me-2 rounded-circle" height="48" alt="Cliente" />
        <div>
            <h5 class="mt-0 mb-0 fs-14" id="nameContacto">${name}</h5>
            <p class="mb-0" id="numberWhatsapp">${numero}</p>
            ${asist}
            <input type="hidden" id="whatsappNumber" value="${numero}">
            <input type="hidden" id="potencialId" value="${potencial}">
        </div>
        <div class="flex-grow-1">
            <ul class="list-inline float-end mb-0">
                <li class="list-inline-item fs-18 me-3 dropdown">
                    <span class="badge badge-soft-success py-1" id="etiquetaTitle">${etiqueta}</span>
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
                        <a class="dropdown-item" href="javascript: void(0);" onclick="etiquetaCliente(${potencial}, ${etiqueta_id})"><i
                                class="bi bi-music-note-list fs-18 me-2"></i>Etiqueta</a>
                        ${asignar}
                        
                    </div>
                </li>
            </ul>
        </div>
    </div>
    <div class="mt-1" id="contentChat">
        <ul class="conversation-list px-0 h-100" data-simplebar
            style="min-height: 405px; max-height: 405px; overflow: hidden scroll;" id="conversation-${numero}">


        </ul>
        <div class="mt-2 bg-light p-3 rounded">
            
            <form class="needs-validation" novalidate="" name="chat-form" id="chat-form">
                <input type="hidden" name="numberWhat" value="${numero}">
                <div id="responderMessage">
                    
                </div>
                <div class="row">
                    <div class="col mb-2 mb-sm-0">
                        <input type="text" class="form-control border-0" name="mensaje_form"
                            placeholder="Ingrese el mensaje" required="" id="contentMensaje">
                        <ul id="listaSugerencias"></ul>
                        <div class="" id="horas_transcurridas" style="display:none; text-align:center;">
                            <span class="hora-estilo">01:45:30 H </span>
                        </div>
                    </div>
                    <div class="col-sm-auto">
                        <div class="btn-group">
                            <a href="#" class="btn btn-light"><i class="bi bi-emoji-smile fs-18"></i></a>
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

    formMessage();
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

    /*const audio = new Audio('./audios/whatsapp/whatsapp-campana.mp3');
    audio.volume = 0.5;
    audio.play();*/

    socket.emit('getToken', { token: token, from: data.from, rol: rol.value, iduser: iduser.value, sonido: true, etiqueta: filterEtiqueta.value, plataforma_id: plataforma_id.value });

    let fecha_y_hora = convertTimestampToDate(data.timestamp);

    if (data.from != '51938669769') {
        switch (data.typeMessage) {
            case "text":
                let text = viewFromText(data, fecha_y_hora);
                const lista = $("#conversation-" + data.from);
                lista.append(text);
                break;

            case "image":
                let image = viewFromImage(data, fecha_y_hora);
                const listaImage = $("#conversation-" + data.from);
                listaImage.append(image);
                break;
            case "video":
                let video = viewFromVideo(data, fecha_y_hora);
                const listaVideo = $("#conversation-" + data.from);
                listaVideo.append(video);
                break;
            case "document":
                let document = viewFromDocument(data, fecha_y_hora);
                const listaDocument = $("#conversation-" + data.from);
                listaDocument.append(document);
                break;
            case "audio":
                let audio = viewFromAudio(data, fecha_y_hora);
                const listaAudio = $("#conversation-" + data.from);
                listaAudio.append(audio);
                break;
            default:
                break;
        }
    } else {
        switch (data.typeMessage) {
            case "text":
                let text = viewReceipText(data, fecha_y_hora);
                const lista = $("#conversation-" + data.receipt);
                lista.append(text);
                break;

            case "image":
                let image = viewReceipImage(data, fecha_y_hora);
                const listaImage = $("#conversation-" + data.receipt);
                listaImage.append(image);
                break;
            case "video":
                let videoRec = viewReceipVideo(data, fecha_y_hora);
                const listaVideo = $("#conversation-" + data.receipt);
                listaVideo.append(videoRec);
                break;
            case "document":
                let documentRec = viewReceipDocument(data, fecha_y_hora);
                const listaDoc = $("#conversation-" + data.receipt);
                listaDoc.append(documentRec);
                break;
            case "audio":
                let audioRec = viewReceipAudio(data, fecha_y_hora);
                const listaAudio = $("#conversation-" + data.receipt);
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
                        <p id="${data.codigo}" style="padding: 5px 10px 5px 10px;">${data.message}</p>                                
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

function viewFromImage(data, hora) {
    let html = `
            <li class="clearfix">
                <div class="conversation-text ms-0">
                    <div class="d-flex">
                        <div class="card mb-1 shadow-none border text-start ctext-wrap">
                            <div class="p-2">
                                <div class="row align-items-center">
                                    <div class="col-auto">
                                        <img src="${dominio}/img/archivos/${data.id_document}.jpg" alt="" height="150" onclick="openFullscreen(this)">
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
                                <i class="bi bi-trash fs-18 me-2"></i>Delete
                            </a>   
                            <a class="dropdown-item" href="#">
                                <i class="bi bi-files fs-18 me-2"></i>Copy
                            </a>                                                                            
                        </div>
                    </div>  
                    <div class="ctext-wrap">
                        ${resp}
                        <p id="${data.codigo}">${data.message}</p>
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
                                        <img src="${dominio}/img/archivos/${data.filename}" alt="" height="150" onclick="openFullscreen(this)">
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

                /*fetch("http://157.230.239.170:4000/addMessageChat", requestOptions)
                    .then(response => response.text())
                    .then(result => console.log(result))
                    .catch(error => console.log('error', error));

                listConversation(contentMensaje.value, whatsappNumber.value);*/

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

function viewProfle() {
    $("#viewProfile").modal("show");
}

const enviarImagen = document.getElementById("enviarImagen");

enviarImagen.addEventListener('click', (e) => {
    let file = fileInput.files[0];

    const numero = document.getElementById("whatsappNumber");
    const fileDescription = document.getElementById('fileDescription');

    if (file) {
        e.target.disabled = true;
        e.target.textContent = 'Enviando Mensaje...';

        let formData = new FormData();
        formData.append('imagen', file);
        formData.append('numero', numero.value);
        formData.append('description', fileDescription.value);

        //console.log(file.type);

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

function etiquetaCliente(potencial, etiqueta) {
    $("#modalEtiqueta").modal("show");

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
            alert('Se cambio correctamente de etiqueta');
        } else {
            alert('Comunicar con el administrador');
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
            alert('Se asigno correctamente');
        } else {
            alert('Comunicar con el administrador');
        }
    })

});

//Agregar Contacto
const newContacto = document.getElementById('newContact');
const btnAgregar = document.getElementById('btnNuevoContacto');

const plataforma = document.getElementById('plataforma_contacto');
const platform = document.getElementById('platform');

renderOptionPlataforma(platform, 0);

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

    if(selectedPlantilla.value == "") {
        alert('Seleccione una plantilla');
        return false;
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
            variables: inputVariables
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
                alert('Comunicar con el administrador');
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
            html += `
            <div class="d-flex border-top pt-2" style="cursor: pointer" onclick="itemContact(${contact.numero}, '${contact.name}', '${contact.nameEtiqueta}', ${contact.potencial}, ${contact.etiqueta_id}, ${contact.rol}, ${contact.asistente}, '${contact.nameAsistente}')">
                <img src="img/logos/icon.png" class="avatar rounded me-3" alt="shreyu">
                <div class="flex-grow-1">
                    <h5 class="mt-1 mb-0 fs-15">${contact.name}</h5>
                    <h6 class="text-muted fw-normal mt-1 mb-2">${contact.numero}</h6>
                </div>
                <div class="dropdown align-self-center float-end">
                    <span class="text-primary">${contact.nameAsistente}</span>
                </div>
            </div>
            `;
        });

        lista.innerHTML = html;
    })
}

function itemContact(numero, nameWhatsapp, etiqueta, potencial, etiqueta_id, rol, asistente, nameAsistente) {
    console.log('hola');

    $("#modalContacts").modal('hide');

    chatDetail(numero, nameWhatsapp, etiqueta, potencial, etiqueta_id, rol, asistente, nameAsistente);
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
                        <img src="${data.plantilla.url_cabecera}" />
                    </div>
                </div>
                `;
            }
        }

        const variables = data.variables;

        variables.forEach(variable => {
            inputVariable += `
            <input type="text" class="form-control input-content-variable" placeholder="Ingrese el contenido de la variable" value="" id="contentVariable">
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
            <label for="cuerpo_" class="col-form-label">Variables:</label>
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
    const contentVariable = document.getElementById('contentVariable');
    const numberWhat = document.getElementById('whatsappNumber');

    const inputs = document.querySelectorAll('.input-content-variable');

    let contenidoVariable = "";

    if(contentVariable) {
        contenidoVariable = contentVariable.value;
    }

    const inputVariables = [];

    inputs.forEach(input => {
        inputVariables.push(input.value);
    });

    e.target.disabled = true;

    fetch('/sendPlantilla', {
        method: 'POST',
        body: JSON.stringify({
            idPlantilla: idPlantilla,
            contentVariable: contenidoVariable,
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
        e.target.disabled = true;
        if (data.message === 'ok') {
            $("#modalEditarContacto").modal('hide');
            Swal.fire({
                position: 'top-center',
                icon: 'success',
                title: 'Se edito correctamente el contacto',
                showConfirmButton: false,
                timer: 2000
            })

            chatDetail(data.data.from,data.data.nameContact, data.datos.etiqueta, data.datos.potencial_id, data.datos.etiqueta_id, data.datos.rol, data.datos.idAsistente, data.datos.nameAsistente);

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
            <div class="mb-3">
                <label for="plantillaNuevo" class="col-form-label">Plantilla:</label>
                <select name="plantillaNuevo" id="plantillaNuevo" onchange="plantillaSelect(event)" class="form-select">
                    <option value="">Seleccione...</option>
                    ${optionPlantilla}
                </select>
            </div>
        </div>
        `;

        dataPlantilla.innerHTML = data_platilla;
    })
});


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

    fetch('/getPlantilla/'+id)
    .then(res => res.json())
    .then(data => {

        const variables = data.variables;

        const contentPlantilla = document.getElementById('contentPlantilla');

        let existeVariables = "";

        if(variables.length > 0) {

            let varian = "";

            variables.forEach(variable => {
                let dinamico = "";

                if(data.plantilla.id == 3) {
                    dinamico = `<input type="text" class="form-control variables" placeholder="Esto es dinamico" value="" id="cuerpo_variable" readonly>`;
                } else {
                    dinamico = `<input type="text" class="form-control variables" placeholder="Ingrese el contenido de la variable" value="" id="cuerpo_variable">`;
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
                <label for="cuerpo_variable" class="col-form-label">Variables:</label>
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
        } else {
            if (dataStatus.status === 'delivered') {
                icono = `<i class="bi bi-check-all ms-1" style="font-size: 16px"></i>`;
            } else {
                if (dataStatus.status === 'read') {
                    icono = `<i class="bi bi-check-all ms-1 text-primary" style="font-size: 16px"></i>`;
                } else {
                    icono = `<i class="bi bi-exclamation-circle ms-1 text-danger" style="font-size: 16px"></i>`;
                }
            }
        }

    } else {
        icono = `<i class="bi bi-check ms-1" style="font-size: 16px"></i>`;
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
    })

});

//filter contacto
const filterContacto = document.getElementById('filterContacto');
const consultarFiltro = document.getElementById('consultarFiltro');

filterContacto.addEventListener('click', (e) => {
    e.preventDefault();

    $('#offcanvasLeft').offcanvas('show');
})

consultarFiltro.addEventListener('click', (e) => {
    e.preventDefault();

    const dateInit = document.getElementById('dateInit');
    const dateEnd = document.getElementById('dateEnd');
    const platf = document.getElementById('platform');

    const post = {
        dateInit: dateInit.value,
        dateEnd: dateEnd.value,
        plataforma: platf.value
    };

    fetch("/filtroContact", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(post)
    })
    .then(res => res.json())
    .then(data => {
        if(data.message === 'ok') {
            viewFilterContacts(data);
        } else {
            alert('ocurrio un error');
        }
    })
});

function viewFilterContacts(data) {
    const content_filtro = document.getElementById('content_filtro');

    let tbody = "";

    const datos = data.data;

    datos.forEach(contact => {
        let register = "";

        if(contact.user_register == 0) {
            register = "Software";
        }

        tbody += `
        <tr>
            <td>${contact.nameContact}</td>
            <td>${contact.from}</td>
            <td>${contact.createdAt}</td>
            <td>${register}</td>
        </tr>
        `;
    });

    let htmlTable = `
    <div class="table-responsive table-nowrap mt-3">
        <table class="table table-sm table-centered mb-0 fs-13">
            <thead class="table-light">
                <tr>
                    <th>Contacto</th>
                    <th style="width: 30%;">Whatsapp</th>
                    <th style="width: 30%;">Fecha</th>
                    <th>Registrado</th>
                </tr>
            </thead>
            <tbody>
                ${tbody}
            </tbody>
        </table>
    </div>
    `;

    content_filtro.innerHTML = htmlTable;
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
        sendType: sendType
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

