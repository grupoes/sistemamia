const urlchat = document.getElementById('chaturl');

var socket = io(urlchat.value);

const contactos = document.getElementById('contactos-whatsapp');

const cardBody = document.querySelector("#cardBody");

function listConversation(mensaje, numero) {
    let html = `
    <li class="clearfix odd">
        <div class="conversation-text ms-0">
            <div class="d-flex justify-content-end">
                <div class="conversation-actions dropdown dropstart">
                    <a href="javascript: void(0);" class="text-dark pe-1" data-bs-toggle="dropdown" aria-expanded="false"><i class='bi bi-three-dots-vertical fs-14'></i></a>                
                    <div class="dropdown-menu">
                        <a class="dropdown-item" href="#">
                            <i class="bi bi-reply fs-18 me-2"></i>Reply
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
                    <p>${mensaje}</p>
                </div>
            </div>
            <p class="text-muted fs-12 mb-0 mt-1">8:27 am<i class="bi bi-check2-all ms-1 text-success"></i></p>
        </div>
    </li>
    `;

    $("#conversation-" + numero).append(html);

}


function getAllContactos() {
    fetch('/all-clientes-potenciales')
        .then(res => res.json())
        .then(data => {
            const datos = data.data;
            let html = "";

            datos.forEach(contact => {
                html += `
            <a href="javascript:void(0);" class="text-body" onclick="chatContacto(${contact.numero_whatsapp}, '${contact.nombres} ${contact.apellidos}')">
                <div class="d-flex align-items-start p-2">
                    <div class="position-relative">
                        <span class="user-status"></span>
                        <img src="assets/images/users/avatar-1.jpg" class="me-2 rounded-circle" height="48"
                            alt="Brandon Smith" />
                    </div>
                    <div class="w-100 overflow-hidden">
                        <h5 class="mt-0 mb-0 fs-14">
                            <span class="float-end text-muted fs-12">5:30am</span>
                            ${contact.nombres} ${contact.apellidos}
                        </h5>
                        <p class="mt-1 mb-0 text-muted fs-14">
                            <span class="float-end badge bg-danger text-white">3</span>
                            <span class="w-75 text-dark">una consulta?</span>
                        </p>
                    </div>
                </div>
            </a>
            `;
            });

            contactos.innerHTML = html;
        })
}

function chatContacto(whatsapp, nameContacto) {
    const nameContact = document.getElementById('nameContacto');
    const numberWhatsapp = document.getElementById('numberWhatsapp');
    const whatsappNumber = document.getElementById('whatsappNumber');

    nameContact.textContent = nameContacto;
    numberWhatsapp.textContent = whatsapp;
    whatsappNumber.value = whatsapp;

    mostrar_chat(whatsapp);

}

function mostrar_chat(numero) {
    fetch('/messageNumber/' + numero)
        .then(res => res.json())
        .then(data => {
            let html = "";

            const conversation = document.getElementById('conversation-' + numero);

            if (!Array.isArray(data)) {
                conversation.innerHTML = html;
            }

            data.forEach(msj => {
                let fecha_y_hora = convertTimestampToDate(msj.timestamp);

                if (msj.from != '51927982544') {
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

                    switch (msj.typeMessage) {
                        case "text":
                            html += viewReceipText(msj, fecha_y_hora);
                            break;
            
                        case "image":
                            html += viewReceipImage(msj, fecha_y_hora);
                            break;
                        /*case "video":
                            viewReceipVideo(msj, fecha_y_hora);
                            break;
                        case "document":
                            viewReceipDocument(msj, fecha_y_hora);
                            break;
                        case "audio":
                            viewReceipAudio(msj, fecha_y_hora);
                            break;*/
                        default:
                            break;
                    }

                }
            });

            conversation.innerHTML = html;

            grabarAudio();
        })
}

function loadNumber() {
    fetch('/numeroWhatsapp')
        .then(res => res.json())
        .then(data => {
            let html = "";
            data.forEach(contact => {


                html += `
            <a href="javascript:void(0);" class="text-body" onclick="chatContacto(${contact.from}, '')">
                <div class="d-flex align-items-start p-2">
                    <div class="position-relative">
                        <span class="user-status"></span>
                        <img src="assets/images/users/avatar-1.jpg" class="me-2 rounded-circle" height="48"
                            alt="Brandon Smith" />
                    </div>
                    <div class="w-100 overflow-hidden">
                        <h5 class="mt-0 mb-0 fs-14">
                            <!--<span class="float-end text-muted fs-12">5:30am</span>-->
                            ${contact.nameContact}
                        </h5>
                        <p class="mt-1 mb-0 text-muted fs-14">
                            <!--<span class="float-end badge bg-danger text-white">3</span>-->
                            <span class="w-75 text-dark">....</span>
                        </p>
                    </div>
                </div>
            </a>
            `;
            });

            contactos.innerHTML = html;
        })
}



/*document.querySelector("#fileWhatsapp").addEventListener("click", function () {
    document.getElementById("fileInput").click();
});*/

function fileWhatsapp() {
    document.getElementById("fileInput").click();

    fileInput.addEventListener('change', (event) => {
        const $offcanvas = $('#myOffcanvas').offcanvas({
            backdrop: false
        });
        $offcanvas.offcanvas('show');

        let file = event.target.files[0];
        console.log(file.type);

        if (file) {
            let reader = new FileReader();

            reader.onload = function (event) {
                // Mostrar la vista previa de la imagen dentro del div
                if (file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'image/gif' || file.type == 'image/webp' || file.type == 'image/svg+xml') {
                    $("#offcanvas-body").html('<img src="' + event.target.result + '" alt="Image Preview" style="max-width:100%; max-height: 300px;">');
                }

                if (file.type == 'video/mp4') {
                    $("#offcanvas-body").html('<video controls style="max-width:100%; max-height: 300px;"><source src="' + event.target.result + '" type="video/mp4">Your browser does not support the video tag.</video>');
                }

            }

            reader.readAsDataURL(file);
        }
    });


}

function documentoFile() {
    document.getElementById("fileInput").click();

    fileInput.addEventListener('change', (event) => {
        const $offcanvas = $('#myOffcanvas').offcanvas({
            backdrop: false
        });
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
                `;
                $("#offcanvas-body").html(vista);


            }

            reader.readAsDataURL(file);
        }
    });
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

socket.on("messageContacts", data => {
    viewContact(data);
});

function loadContact() {
    fetch("/numeroWhatsapp")
        .then(res => res.json())
        .then(data => {
            viewContact(data);
        })
}

function viewContact(data) {
    let html = "";
    data.forEach(contact => {
        let hourMessage = formatDate(contact.time);

        let countMessage = "";

        if (contact.cantidad > 0) {
            countMessage = `<span class="float-end badge bg-danger text-white">${contact.cantidad}</span>`;
        }

        let nameContact = contact.contact;
        nameContact = nameContact.replace("'", "");

        html += `
        <a href="javascript:void(0);" class="text-body" onclick="chatDetail('${contact.numero}','${nameContact}')">
            <div class="d-flex align-items-start p-2">
                <div class="position-relative">
                    <span class="user-status"></span>
                    <img src="assets/images/users/avatar-6.jpg" class="me-2 rounded-circle" height="48" alt="Michael H" />
                </div>
                <div class="w-100 overflow-hidden">
                    <h5 class="mt-0 mb-0 fs-14">
                        <span class="float-end text-muted fs-12">${hourMessage}</span>
                        ${contact.contact}
                    </h5>
                    <p class="mt-1 mb-0 text-muted fs-14">
                        ${countMessage}
                        <span class="text-dark" style="display: inline-block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width: 220px;">${contact.mensaje}</span>
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

function chatDetail(numero, name) {
    let html = `
    <div class="d-flex pb-2 border-bottom align-items-center">
        <img src="assets/images/users/avatar-5.jpg" class="me-2 rounded-circle" height="48" alt="Brandon Smith" />
        <div>
            <h5 class="mt-0 mb-0 fs-14" id="nameContacto">${name}</h5>
            <p class="mb-0" id="numberWhatsapp">${numero}</p>
            <input type="hidden" id="whatsappNumber" value="${numero}">
        </div>
        <div class="flex-grow-1">
            <ul class="list-inline float-end mb-0">
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
                        <a class="dropdown-item" href="javascript: void(0);"><i
                                class="bi bi-music-note-list fs-18 me-2"></i>Etiqueta</a>
                        <a class="dropdown-item" href="javascript: void(0);"><i
                                class="bi bi-search fs-18 me-2"></i>Buscar</a>
                        <a class="dropdown-item" href="javascript: void(0);"><i
                                class="bi bi-image fs-18 me-2"></i>Wallpaper</a>
                        <a class="dropdown-item" href="javascript: void(0);"><i
                                class="bi bi-arrow-right-circle fs-18 me-2"></i>More</a>
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
                <div class="row">
                    <div class="col mb-2 mb-sm-0">
                        <input type="text" class="form-control border-0" name="mensaje_form"
                            placeholder="Ingrese el mensaje" required="" id="contentMensaje">
                        <div class="invalid-feedback">
                            Por favor ingrese su mensaje
                        </div>
                    </div>
                    <div class="col-sm-auto">
                        <div class="btn-group">
                            <a href="#" class="btn btn-light"><i class="bi bi-emoji-smile fs-18"></i></a>
                            <input type="file" id="fileInput" style="display: none;" />
                            <div class="dropdown">
                                <a href="#" class="dropdown-toggle arrow-none text-muted" data-bs-toggle="dropdown" aria-expanded="true">
                                    <i class="uil uil-ellipsis-v"></i>
                                </a>
                                <div class="dropdown-menu dropdown-menu-end" data-popper-placement="bottom-end" style="position: absolute; inset: 0px auto auto 0px; margin: 0px; transform: translate(-143px, 21px);">
                                    <!-- item-->
                                    <a href="javascript:void(0);" class="dropdown-item" onclick="fileWhatsapp()">
                                        <i class="uil uil-refresh me-2"></i>fotos y videos
                                    </a>
                                    <!-- item-->
                                    <a href="javascript:void(0);" class="dropdown-item" onclick="documentoFile()">
                                        <i class="uil uil-user-plus me-2"></i>Documento
                                    </a>
                                </div>
                                <a href="#" class="btn btn-light" id="btnAudio"><i class="bi bi-mic-fill fs-18"></i></a>
                                <div class="d-grid">
                                <button type="submit" class="btn btn-success chat-send"><i
                                        class='uil uil-message'></i></button>
                                </div>
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
    console.log(data);

    let fecha_y_hora = convertTimestampToDate(data.timestamp);

    if (data.from != '"51927982544"') {
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
            /*case "video":
                viewReceipVideo(data, fecha_y_hora);
                break;
            case "document":
                viewReceipDocument(data, fecha_y_hora);
                break;
            case "audio":
                viewReceipAudio(data, fecha_y_hora);
                break;*/
            default:
                break;
        }
    }

});

function viewFromText(data, hora) {
    let html = `
        <li class="clearfix">
            <div class="conversation-text ms-0">
                <div class="d-flex">
                    <div class="ctext-wrap">
                        <p>${data.message}</p>                                                                                                                                        
                    </div>                                                                    
                    <div class="conversation-actions dropdown dropend">
                        <a href="javascript: void(0);" class="text-dark ps-1" data-bs-toggle="dropdown" aria-expanded="false"><i class='bi bi-three-dots-vertical fs-14'></i></a>                
                        <div class="dropdown-menu">
                            <a class="dropdown-item" href="#">
                                <i class="bi bi-reply fs-18 me-2"></i>Reply
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
                                        <img src="http://157.230.239.170:4000/img/archivos/${data.id_document}.jpg" alt="" height="150">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="conversation-actions dropdown dropend">
                            <a href="javascript: void(0);" class="text-dark ps-1" data-bs-toggle="dropdown"
                                                aria-expanded="false"><i class='bi bi-three-dots-vertical fs-14'></i></a>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="#" onclick="descargarImagen('http://157.230.239.170:4000/img/archivos/${data.id_document}.jpg', '${data.id_document}.jpg')">
                                    <i class="bi bi-reply fs-18 me-2"></i>Descargar
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
                                            <source src="http://157.230.239.170:4000/videos/archivos/${data.id_document}.mp4" type="video/mp4">
                                            Tu navegador no soporta la etiqueta de video.
                                        </video>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="conversation-actions dropdown dropend">
                            <a href="javascript: void(0);" class="text-dark ps-1" data-bs-toggle="dropdown"
                                                aria-expanded="false"><i class='bi bi-three-dots-vertical fs-14'></i></a>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="#" onclick="descargarImagen('http://157.230.239.170:4000/videos/archivos/${data.id_document}.jpg', '${data.id_document}.mp4')">
                                    <i class="bi bi-reply fs-18 me-2"></i>Descargar
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

                                        <audio controls>
                                            <source src="http://157.230.239.170:4000/audios/archivos/${data.id_document}.ogg" type="audio/ogg">
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
                                <a class="dropdown-item" href="#" onclick="descargarImagen('http://157.230.239.170:4000/audios/archivos/${data.id_document}.ogg', '${data.id_document}.ogg')">
                                    <i class="bi bi-reply fs-18 me-2"></i>Descargar
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
                                <a href="javascript:void(0);" class="text-muted fw-bold">${data.id_document}.pdf</a>
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
                        <a class="dropdown-item" href="#" onclick="descargarImagen('http://157.230.239.170:4000/documentos/archivos/${data.id_document}.pdf', '${data.id_document}.pdf')">
                            <i class="bi bi-reply fs-18 me-2"></i>Descargar
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
    let html = `
        <li class="clearfix odd">
            <div class="conversation-text ms-0">
                <div class="d-flex justify-content-end">
                    <div class="conversation-actions dropdown dropstart">
                        <a href="javascript: void(0);" class="text-dark pe-1" data-bs-toggle="dropdown" aria-expanded="false"><i class='bi bi-three-dots-vertical fs-14'></i></a>                
                        <div class="dropdown-menu">
                            <a class="dropdown-item" href="#">
                                <i class="bi bi-reply fs-18 me-2"></i>Reply
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
                        <p>${data.message}</p>
                    </div>  
                </div>                                                          
                <p class="text-muted fs-12 mb-0 mt-1">${fecha}<i class="bi bi-check2-all ms-1 text-success"></i></p>
            </div>
        </li>`;

    return html;
}

function viewReceipImage(data, fecha) {
    let html = `
            <li class="clearfix odd">
                <div class="conversation-text ms-0">
                    <div class="d-flex justify-content-end">
                        <div class="conversation-actions dropdown dropstart">
                            <a href="javascript: void(0);" class="text-dark ps-1" data-bs-toggle="dropdown"
                                                aria-expanded="false"><i class='bi bi-three-dots-vertical fs-14'></i></a>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" href="#" onclick="descargarImagen('http://157.230.239.170:4000/img/archivos/${data.filename}', '${data.filename}')">
                                    <i class="bi bi-reply fs-18 me-2"></i>Descargar
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
                            <div class="p-2">
                                <div class="row align-items-center">
                                    <div class="col-auto">
                                        <img src="http://157.230.239.170:4000/img/archivos/${data.filename}" alt="" height="150">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p class="text-muted fs-12 mb-0 mt-1">${fecha}</p>
                </div>
            </li>`;

        return html;
}

function formMessage() {
    const form_envio = document.getElementById('chat-form');
    const contentMensaje = document.getElementById('contentMensaje');
    const whatsappNumber = document.getElementById('whatsappNumber');

    form_envio.addEventListener('submit', (e) => {
        e.preventDefault();

        if (contentMensaje.value == "") {
            return false;
        }

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer EAALqfu5fdToBO4ZChxiynoV99ZARXPrkiDIfZA3fi1TRfeujYI2YlPzH9fUB8PF6BbWJAEowNhCprGP2LqZA9MhWcLcxgImVkk8LKKASpN23vtHVZA4JZC9z15pDLFe1AwXDIaLNAZA75PN4f9Ji25tGC5ue8ZA7jWEfHgo2oYZCSrIAFZAzJ3Nj86iCfJToOhZB83jZCvVheSZBOyuc04zxE");

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

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://graph.facebook.com/v17.0/122094968330010315/messages", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result);
                console.log(result.messages[0].id);

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

                let datos = {
                    id: result.messages[0].id,
                    from: "51927982544",
                    message: contentMensaje.value,
                    nameContact: "Grupo Es consultores",
                    receipt: whatsappNumber.value,
                    timestamp: Math.floor(Date.now() / 1000),
                    type: "text",
                    estadoMessage: "sent",
                    documentId: "",
                    id_document: "",
                    filename: ""
                };

                fetch("http://157.230.239.170:4000/insertChat", {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(datos)
                })
                .then(r => r.json())
                .then(resp => {
                    //console.log(resp)
                })

            })
            .catch(error => console.log('error', error))
            .finally(() => {
                contentMensaje.value = "";
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

    if (file) {
        let formData = new FormData();
        formData.append('imagen', file);
        formData.append('numero', numero.value);

        console.log(file.type);

        fetch('subir_imagen', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.message == 'ok') {
                    $('#myOffcanvas').offcanvas('hide');
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

    const numeroW = document.getElementById('whatsappNumber');
    console.log(numeroW.value);

    let mediaRecorder;
    let audioChunks = [];

    recordButton.addEventListener('mousedown', () => {
        console.log("hola");
        audioChunks = []; // Limpiar chunks anteriores
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.ondataavailable = event => {
                    audioChunks.push(event.data);
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    audioElement.src = audioUrl;

                    // Enviar al servidor
                    const formData = new FormData();
                    formData.append('audio', audioBlob);
                    formData.append('numero', numeroW.value);

                    fetch('/uploadAudio', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then(data => console.log(data))
                    .catch(error => console.error('Error:', error));
                };

                mediaRecorder.start();
            })
            .catch(error => console.error('Error accediendo al micrófono:', error));
    });

    recordButton.addEventListener('mouseup', () => {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }
    });


}