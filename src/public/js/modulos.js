$('#basic-datatable').DataTable();

const addModulo = document.getElementById('addModulo');
const viewActions = document.getElementById('viewActions');
const modulopadre = document.getElementById('modulopadre');
const espadre = document.getElementById('espadre');

const formModulo = document.getElementById('formModulo');

renderModulos();

function renderModulos() {
    fetch('/render-modulos')
    .then(res => res.json())
    .then(data => {
        renderView(data.data);
    })
}

function renderView(data) {
    let html = "";

    $('#basic-datatable').DataTable().destroy();

    const listModulos = document.getElementById('listModulos');

    data.forEach((modulo, index) => {

        let padre = "";
        let depende = "";
        if(modulo.fatherId == 0) {
            padre = `<strong>${modulo.name}</strong>`;
        } else {
            padre = modulo.name;
            depende = `<strong>${modulo.moduloPadre.name}</strong>`;
        }

        html += `
        <tr>
            <td>${index + 1}</td>
            <td>${padre}</td>
            <td>${depende}</td>
            <td>${modulo.url}</td>
            <td>${modulo.icono}</td>
            <td>
                <button type="button" class="btn btn-info">Editar</button>
                <button type="button" class="btn btn-danger">Eliminar</button>
            </td>
        </tr>
        `;
    });

    listModulos.innerHTML = html;

    $('#basic-datatable').DataTable();
}

addModulo.addEventListener('click', () => {
    $("#modalModulo").modal('show');

    formModulo.reset();

    modulopadre.disabled = false;

    renderActions();

    renderModulosPadres();
});

function renderActions() {
    fetch('/listActions')
    .then(res => res.json())
    .then(data => {
        if(data.status === 'error') {
            alert('Ocurrio un error');
            return false;
        }

        const datos = data.data;

        viewActionsHtml(datos);

    })
}

function viewActionsHtml(data) {

    let actions = "";

    actions += `<input type="hidden" name="actions" value="1">`;

    data.forEach(action => {

        let check = "";
        let readonly = "";

        if(action.id == 1) {
            check = "checked";
            readonly = "disabled";
        }

        actions += `
        <div class="col-md-3">
            <input type="checkbox" class="form-check-input" ${check} id="action-${action.id}" name="actions" value="${action.id}" ${readonly}>
            <label for="action-${action.id}" class="form-check-label" style="font-weight: normal;">${action.name}</label> 
        </div>
        `;
    });

    let html = `
    <div class="col-md-12 mb-3">
        <input type="checkbox" class="form-check-input" id="todasacciones" name="todasacciones">
        <label for="todasacciones" class="form-check-label">Elegir acciones del módulo</label>  
    </div>

    <div class="row">
        ${actions}
    </div> 
    `;

    viewActions.innerHTML = html;
}

function renderModulosPadres() {
    fetch('/getModulePadres')
    .then(res => res.json())
    .then(data => {
        let html = `<option value="">Seleccione...</option>`;

        const datos = data.data;

        datos.forEach(padre => {
            html += `
            <option value="${padre.id}">${padre.name}</option>
            `;
        });

        modulopadre.innerHTML = html;
    })
}

espadre.addEventListener('click', (e) => {
    if(e.target.checked === true) {
        viewActions.innerHTML = "";
        modulopadre.disabled = true;
    } else {
        renderActions();
        modulopadre.disabled = false;
    }
});

const btnaddModulo = document.getElementById('btnaddModulo');

formModulo.addEventListener('submit', (e) => {
    e.preventDefault();

    btnaddModulo.disabled = true;
    btnaddModulo.textContent = 'Agregando...';

    const formData = new FormData(formModulo);

    const jsonObject = {};

    for (const [key, value]  of formData.entries()) {
        // Verifica si la propiedad ya existe en el objeto, lo que indica un array
        if (jsonObject[key]) {
            // Si la propiedad existe y no es un array, conviértela en un array
            if (!Array.isArray(jsonObject[key])) {
                jsonObject[key] = [jsonObject[key]];
            }
            jsonObject[key].push(value);
        } else {
            // Si la propiedad no existe, añádela al objeto
            jsonObject[key] = value;
        }
    }

    const json = JSON.stringify(jsonObject);

    fetch('/create-module', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: json
    })
    .then(res => res.json())
    .then(data => {

        btnaddModulo.disabled = false;
        btnaddModulo.textContent = 'Agregar';

        if(data.status === 'ok') {
            Swal.fire({
                position: "top-center",
                icon: "success",
                title: "Se creo correctamente el módulo",
                showConfirmButton: false,
                timer: 1500
            });

            renderModulos();

            $("#modalModulo").modal('hide');

        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "¡Ocurrio un error!",
            });
        }
    });
});