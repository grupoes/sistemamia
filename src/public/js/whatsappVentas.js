$('#basic-datatable').DataTable();

const addbtn = document.getElementById('addbtn');
const formWhatsapp = document.getElementById('formWhatsapp');
const renderWhatsapp = document.getElementById('renderWhatsapp');

addbtn.addEventListener('click', () => {
    $("#modalAddWhatsapp").modal("show");
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
                            <button type="button" class="btn btn-info">Editar</button>
                            <button type="button" class="btn btn-danger">Eliminar</button>
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