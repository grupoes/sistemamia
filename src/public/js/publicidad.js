$('#basic-datatable').DataTable();

const addbtn = document.getElementById('addbtn');
const formPublicidad = document.getElementById('formPublicidad');
const renderPublicidad = document.getElementById('renderPublicidad');

addbtn.addEventListener('click', () => {
    $("#modalAddPublicidad").modal('show');
});

formPublicidad.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(formPublicidad);

    fetch('save-publicidad', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.message === 'existe') {
            alert(data.response);
        } else {
            if(data.message === 'ok') {
                $("#modalAddPublicidad").modal('hide');
                formPublicidad.reset();

                renderAll();

            } else {
                alert(data.response);
            }
        }
    })
});

function renderAll() {
    fetch('/allPublicidad')
    .then(res => res.json())
    .then(data => {
        if(data.message === 'ok') {
            renderAllView(data.data);
        }
    })
}

function renderAllView(data) {

    $('#basic-datatable').DataTable().destroy();

    let html = "";

    data.forEach(publi => {
        let checked = "";
        let nameStatus = "";

        if(publi.estado === 1) {
            checked = "checked";
            nameStatus = "Activo";
        } else {
            checked = "";
            nameStatus = "Inactivo";
        }

        html += `
            <tr>
                <td>
                    <img src="/publicidad/${publi.imagen}" alt="publicidad-${publi.id}" width="50">
                </td>
                <td>${publi.codigo}</td>
                <td>${publi.nombre}</td>
                <td>${publi.descripcion}</td>
                <td>
                    <div class="form-switch mb-2">
                        <input type="checkbox" class="form-check-input" id="customSwitch${publi.id}" ${checked} onchange="desabledPublicidad(${publi.id}, event)">
                        <label class="form-check-label" for="customSwitch${publi.id}">${nameStatus}</label>
                    </div>
                </td>
                <td>
                    <button type="button" class="btn btn-info">Editar</button>
                    <button type="button" class="btn btn-danger">Eliminar</button>
                </td>
            </tr>
        `;
    });
    
    renderPublicidad.innerHTML = html;

    $('#basic-datatable').DataTable();
}

renderAll();

function desabledPublicidad(id, e) {

    let estado = "";

    if(e.target.checked) {
        estado = 1;
    } else {
        estado = 0;
    }

    const formData = new FormData();

    formData.append('id', id);
    formData.append("estado", estado);

    const formDataObj = {};

    formData.forEach((value, key) => {
        formDataObj[key] = value;
    });
    
    fetch('/disabled-publicidad', {
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
        }
    })
}
