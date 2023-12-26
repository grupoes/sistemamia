$('#basic-datatable').DataTable();

const addModulo = document.getElementById('addModulo');
const viewActions = document.getElementById('viewActions');
const modulopadre = document.getElementById('modulopadre');
const espadre = document.getElementById('espadre');

const formModulo = document.getElementById('formModulo');

renderModulos();
renderModulosPadres();

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
    renderActions();
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

    data.forEach(action => {
        actions += `
        <div class="col-md-3">
            <input type="checkbox" class="form-check-input" id="action-${action.id}" name="actions[]" value="${action.id}">
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

formModulo.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(formModulo);

    const actiones = document.querySelectorAll('input[name="actions[]"]');

    let act = [];

    actiones.forEach(ac => {
        act.push(ac.value)
    });

    formData.append('actions', act);

    const plainFormData = Object.fromEntries(formData.entries());
    const formDataJsonString = JSON.stringify(plainFormData);

    fetch('/create-module', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: formDataJsonString
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
    });
});