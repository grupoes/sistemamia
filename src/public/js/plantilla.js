var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl)
})

$('#basic-datatable').DataTable();


const editor = document.querySelector('#editorTemplate');
const counter = document.querySelector('.char-counter');

editor.addEventListener('input', (e) => {
    const valor = e.target.value;
    const textLength = valor.length;
    
    counter.textContent = `Caracteres: ${textLength} de 1024`;

    // Prevent further typing if the limit is reached
    if (textLength >= 1024) {
        editor.setAttribute('contenteditable', 'false');
    }

    viewPreviewMessage(valor);
});


const btnAdd = document.getElementById('btnAddTemplate');

btnAdd.addEventListener('click', () => {
    $("#modal-plantilla").modal('show');
});

const typeHeaderTemplate = document.getElementById('typeHeaderTemplate');

typeHeaderTemplate.addEventListener('change', (e) => {
    const valor = e.target.value;

    const selectHeaderContent = document.getElementById('selectHeaderContent');

    let html = "";

    if (valor === "NINGUNA") {
        selectHeaderContent.removeAttribute('class');
        selectHeaderContent.innerHTML = html;
    }

    if (valor === 'MENSAJE_TEXTO') {
        html = `
        <div style="position: relative;">
            <input type="text" class="form-control" maxlength="60" name="text_header" style="padding-right: 50px;" placeholder="Escribir texto del encabezado">
            <span id="contadorHeader" class="contador-dentro" style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%); color: gray; pointer-events: none;">0/60</span>
        </div>
        `;

        selectHeaderContent.removeAttribute('class');
        selectHeaderContent.setAttribute('class', 'col-md-9');
        selectHeaderContent.innerHTML = html;
    }

    if (valor === 'MEDIOS') {
        html = `
        <div class="row">

            <div class="col-md-3 col-xl-3">
                <input type="radio" name="opcion" id="opcion1" value="imagen" />
                <label for="opcion1" class="optiones">
                    <div class="card d-flex justify-content-center align-items-center">
                        <i class="uil uil-image" style="font-size: 50px; margin-top: 5px"></i>
                        <p>Imagen</p>
                    </div>
                </label>

            </div>

            <div class="col-md-3 col-xl-3">
                <input type="radio" name="opcion" id="opcion2" value="video" />
                <label for="opcion2" class="optiones">
                    <div class="card d-flex justify-content-center align-items-center">
                        <i class="uil uil-video" style="font-size: 50px; margin-top: 5px"></i>
                        <p>Video</p>
                    </div>
                </label>

            </div>

            <div class="col-md-3 col-xl-3">
                <input type="radio" name="opcion" id="opcion3" value="documento" />
                <label for="opcion3" class="optiones">
                    <div class="card d-flex justify-content-center align-items-center">
                        <i class="uil uil-file-alt" style="font-size: 50px; margin-top: 5px"></i>
                        <p>Documento</p>
                    </div>
                </label>

            </div>

            <div class="col-md-3 col-xl-3">
                <input type="radio" name="opcion" id="opcion4" value="ubicacion" />
                <label for="opcion4" class="optiones">
                    <div class="card d-flex justify-content-center align-items-center">
                        <i class="uil uil-map-marker" style="font-size: 50px; margin-top: 5px"></i>
                        <p>Ubicación</p>
                    </div>
                </label>

            </div>

        </div>

        <div class="row mb-3" id="contentMedia">
            
        </div>
        `;

        selectHeaderContent.removeAttribute('class');
        selectHeaderContent.setAttribute('class', 'col-md-12');
        selectHeaderContent.innerHTML = html;
    }

    checkInputRadioMedios();
});

function checkInputRadioMedios() {
    const radioButtons = document.querySelectorAll('input[type="radio"][name="opcion"]');
    radioButtons.forEach(function (radio) {
        radio.addEventListener('click', (e) => {
            const valor = e.target.value;

            const contentMedia = document.getElementById('contentMedia');

            if (valor === 'imagen') {
                const html = inputFileImage();
                contentMedia.innerHTML = html;
            }

            if (valor === 'video') {
                const html = inputFileVideo();
                contentMedia.innerHTML = html;
            }

            if (valor === 'documento') {
                const html = inputFileDocument();
                contentMedia.innerHTML = html;
            }

            if (valor === 'ubicacion') {
                contentMedia.innerHTML = "";
            }

        });
    });
}

function inputFileImage() {

    let html = `
    <div class="col-md-12">
        <span>Imagen</span>
        <div class="file-upload-wrapper">
            <label for="file-upload" class="file-upload-label">
            <i class="uil uil-image"></i>
                Elegir archivo JPG o PNG
            </label>
            <input id="file-upload" type="file" class="file-upload-input" accept=".jpg, .jpeg, .png"/>
        </div>
    </div>
    `;

    return html;
}

function inputFileVideo() {

    let html = `
    <div class="col-md-12">
        <span>Video</span>
        <div class="file-upload-wrapper">
            <label for="file-upload" class="file-upload-label">
            <i class="uil uil-image"></i>
                Elegir archivo MP4
            </label>
            <input id="file-upload" type="file" class="file-upload-input" accept=".mp4"/>
        </div>
    </div>
    `;

    return html;
}

function inputFileDocument() {

    let html = `
    <div class="col-md-12">
        <span>Documento</span>
        <div class="file-upload-wrapper">
            <label for="file-upload" class="file-upload-label">
            <i class="uil uil-image"></i>
                Elegir archivo PDF
            </label>
            <input id="file-upload" type="file" class="file-upload-input" accept=".pdf"/>
        </div>
    </div>
    `;

    return html;
}

function viewPreviewMessage(texto) {

    let regexp_resaltar = /\*(.*?)\*/g;
    let regexp_cursiva = /\_(.*?)\_/g;
    let regexp_tachado = /\~(.*?)\~/g;

    texto = texto.replace(regexp_resaltar, resaltar);

    texto = texto.replace(regexp_cursiva, cursiva);

    texto = texto.replace(regexp_tachado, tachado);

    const previewMessage = document.getElementById('previewMessage');

    previewMessage.innerHTML = texto;

    previewMessage.style.height = "auto";
}

function resaltar(Coincidencia, grupo1) {
    return "<strong>" + grupo1 + "</strong>"; 
}

function cursiva(Coincidencia, grupo2) {
    return "<i>" + grupo2 + "</i>";
}

function tachado(Coincidencia, grupo3) {
    return "<s>" + grupo3 + "</s>";
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

const addNegrita = document.getElementById('addNegrita');
const addCursiva = document.getElementById('addCursiva');
const addTachado = document.getElementById('addTachado');
const addVariable = document.getElementById('addVariable');

addNegrita.addEventListener('click', () => {
    const caracteres = "**";

    const editor = document.getElementById('editorTemplate');
            
    insertEmojiAtCursor(editor, caracteres);
});

addCursiva.addEventListener('click', () => {
    const caracteres = "__";

    const editor = document.getElementById('editorTemplate');
            
    insertEmojiAtCursor(editor, caracteres);
});

addTachado.addEventListener('click', () => {
    const caracteres = "~~";

    const editor = document.getElementById('editorTemplate');
            
    insertEmojiAtCursor(editor, caracteres);
});

addVariable.addEventListener('click', () => {
    const editor = document.getElementById('editorTemplate');
    let texto = editor.value;
    
    let patron = /{{\d+}}/g;
    let coincidencias = texto.match(patron);

    let cantidad = coincidencias ? coincidencias.length : 0;

    let cantidadAdd = cantidad + 1;
    
    const caracter = `{{${cantidadAdd}}}`;

    insertEmojiAtCursor(editor, caracter);

    if(cantidadAdd > 0) {
        const viewVariables = document.getElementById('viewVariables');

        viewVariables.innerHTML = `<label class="form-label" for="bodyTemplate">Variables</label>`;

        const itemVariable = `
        <div class="row mb-2">
            <div class="col-md-1">
                <p style="margin-top: 8px; margin-bottom: 0">\{{${cantidadAdd}}}</p>
            </div>
            <div class="col-md-11">
                <input type="text" class="form-control" placeholder="Ingresa contenido para \{{${cantidadAdd}}}">
            </div>
        </div>
        `;

        $("#listVariables").append(itemVariable);

        viewPreviewMessage(editor.value);
    }

});

function getTemplateAll() {
    fetch('/apiGetTemplateAll')
    .then(res => res.json())
    .then(data => {
        const datos = data.data.data;
        viewAllTemplateMeta(datos);
    })
}

getTemplateAll();

const getTemplates = document.getElementById('getTemplates');

function viewAllTemplateMeta(data) {
    
    $('#basic-datatable').DataTable().destroy();

    let html = "";

    data.forEach((template, index) => {
        const componentes = template.components;

        let body = "";
        let spanStatus = "";

        if(componentes.length === 1) {
            body = template.components[0].text;
        } else {
            body = template.components[1].text;
        }

        if(template.status === 'APPROVED') {
            spanStatus = `<span class="fw-bold badge badge-soft-success py-1 fs-6">APROBADA</span>`;
        }

        if(template.status === 'REJECTED') {
            spanStatus = `<span class="fw-bold badge badge-soft-danger py-1 fs-6">RECHAZADA</span>`;
        }

        if(template.status === 'PENDING') {
            spanStatus = `<span class="fw-bold badge badge-soft-info py-1 fs-6">PENDIENTE</span>`;
        }

        if(template.status === 'PAUSED') {
            spanStatus = `<span class="fw-bold badge badge-soft-warning py-1 fs-6">PAUSADA</span>`;
        }

        html += `
        <tr>
            <td>${index + 1}</td>
            <td>${template.name}</td>
            <td>${template.category}</td>
            <td>${template.language}</td>
            <td>
                ${spanStatus}
                <p style="width: 250px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" data-bs-toggle="popover" title="${body}">${body}</p>
            </td>
            <td>
                <button type="button" class="btn btn-info" title="Editar plantilla">
                    <i class="uil uil-file-edit-alt"></i>
                </button>
                <button type="button" class="btn btn-danger" title="Eliminar plantilla">
                    <i class="uil uil-trash-alt"></i>
                </button>
            </td>
        </tr>
        `;
    });

    getTemplates.innerHTML = html;

    $('#basic-datatable').DataTable();
}

const nameTemplate = document.getElementById('nameTemplate');

nameTemplate.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        event.preventDefault(); // Evita el comportamiento predeterminado de la tecla espacio
        event.target.value += '_'; // Agrega un guión bajo al valor del input
    }
});

const formTemplate = document.getElementById('formCreateTemplate');
const btnCreateTemplate = document.getElementById('btnCreateTemplate');

btnCreateTemplate.addEventListener('click', (e) => {
    e.target.disabled = true;
    e.target.textContent = "Creando...";
    
    const formData = new FormData(formTemplate);
    const plainFormData = Object.fromEntries(formData.entries());
    const formDataJsonString = JSON.stringify(plainFormData);

    fetch('/create-template', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: formDataJsonString
    })
    .then(res => res.json())
    .then(data => {
        formTemplate.reset();
        e.target.disabled = false;
        e.target.textContent = "Crear";

        if(data.error) {
            alert(data.error.message);
            return;
        }

        $("#modal-plantilla").modal('hide');

        Swal.fire({
            position: "top-center",
            icon: "success",
            title: "Se creo correctamente la plantilla",
            showConfirmButton: false,
            timer: 2500
        });

        getTemplateAll();

    })

});