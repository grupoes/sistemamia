const urlchat = document.getElementById('chaturl');

var socket = io(urlchat.value);

const form_envio = document.getElementById('chat-form');

const contentMensaje = document.getElementById('contentMensaje');

const contactos = document.getElementById('contactos-whatsapp');
const whatsappNumber = document.getElementById('whatsappNumber');

const cardBody = document.querySelector("#cardBody");

//getAllContactos();

/*form_envio.addEventListener('submit', (e) => {
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

            fetch("http://localhost:4000/addMessageChat", requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));

            listConversation(contentMensaje.value);

        })
        .catch(error => console.log('error', error))
        .finally(() => {
            contentMensaje.value = "";
        });
})*/


function listConversation(mensaje) {
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

    $("#conversation-list").append(html);

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
                    if (msj.post_body) {
                        html += `
                    <li class="clearfix">
                        <div class="conversation-text ms-0">
                            <div class="d-flex">
                                <div class="card mb-1 shadow-none border text-start ctext-wrap">
                                    <div class="p-2">
                                        <div class="row align-items-center">
                                            <div class="col-auto">
                                                <img src="${msj.image_url}" alt="" height="150">
                                            </div>
                                            <div class="col ps-0">
                                                <p class="mb-0">${msj.post_body}</p>
                                            </div>
                                        </div>
                                        <p style="margin-top: 10px; margin-bottom: 0">vi esto en facebook</p>
                                    </div>
                                </div>
                                <div class="conversation-actions dropdown dropend">
                                    <a href="javascript: void(0);" class="text-dark ps-1" data-bs-toggle="dropdown"
                                        aria-expanded="false"><i class='bi bi-three-dots-vertical fs-14'></i></a>
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
                            <p class="text-muted fs-12 mb-0 mt-1">${fecha_y_hora}</p>
                        </div>
                    </li>
                    `;
                    } else {
                        html += `
                    <li class="clearfix">
                    <div class="conversation-text ms-0">
                        <div class="d-flex">
                            <div class="ctext-wrap">
                                <p>${msj.message}</p>                                                                                                                                        
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
                        <p class="text-muted fs-12 mb-0 mt-1">${fecha_y_hora}</p>
                    </div>                                                            
                </li>
                `;
                    }


                } else {

                    html += `
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
                                    <p>${msj.message}</p>
                                </div>  
                            </div>                                                          
                            <p class="text-muted fs-12 mb-0 mt-1">${fecha_y_hora}<i class="bi bi-check2-all ms-1 text-success"></i></p>
                        </div>
                    </li>
                    `;

                }
            });

            conversation.innerHTML = html;
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
                        <a class="dropdown-item" href="javascript: void(0);" data-bs-toggle="modal"
                            data-bs-target="#viewProfile">
                            <i class="bi bi-person-circle fs-18 me-2"></i>View Profile
                        </a>
                        <a class="dropdown-item" href="javascript: void(0);"><i
                                class="bi bi-music-note-list fs-18 me-2"></i>Media, Links and Docs</a>
                        <a class="dropdown-item" href="javascript: void(0);"><i
                                class="bi bi-search fs-18 me-2"></i>Search</a>
                        <a class="dropdown-item" href="javascript: void(0);"><i
                                class="bi bi-image fs-18 me-2"></i>Wallpaper</a>
                        <a class="dropdown-item" href="javascript: void(0);"><i
                                class="bi bi-arrow-right-circle fs-18 me-2"></i>More</a>
                    </div>
                </li>
            </ul>
        </div>
    </div>
    <div class="mt-1">
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
                            <a href="#" class="btn btn-light" id="fileWhatsapp">
                                <i class="bi bi-paperclip fs-18"></i>
                            </a>
                            <a href="#" class="btn btn-light"><i class="bi bi-mic-fill fs-18"></i></a>
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

    html = `
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
                        <p class="text-muted fs-12 mb-0 mt-1">${fecha_y_hora}</p>
                    </div>                                                            
                </li>
                `;

    const lista = $("#conversation-"+data.from);
    lista.append(html);

});
