const urlchat = document.getElementById('chaturl');

var socket = io(urlchat.value);

const form_envio = document.getElementById('chat-form');

const contentMensaje = document.getElementById('contentMensaje');
const conversation = document.getElementById('conversation-list');
const contactos = document.getElementById('contactos-whatsapp');
const whatsappNumber = document.getElementById('whatsappNumber');

//getAllContactos();

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
})


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
            console.log(data);

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



document.querySelector("#fileWhatsapp").addEventListener("click", function () {
    document.getElementById("fileInput").click();
});


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

        if(contact.cantidad > 0) {
            countMessage = `<span class="float-end badge bg-danger text-white">${contact.cantidad}</span>`;
        }

        html += `
        <a href="javascript:void(0);" class="text-body">
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