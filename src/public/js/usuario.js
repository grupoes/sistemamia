let permisosRegisto = [];
let permisosNoRegistro = [];

document.addEventListener("mainJsReady", () => {
    const path = currentPath.split('/').filter(Boolean)[0];
    construirPermisos(path);
    renderUsers();
});

$(document).ready(function () {
    $('.chosen-select').chosen({
        no_results_text: "No se encontraron resultados de :",
        width: "100%",
        heigth: "100%"
    });

    $('#ids_perfiles').chosen({
        placeholder_text_multiple: "Seleccionar",
        no_results_text: "No se encontraron resultados",
        width: "100%",
        heigth: "100%"
    });

});

const tipoDocumento = document.getElementById("tipoDocumento");
const inputNumeroDocumento = document.getElementById("numeroDocumento");
const searchDni = document.getElementById("searchDni");
const nameUsuario = document.getElementById("nameUsuario");
const lastName = document.getElementById("lastName");
const fechaNacimiento = document.getElementById("fechaNacimiento");
const guardar = document.getElementById('guardar');
const loaderContainer = document.getElementById('loaderContainer');
let selectedIdsProfiles = [];
let validatedForm = false;
let dataSourceTable;

function crear() {
    clearInputs();
    $("#modalAddUser").modal("show");
}

const ubigeo_user = document.getElementById("ubigeo_user");
const perfil_user = document.getElementById("perfil_user");

renderUbigeo();

function renderUbigeo() {
    fetch("/ubigeos")
        .then((res) => res.json())
        .then((data) => {
            if (data.status === "ok") {
                const datos = data.data;
                let html = `<option value="" disabled selected>Seleccione ubigeo</option>`;
                datos.forEach((ubigeo) => {
                    html += `<option value="${ubigeo.id}">${ubigeo.departamento}-${ubigeo.provincia}-${ubigeo.distrito}</option>`;
                });
                const ubigeoSelect = document.getElementById("ubigeo_user");
                $(ubigeoSelect).chosen("destroy");
                ubigeoSelect.innerHTML = html;
                $(ubigeoSelect).chosen({
                    no_results_text: "No se encontraron resultados",
                    width: "100%"
                });
            } else {
                console.log(data.message);
            }
        });
}

function renderPerfil() {
    fetch("/areas")
        .then((res) => res.json())
        .then((data) => {
            if (data.status === "ok") {
                const datos = data.data;

                let html = `<option value="">Seleccionar...</option>`;

                datos.forEach((perfil) => {
                    html += `<option value="${perfil.id}">${perfil.nombre}</option>`;
                });

                perfil_user.innerHTML = html;
            } else {
                console.log(data.message);
            }
        });
}

const renderTableUsers = document.getElementById("renderTableUsers");

function renderUsers() {
    fetch("/users")
        .then((res) => res.json())
        .then((data) => {
            if (data.status === "ok") {
                const datos = data.data;
                dataSourceTable = data.data;
                let html = ``;
                datos.forEach((user) => {
                    const fecha = new Date(user.trabajadore.fecha_nacimiento).toISOString().split('T')[0];
                    let contenidoPermisos = '';
                    if (permisosRegisto.length > 0) {
                        permisosRegisto.forEach((permiso) => {
                            contenidoPermisos += `
                                <button type="button" class="btn btn-${permiso.clase || 'secondary'}" 
                                        style="padding: .13rem .3rem;" 
                                        data-bs-toggle="tooltip" 
                                        data-bs-placement="right" 
                                        title="${permiso.nombre}" 
                                        onclick="${permiso.funcion}(${user.id}, ${user.estado})">
                                    <i class="${permiso.icono || 'uil uil-cog'}"></i>
                                </button>
                            `;
                        });
                    } else {
                        contenidoPermisos = '<span class="text-muted">Sin permisos</span>';
                    }
                    html += `
                    <tr>
                        <td style="max-width: 100px;">
                            <div class="d-flex" style="column-gap: 5px">
                                ${permisosRegisto.length > 0
                                    ? user.estado === 1 
                                        ? contenidoPermisos
                                        : `<button type="button" class="btn btn-warning" style="padding: .13rem .3rem;" 
                                                data-bs-toggle="tooltip" 
                                                data-bs-placement="right" 
                                                title="Restaurar" 
                                                onclick="eliminar_restaurar(${user.id}, ${user.estado})">
                                                <i class="uil uil-sync"></i>
                                            </button>`
                                    : contenidoPermisos
                                }
                            </div>
                        </td>
                        <td class="small-medium filas" style="max-width: 170px; min-width: 170px; white-space: break-spaces;">${user.trabajadore.nombres} ${user.trabajadore.apellidos
                            }</td>
                        <td class="small-medium filas">${fecha}</td>
                        <td class="small-medium filas" style="max-width: 150px; min-width: 150px; white-space: break-spaces;"> ${user.trabajadore.area.nombre}</td>
                        <td class="small-medium filas" style="max-width: 200px; min-width: 200px; white-space: break-spaces;">${user.trabajadore.carrera.nombre}</td>
                        <td class="small-medium filas">${user.correo}</td>
                        
                        <td class="small-medium filas"> ${user.trabajadore.telefono == null ? '' : user.trabajadore.telefono}</td>
                        <td class="small-medium filas"> ${user.trabajadore.whatsapp == null ? '' : user.trabajadore.whatsapp}</td>
                        <td class="small-medium filas">${user.trabajadore.tipo_trabajo.nombre}</td>
                        <td class="small-medium filas">
                            ${user.estado === 1
                                ? `<div class="bg-success text-center rounded text-white" style="width: 80px">ACTIVO</div>`
                                : `<div class="bg-danger text-center rounded text-white" style="width: 80px">INACTIVO</div>`
                            }
                        </td>
                    </tr>
                `;
                });

                $("#basic-datatable").DataTable().destroy();

                renderTableUsers.innerHTML = html;

                $("#basic-datatable").DataTable();
            } else {
                console.log(data.message);
            }
        });
}

searchDni.addEventListener("click", (event) => {
    const buttonElement = event.currentTarget;
    const errorSpan = buttonElement.parentElement.parentElement.querySelector('.text-danger');
    if (errorSpan) return;
    if (inputNumeroDocumento.value === "") {
        inputNumeroDocumento.classList.add("is-invalid");
        const errorMessage = document.createElement("span");
        errorMessage.className = "position-absolute text-danger small";
        errorMessage.style.fontSize = ".8rem";
        errorMessage.textContent = 'Es requerido.'
        inputNumeroDocumento.parentElement.parentElement.appendChild(errorMessage)
        return;
    }
    activateInputLoading();
    if (tipoDocumento.value == "1") {
        const numero = inputNumeroDocumento.value;
        if (numero.length == 8) {
            fetch("/api-dni/" + numero)
                .then((res) => res.json())
                .then((data) => {
                    if (data.status === "ok") {
                        removeInputLoading();
                        const datos = data.data;
                        nameUsuario.value = datos.nombres || "";
                        lastName.value = [datos.ap_paterno, datos.ap_materno].filter(Boolean).join(" ");
                        const fechaNacimientoStr = datos.fecha_nacimiento || "";
                        let fechaFormateada = "";
                        if (fechaNacimientoStr) {
                            const partes = fechaNacimientoStr.split("/");
                            fechaFormateada = `${partes[2]}-${partes[1]}-${partes[0]}`;
                        }
                        fechaNacimiento.value = fechaFormateada;
                        validationOfRequeridFields();
                    } else {
                        console.error(data.message);
                        removeInputLoading();
                    }
                });
        } else {
            alert("Ingrese un DNI correcto de 8 digitos");
        }
    }
});

function activateInputLoading() {
    const containerLoadButton = searchDni.parentElement.querySelector('.loader-overlay');
    containerLoadButton.classList.add('active');
    const containerLoadLastName = lastName.parentElement.querySelector('.loader-overlay');
    containerLoadLastName.classList.add('active');
    const containerNameUsuario = nameUsuario.parentElement.querySelector('.loader-overlay');
    containerNameUsuario.classList.add('active');
    const containerFechaNacimiento = fechaNacimiento.parentElement.querySelector('.loader-overlay');
    containerFechaNacimiento.classList.add('active');
}

function removeInputLoading() {
    const containerLoadButton = searchDni.parentElement.querySelector('.loader-overlay');
    containerLoadButton.classList.remove('active');
    const containerLoadLastName = lastName.parentElement.querySelector('.loader-overlay');
    containerLoadLastName.classList.remove('active');
    const containerNameUsuario = nameUsuario.parentElement.querySelector('.loader-overlay');
    containerNameUsuario.classList.remove('active');
    const containerFechaNacimiento = fechaNacimiento.parentElement.querySelector('.loader-overlay');
    containerFechaNacimiento.classList.remove('active');
}


$("#tipoDocumento").on("change", function (e) {
    const selectedValue = $(this).val();
    changeSelectedTypeDocument(selectedValue);
});

function changeSelectedTypeDocument(idTypeDocument) {
    if (idTypeDocument) {
        if (inputNumeroDocumento.disabled) inputNumeroDocumento.disabled = false;
        clearInputNumberDocument();
        if (idTypeDocument === "1") {
            inputNumeroDocumento.setAttribute("data-length", 8);
        } else {
            inputNumeroDocumento.setAttribute("data-length", 11);
        }
        validationOfRequeridFields();
    } else if (!inputNumeroDocumento.disabled) {
        inputNumeroDocumento.disabled = true;
    }
}

function clearInputNumberDocument() {
    if (inputNumeroDocumento.value !== "") inputNumeroDocumento.value = "";
    const errorSpan = document.querySelector(".input-group + .text-danger");
    if (errorSpan) {
        errorSpan.remove();
        inputNumeroDocumento.classList.remove("is-invalid");
    }
}

inputNumeroDocumento.addEventListener("input", function (event) {
    const input = event.target;
    if (tipoDocumento.value === "") {
        input.value = "";
    } else {
        const dataLength = inputNumeroDocumento.getAttribute("data-length");
        input.value = input.value.replace(/[^0-9]/g, "").slice(0, dataLength);
        disabledSearchTypeDocument(Number(dataLength), input.value.length);
        validationOfRequeridFields();
    }
});

function disabledSearchTypeDocument(dataLength, inputValueLength) {
    if (dataLength === inputValueLength && searchDni.disabled) {
        searchDni.disabled = false;
    } else if (dataLength !== inputValueLength && !searchDni.disabled) {
        searchDni.disabled = true;
    }
}

inputNumeroDocumento.addEventListener("blur", function (event) {
    const input = event.target;
    const dataLengthCurrent = Number(
        inputNumeroDocumento.getAttribute("data-length")
    );
    const errorSpan = input.parentElement.parentElement.querySelector(".text-danger");
    if (errorSpan) {
        errorSpan.remove();
    }
    if (inputNumeroDocumento.value.length !== dataLengthCurrent) {
        inputNumeroDocumento.classList.add("is-invalid");
        const errorMessage = document.createElement("span");
        errorMessage.className = "position-absolute text-danger small";
        errorMessage.style.fontSize = ".8rem";
        errorMessage.textContent =
            dataLengthCurrent === 8
                ? "Es requerido 8 caracteres"
                : "Es requerido 11 caracteres.";
        inputNumeroDocumento.parentElement.parentElement.appendChild(errorMessage);
    } else {
        inputNumeroDocumento.classList.remove("is-invalid");
    }
});

function clearInputs() {
    const idUsuario = document.getElementById('id_usuario');
    if(idUsuario.value) idUsuario.value = 0;
    const elements = document.querySelectorAll('.form-input');
    elements.forEach(element => {
        if (element.tagName === 'SELECT') {
            if (element.value !== '') {
                element.value = '';
                $(element).trigger("chosen:updated");
            }
        } else if (element.value !== '') {
            element.value = '';
        }
    });
    if (selectedIdsProfiles.length > 0) selectedIdsProfiles = [];
    validationOfRequeridFields();
}

function validationOfRequeridFields() {
    let isValidated = true;
    const dataLengthCurrent = Number(
        inputNumeroDocumento.getAttribute("data-length")
    );
    const requiredElements = document.querySelectorAll('.requerido');
    for (const element of requiredElements) {
        if (element.id !== 'numeroDocumento') {
            if (element.value === '') {
                isValidated = false;
                break;
            }
        } else {
            if (element.value === '' || element.value.length !== dataLengthCurrent) {
                isValidated = false;
                break;
            }
        }
    }
    if (guardar.disabled !== !isValidated) guardar.disabled = !isValidated;
    validatedForm = isValidated;
}

guardar.addEventListener('click', function () {
    if (!validatedForm) return;
    activarloaderGuardar();
    let payload = buildPayload();
    fetch('/guardar_usuario', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(res => {
            loaderContainer.style.display = 'none';
            if (!res.ok) {
                return res.json().then(data => { throw data });
            }
            return res.json();
        })
        .then(data => {
            if (data.success) {
                mostrarAlerta('alert-success', 'Éxito : ', data.message);
                $("#modalAddUser").modal("hide");
                renderUsers();
            }
        })
        .catch(error => {
            if (error.statusCode === 400) {
                mostrarAlerta('alert-warning', 'Advertencia : ', error.message);
            }
        });
});

function buildPayload() {
    const numericalInputs = ['tipoDocumento', 'id_area', 'id_career', 'id_tipoTrabajo', 'id_specialties', 'numberWhatsapp', 'ubigeo_user']
    let payload = {
        id: parseFloat(document.getElementById('id_usuario').value)
    };
    const allInputs = document.querySelectorAll('.form-input');
    for (let element of allInputs) {
        if (numericalInputs.includes(element.id)) {
            payload[element.id] = parseFloat(element.value) || null;
        } else {
            payload[element.id] = element.value == '' ? null : element.value;
        }
    }
    payload['ids_perfiles'] = selectedIdsProfiles;
    return payload;
}

function updateSelectedProfiles() {
    const selectElement = document.getElementById('ids_perfiles');
    const selectedOptions = Array.from(selectElement.selectedOptions);
    selectedIdsProfiles = selectedOptions.map(option => option.value);
    validationOfRequeridFields();
}

function activarloaderGuardar() {
    loaderContainer.style.display = 'flex';
    loaderContainer.style.alignItems = 'center';
    loaderContainer.style.justifyContent = 'center';
}

function mostrarAlerta(tipo, titulo, mensaje) {
    const alert = document.getElementById('alertWarning');
    const strongElement = document.getElementById('alertStrongText');
    const messageElement = document.getElementById('alertMessageText');
    strongElement.textContent = titulo;
    messageElement.textContent = mensaje;
    alert.classList.remove('d-none');
    alert.classList.add(tipo);
    setTimeout(() => {
        alert.classList.add('d-none');
        alert.classList.remove(tipo);
    }, 5000);
}

function cerrarAlerta() {
    document.getElementById('alertWarning').classList.add('d-none');
}

function manejarVisibilidadDeContraseña() {
    const passwordField = document.getElementById("password");
    const eyeIcon = document.getElementById("eyeIcon");
    const eyeOffIcon = document.getElementById("eyeOffIcon");
    if (passwordField.type === "password") {
        passwordField.type = "text";
        eyeIcon.style.display = "none";
        eyeOffIcon.style.display = "inline";
    } else {
        passwordField.type = "password";
        eyeIcon.style.display = "inline";
        eyeOffIcon.style.display = "none";
    }
}

function editar(id) {
    let dataFiltered;
    for (let index = 0; index < dataSourceTable.length; index++) {
        if (dataSourceTable[index].id === id) {
            dataFiltered = dataSourceTable[index];
            break;
        }
    }
    setEditValues(dataFiltered);
    $("#modalAddUser").modal('show');
}

function setEditValues(data) {
    document.getElementById('id_usuario').value = data.id;
    tipoDocumento.value = data.trabajadore.tipo_documento_id;
    changeSelectedTypeDocument(tipoDocumento.value);
    inputNumeroDocumento.value = data.trabajadore.numero_documento;
    nameUsuario.value = data.trabajadore.nombres;
    lastName.value = data.trabajadore.apellidos;
    fechaNacimiento.value = data.trabajadore.fecha_nacimiento;
    document.getElementById('id_tipoTrabajo').value = data.trabajadore.tipoTrabajoId;
    document.getElementById('id_area').value = data.trabajadore.area_id;
    document.getElementById('id_career').value = data.trabajadore.carreraId;
    listarEspecialidadesPorCarrera(data.trabajadore.carreraId, data.trabajadore.especialidadId);
    document.getElementById('fechaContrato').value = data.trabajadore.fecha_contrato;
    document.getElementById('telefono').value = data.trabajadore.telefono;
    document.getElementById('numberWhatsapp').value = data.trabajadore.whatsapp;
    document.getElementById('ubigeo_user').value = data.trabajadore.ubigeoId;
    document.getElementById('address').value = data.trabajadore.direccion;
    document.getElementById('urbanizacion').value = data.trabajadore.urbanizacion === null ? '' : data.trabajadore.urbanizacion;
    document.getElementById('email').value = data.correo;
    document.getElementById('password').value = data.password;
    let selectedIdsProfilesEdit = data.perfiles.map(perfil => String(perfil.id));
    selectedIdsProfiles = selectedIdsProfilesEdit;
    document.getElementById('ids_perfiles').value = selectedIdsProfiles;
    $('#ids_perfiles').val(selectedIdsProfiles).trigger('chosen:updated');
    const elements = document.querySelectorAll('.form-input');
    elements.forEach(element => {
        if (element.tagName === 'SELECT') {
            $(element).trigger("chosen:updated");
        }
    });
    validationOfRequeridFields();
}

function eliminar_restaurar(id, state) {
    Swal.fire({
        title: `¿Está seguro de ${state === 0 ? 'restaurar' : 'eliminar'} el registro seleccionado?`,
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: `Sí,  ${state === 0 ? 'restaurar' : 'eliminar'}!`
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/deleteOrRestoreUser/?id=${id}&estado=${state}`, {
                method: 'DELETE'
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        mostrarAlerta('alert-success', 'Éxito : ', data.message);
                        renderUsers();
                    } else {
                        alert(data.response);
                    }
                }).catch(error => {
                    if (error.statusCode === 400) {
                        mostrarAlerta('alert-warning', 'Advertencia : ', error.message);
                    }
                });
        }
    });
}

$('#id_career').on('change', function () {
    const selectedValue = $(this).val();
    listarEspecialidadesPorCarrera(selectedValue, '');
});

function listarEspecialidadesPorCarrera(carreraId, valorEstablecido) {
    const contenedorEspecialidades = document.getElementById('id_specialties').parentElement.querySelector('.loader-overlay');
    contenedorEspecialidades.classList.add('active');
    const url = `/especialidades/carrera/${carreraId}`;
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                const selectElement = $('#id_specialties');
                selectElement.empty();
                if (data.data && data.data.length > 0) {
                    selectElement.append('<option value="">Ninguno</option>');
                } else {
                    selectElement.append('<option value="" disabled selected>Sin especialidades disponibles</option>');
                }
                data.data.forEach(especialidad => {
                    const option = `<option value="${especialidad.id}">${especialidad.nombre}</option>`;
                    selectElement.append(option);
                });
                if (valorEstablecido !== '') document.getElementById('id_specialties').value = valorEstablecido === null ? '' : valorEstablecido;
                selectElement.trigger('chosen:updated');
            }
            contenedorEspecialidades.classList.remove('active');
        })
        .catch((error) => {
            contenedorEspecialidades.classList.remove('active');
            console.error("Error al obtener las especialidades:", error);
        });
}

function construirPermisos(path) {
    for (let index = 0; index < menu.length; index++) {
        for (let indexModulo = 0; indexModulo < menu[index].modulos.length; indexModulo++) {
            const modulo = menu[index].modulos[indexModulo];
            if (modulo.url === path) {
                modulo.funciones.forEach((funcion) => {
                    if (funcion.de_registro === 1) {
                        permisosRegisto.push(funcion);
                    } else if (funcion.de_registro === 0 && funcion.funcion !== "listar") {
                        permisosNoRegistro.push(funcion);
                    }
                });
            }
        }
    }
    permisosRegisto.sort((a, b) => {
        if (a.orden === null || a.orden === undefined) return 1; 
        if (b.orden === null || b.orden === undefined) return -1;
        return a.orden - b.orden;
    });
    permisosNoRegistro.sort((a, b) => {
        if (a.orden === null || a.orden === undefined) return 1;
        if (b.orden === null || b.orden === undefined) return -1;
        return a.orden - b.orden;
    });
    renderizarPermisosNoRegistros();
}

function renderizarPermisosNoRegistros() {
    const contenedor = document.getElementById('botonesNoRegistro');
    contenedor.innerHTML = ''; 
    permisosNoRegistro.forEach((permiso) => {
        const boton = document.createElement('button');
        boton.type = 'button';
        if (permiso.clase) {
            const clases = permiso.clase.split(' ');
            boton.classList.add(...clases); 
        }
        boton.classList.add('mt-2', 'mb-2');
        boton.setAttribute('onclick', `${permiso.funcion}()`);
        boton.innerHTML = `
            <i class="${permiso.icono || 'uil uil-cog'}"></i>
        `;
        contenedor.appendChild(boton);
    });
}