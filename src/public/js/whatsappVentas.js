$('#basic-datatable').DataTable();

const addbtn = document.getElementById('addbtn');
const formWhatsapp = document.getElementById('formWhatsapp');
const renderWhatsapp = document.getElementById('renderWhatsapp');

const idnumber = document.getElementById('idnumber');

addbtn.addEventListener('click', () => {
    $("#modalAddWhatsapp").modal("show");
    formWhatsapp.reset();
    idnumber.value = 0;
});

formWhatsapp.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(formWhatsapp);

    const formDataObj = {};

    formData.forEach((value, key) => {
        formDataObj[key] = value;
    });

    fetch('/addNumeroWhatsappVentas', {
        method: 'POST',
        body: JSON.stringify(formDataObj),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(res => res.json())
    .then(data => {
        if(data.message === 'ok') {
            $("#modalAddWhatsapp").modal("hide");
            renderAll();
            formWhatsapp.reset();
        } else {
            alert(data.response)
        }
    })
   
});

renderAll();

function renderAll() {
    fetch('/allWhatsapp')
    .then(res => res.json())
    .then(data => {
        let html = "";

        if(data.message === 'ok') {
            const datos = data.data;

            datos.forEach((what, index) => {

                if(what.numero !== '938669769') {
                    let checked = "";
                    let nameStatus = "";

                    if(what.status === "1") {
                        checked = "checked";
                        nameStatus = "Activo";
                    } else {
                        checked = "";
                        nameStatus = "Inactivo";
                    }

                    html += `
                    <tr>    
                        <td>${index + 1}</td>
                        <td>${what.numero}</td>
                        <td>${what.nombre}</td>
                        <td>${what.description}</td>
                        <td>
                            <div class="form-switch mb-2">
                                <input type="checkbox" class="form-check-input" id="customSwitch${what.id}" ${checked} onchange="disabledWhatsapp(${what.id}, event)">
                                <label class="form-check-label" for="customSwitch${what.id}">${nameStatus}</label>
                            </div>
                        </td>
                        <td>
                            <button type="button" class="btn btn-info" onclick="editNumber(${what.id})">Editar</button>
                            <button type="button" class="btn btn-danger" onclick="deleteNumber(${what.id})">Eliminar</button>
                        </td>
                    </tr>
                    `;
                }

            });

            renderWhatsapp.innerHTML = html;
        }
    });
}

function disabledWhatsapp(id, e) {
    let checked = "";
    if(e.target.checked) {
        checked = 1;
    } else {
        checked = 2;
    }

    const formData = new FormData();

    formData.append('id', id);
    formData.append('checked', checked);

    const formDataObj = {};

    formData.forEach((value, key) => {
        formDataObj[key] = value;
    });

    fetch('/updateStatusWhatsapp', {
        method: 'POST',
        body: JSON.stringify(formDataObj),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(res => res.json())
    .then(data => {
        if(data.message === 'ok') {
            renderAll();
        } else {
            alert(data.response);
        }
    })
}

function editNumber(id) {
    $("#modalAddWhatsapp").modal("show");

    fetch('/getWhatsappVenta/'+id)
    .then(res => res.json())
    .then(data => {
        
        const numero_whatsapp = document.getElementById('numero_whatsapp');
        const nombre_whatsapp = document.getElementById('nombre_whatsapp');
        const descripcion_whatsapp = document.getElementById('descripcion_whatsapp');

        numero_whatsapp.value = data.response.numero;
        nombre_whatsapp.value = data.response.nombre;
        descripcion_whatsapp.value = data.response.description; 
        idnumber.value = id;
    })
}

function deleteNumber(id) {
    Swal.fire({
        title: "¿Está seguro?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar!"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                position: "top-center",
                icon: "success",
                title: "ha sido eliminado correctamente",
                showConfirmButton: false,
                timer: 1500
            });
        }
    });
}