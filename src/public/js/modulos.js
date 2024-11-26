let permisosRegisto = [];
let permisosNoRegistro = [];

document.addEventListener("mainJsReady", () => {
    const path = currentPath.split('/').filter(Boolean)[0];
    construirPermisos(path);
    renderModulos();
});

$("#basic-datatable").DataTable();
const viewActions = document.getElementById("viewActions");
const listModulos = document.getElementById("tablaModulos");
const formulario = document.getElementById("formulario");
const guardar = document.getElementById("guardar");
const entradasObligatorias = document.querySelectorAll(".requerido");
const modulo_podre = document.getElementById("modulo_padre");
const idModulo = document.getElementById("idModulo");
const entradas = document.querySelectorAll(".form-input");
const contenedorLoader = document.getElementById("loaderContainer");
const tituloModal = document.getElementById('tituloModal');
const permisosTablaCuerpo = document.getElementById('permisosTablaCuerpo');
const selectPermiso = document.getElementById('permisos');
let acciones = [];
let validacionFormulario;
let datosTabla;
let permisoContador = 1;
let alertaTimeout;

$(document).ready(function () {
    $(".chosen-select").chosen({
        no_results_text: "No se encontraron resultados de :",
        width: "100%",
        heigth: "100%",
    });
});

function renderModulos() {
    fetch("/render-modulos", {
        headers: {
            'Authorization': 'Bearer ' + token_,
        }
    })
        .then((res) => res.json())
        .then((data) => {
            renderView(data.data);
        });
}

function renderView(data) {
    let html = "";
    $("#basic-datatable").DataTable().destroy();
    datosTabla = data;
    data.forEach((modulo) => {
        let contenidoPermisos = '';
        if (permisosRegisto.length > 0) {
            permisosRegisto.forEach((permiso) => {
                contenidoPermisos += `
                    <button type="button" class="btn btn-${permiso.clase || 'secondary'}" 
                            style="padding: .13rem .3rem;" 
                            data-bs-toggle="tooltip" 
                            data-bs-placement="right" 
                            title="${permiso.nombre}" 
                            onclick="${permiso.funcion}(${modulo.id}, ${modulo.estado})">
                        <i class="${permiso.icono || 'uil uil-cog'}"></i>
                    </button>
                `;
            });
        } else {
            contenidoPermisos = '<span class="text-muted">Sin permisos</span>';
        }
        html += `
        <tr>
            <td class="small-medium filas" style="max-width: 100px;">
                <div class="d-flex" style="column-gap: 5px">
                    ${permisosRegisto.length > 0
                        ? modulo.estado === 1 
                            ? contenidoPermisos
                            : `<button type="button" class="btn btn-warning" style="padding: .13rem .3rem;" 
                                      data-bs-toggle="tooltip" 
                                      data-bs-placement="right" 
                                      title="Restaurar" 
                                      onclick="eliminar_restaurar(${modulo.id}, ${modulo.estado})">
                                    <i class="uil uil-sync"></i>
                                </button>`
                        : contenidoPermisos
                    }
                </div>
            </td>
            <td class="small-medium filas">${modulo.nombre}</td>
            <td class="small-medium filas">${modulo.modulo_padre.nombre}</td>
            <td class="small-medium filas">${modulo.url}</td>
            <td class="small-medium filas">${modulo.orden}</td>
            <td class="small-medium filas">
                ${modulo.estado === 1
                ? `<div class="bg-success text-center rounded text-white" style="width: 80px">ACTIVO</div>`
                : `<div class="bg-danger text-center rounded text-white" style="width: 80px">INACTIVO</div>`
                }
            </td>
        </tr>
        `;
    });
    listModulos.innerHTML = html;
    $("#basic-datatable").DataTable();
}

function crear() {
    tituloModal.textContent = 'AGREGAR MÓDULO';
    $("#modalModulo").modal("show");
    formulario.reset();
    const sinData = document.getElementById('sinData');
    if (sinData === null) {
        limpiarTablaPermisos();
        acciones = [];
        permisoContador = 1;
    }
    if(idModulo.value !== '') idModulo.value = '';
    validarEntradasObligatorias();
    $(modulo_podre).trigger("chosen:updated");
    $(selectPermiso).trigger("chosen:updated");
}

function renderActions() {
    fetch("/listActions")
        .then((res) => res.json())
        .then((data) => {
            if (data.status === "error") {
                alert("Ocurrio un error");
                return false;
            }

            const datos = data.data;

            viewActionsHtml(datos);
        });
}

function viewActionsHtml(data) {
    let actions = "";
    actions += `<input type="hidden" name="actions" value="1">`;
    data.forEach((action) => {
        let check = "";
        let readonly = "";

        if (action.id == 1) {
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
    fetch("/getModulePadres")
        .then((res) => res.json())
        .then((data) => {
            let html = `<option value="">Seleccione...</option>`;

            const datos = data.data;

            datos.forEach((padre) => {
                html += `
            <option value="${padre.id}">${padre.name}</option>
            `;
            });

            modulopadre.innerHTML = html;
        });
}

formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validacionFormulario) return;
    activarLoaderModal();
    const cargaUtil = construirCargaUtil();
    fetch("/modulo/crear-o-editar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(cargaUtil),
    })
        .then((res) => {
            contenedorLoader.style.display = "none";
            if (!res.ok) {
                return res.json().then((data) => Promise.reject(data));
            }
            return res.json();
        })
        .then((data) => {
            if (data.success) {
                mostrarAlerta("alert-success", "Éxito : ", data.message);
                $("#modalModulo").modal("hide");
                renderModulos();
            }
        })
        .catch((error) => {
            if (error.statusCode === 400) {
                mostrarAlerta("alert-warning", "Advertencia : ", error.message);
            }
        });
});

listModulos.addEventListener("click", (e) => {
    if (e.target.classList.contains("editModule")) {
        $("#modalModulo").modal("show");

        renderModulosPadres();

        const id = e.target.getAttribute("data-id");

        fetch("/getModule/" + id)
            .then((res) => res.json())
            .then((data) => {
                viewEditModule(data.data);
            });
    }
});

function viewEditModule(data) {
    const nameModule = document.getElementById("nameModule");
    const urlModulo = document.getElementById("urlModulo");
    const iconoModulo = document.getElementById("iconoModulo");
    nameModule.value = data.name;
    urlModulo.value = data.url;
    iconoModulo.value = data.icono;
}

function validarEntradasObligatorias() {
    let validacionCompleta = true;
    for (let entrada of entradasObligatorias) {
        if (entrada.value == "") {
            validacionCompleta = false;
            break;
        }
    }
    if(acciones.length === 0) 
        validacionCompleta = false;
    if (guardar.disabled !== !validacionCompleta)
        guardar.disabled = !validacionCompleta;
    validacionFormulario = validacionCompleta;
}

function construirCargaUtil() {
    const entradasNumericas = ["modulo_padre", "orden"];
    let cargaUtil = {
        id: idModulo.value == "" ? null : Number(idModulo.value),
        acciones: acciones
    };
    entradas.forEach((entrada) => {
        if (entradasNumericas.includes(entrada.id)) {
            cargaUtil[entrada.id] = parseFloat(entrada.value) || null;
        } else {
            cargaUtil[entrada.id] = entrada.value == "" ? null : entrada.value;
        }
    });
    return cargaUtil;
}

function activarLoaderModal() {
    contenedorLoader.style.display = "flex";
    contenedorLoader.style.alignItems = "center";
    contenedorLoader.style.justifyContent = "center";
}

function mostrarAlerta(tipo, titulo, mensaje) {
    const alert = document.getElementById("alertWarning");
    const strongElement = document.getElementById("alertStrongText");
    const messageElement = document.getElementById("alertMessageText");
    if (alertaTimeout) {
        clearTimeout(alertaTimeout);
    }
    strongElement.textContent = titulo;
    messageElement.textContent = mensaje;
    alert.classList.remove("alert-success", "alert-warning", "alert-danger", "alert-info");
    alert.classList.remove("d-none");
    alert.classList.add(tipo);
    alertaTimeout = setTimeout(() => cerrarAlerta(tipo), 5000);
}

function cerrarAlerta(tipo) {
    const alert = document.getElementById("alertWarning");
    alert.classList.add("d-none");
    alert.classList.remove(tipo);
}

function editar(id, estado) {
    tituloModal.textContent = 'EDITAR MÓDULO';
    let datosEdicion;
    for (let index = 0; index < datosTabla.length; index++) {
        if (datosTabla[index].id === id) {
            datosEdicion = datosTabla[index];
            break;
        }
    }
    const sinData = document.getElementById('sinData');
    if (sinData === null) {
        limpiarTablaPermisos();
        permisoContador = 1;
    }
    if(acciones.length > 0) acciones = [];
    if(selectPermiso.value !== '') {
        selectPermiso.value = '';
        $(selectPermiso).trigger("chosen:updated");
    }
    establecerValoreEdicion(datosEdicion);
    $("#modalModulo").modal('show');
}

function establecerValoreEdicion(data) {
    idModulo.value = data.id;
    document.getElementById('nombre').value = data.nombre;
    document.getElementById('modulo_padre').value = data.modulopadre_id;
    document.getElementById('url').value = data.url;
    document.getElementById('orden').value = data.orden;
    $(modulo_podre).trigger("chosen:updated");
    data.funciones.forEach((element) => {
        construirTablaPermisos(element.id, element.nombre);
    })
    validarEntradasObligatorias();
}

function eliminar_restaurar(id, estado ){
    Swal.fire({
        title: `¿Está seguro de ${estado === 0 ? 'restaurar' : 'eliminar'} el registro seleccionado?`,
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: `Sí,  ${estado === 0 ? 'restaurar' : 'eliminar'}!`
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/modulo/eliminar-o-restaurar/?id=${id}&estado=${estado}`, {
                method: 'DELETE'
            })
            .then(res => res.json())
            .then(data => {
                if(data.success) {
                    mostrarAlerta('alert-success', 'Éxito : ', data.message);
                    renderModulos();
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

function manejarSeleccionPermiso(event) {
    const permisoId = event.target.value;
    const permisoNombre = event.target.selectedOptions[0].getAttribute('data-nombre');
    if (document.querySelector(`#permiso-row-${permisoId}`)) {
        mostrarAlerta("alert-warning", "Advertencia : ", `El permiso ${permisoNombre} ya fue añadido.`);
        return;
    }
    construirTablaPermisos(Number(permisoId), permisoNombre);
    event.target.value = "";
    $('#permisos').trigger("chosen:updated");
    validarEntradasObligatorias();
}

function construirTablaPermisos(permisoId, permisoNombre) {
    const sinData = document.getElementById('sinData');
    if (sinData) {
        permisosTablaCuerpo.removeChild(sinData);
    }
    const row = document.createElement('tr');
    row.id = `permiso-row-${permisoId}`;
    row.innerHTML = `
        <td class="border-bottom border-dark">${permisoContador++}</td>
        <td class="border-bottom border-dark">${permisoNombre}</td>
        <td class="border-bottom border-dark">
            <button type="button" class="btn btn-danger" style="padding: .15rem .3rem;" data-bs-toggle="tooltip"
                data-bs-placement="right" title="Restaurar" onclick="eliminarPermiso(${permisoId})">
                <i class="uil uil-glass-tea"></i>
            </button>
        </td>
    `;
    permisosTablaCuerpo.appendChild(row);
    acciones.push(permisoId);
}

function eliminarPermiso(permisoId) {
    const row = document.getElementById(`permiso-row-${permisoId}`);
    if (row) {
        row.remove();
        permisoContador--;
    }
    const index = acciones.indexOf(permisoId);
    if (index !== -1) {
        acciones.splice(index, 1); 
    }
    if (permisosTablaCuerpo.children.length === 0) limpiarTablaPermisos();
    validarEntradasObligatorias();
}

function limpiarTablaPermisos() {
    permisosTablaCuerpo.innerHTML = `
        <tr class="w-full text-center" id="sinData">
            <td colspan="3" class="border-bottom border-dark">
                <div class="w-full text-center">Seleccionar e ingresar permisos.</div>
            </td>
        </tr>
    `;
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
