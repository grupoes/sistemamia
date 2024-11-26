let permisosRegisto = [];
let permisosNoRegistro = [];

document.addEventListener("mainJsReady", () => {
    const path = currentPath.split('/').filter(Boolean)[0];
    construirPermisos(path);
    renderizarDatosTabla();
});

$("#basic-datatable").DataTable();
let datosTabla;
const tablaFunciones = document.getElementById('tablaFunciones');
const guardar = document.getElementById('guardar');
const entradasObligatorias = document.querySelectorAll('.requerido');
const entradas = document.querySelectorAll(".form-input");
const tituloModal = document.getElementById('tituloModal');
const formulario = document.getElementById("formulario");
const contenedorLoader = document.getElementById("loaderContainer");
const idFuncion = document.getElementById("idFuncion");
let validacionFormulario;
let de_registro;

function renderizarDatosTabla() {
    fetch('/funcion/bandeja')
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const datos = data.data;
                datosTabla = datos;
                let html = '';
                datos.forEach((funcion) => {
                    let contenidoPermisos = '';
                    if (permisosRegisto.length > 0) {
                        permisosRegisto.forEach((permiso) => {
                            contenidoPermisos += `
                                <button type="button" class="btn btn-${permiso.clase || 'secondary'}" 
                                        style="padding: .13rem .3rem;" 
                                        data-bs-toggle="tooltip" 
                                        data-bs-placement="right" 
                                        title="${permiso.nombre}" 
                                        onclick="${permiso.funcion}(${funcion.id}, ${funcion.estado})">
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
                                        ? funcion.estado === 1 
                                            ? contenidoPermisos
                                            : `<button type="button" class="btn btn-warning" style="padding: .13rem .3rem;" 
                                                    data-bs-toggle="tooltip" 
                                                    data-bs-placement="right" 
                                                    title="Restaurar" 
                                                    onclick="eliminar_restaurar(${funcion.id}, ${funcion.estado})">
                                                    <i class="uil uil-sync"></i>
                                                </button>`
                                        : contenidoPermisos
                                    }
                                </div>
                            </td>
                            <td class="small-medium filas">${funcion.nombre}</td>
                            <td class="small-medium filas">${funcion.funcion}</td>
                            <td class="small-medium filas">${funcion.icono === null ? '' : funcion.icono}</td>
                            <td class="small-medium filas">${funcion.clase === null ? '' : funcion.clase}</td>
                            <td class="small-medium filas">${funcion.de_registro === 1 ? 'SI': 'NO'}</td>
                            <td class="small-medium filas">${funcion.orden === null ? '' : funcion.orden}</td>
                            <td class="small-medium filas">
                                ${funcion.estado === 1
                                    ? `<div class="bg-success text-center rounded text-white" style="width: 80px">ACTIVO</div>`
                                    : `<div class="bg-danger text-center rounded text-white" style="width: 80px">INACTIVO</div>`
                                }
                            </td>
                            
                        </tr>`;
                });
                $("#basic-datatable").DataTable().destroy();
                tablaFunciones.innerHTML = html;
                $("#basic-datatable").DataTable();
            }
        })
        .catch((error) => {
            console.log(error)
        });
}

function crear() {
    tituloModal.textContent = 'AGREGAR FUNCIÓN';
    de_registro = 1;
    formulario.reset();
    if(idFuncion.value !== '') idFuncion.value = '';
    validarEntradasObligatorias();
    $("#modalFuncion").modal("show");
}

function validarEntradasObligatorias() {
    let validacionCompleta = true;
    for(let entrada of entradasObligatorias) {
        if(entrada.value == '') {
            validacionCompleta = false;
            break;
        }
    }
    if(guardar.disabled !== !validacionCompleta) guardar.disabled = !validacionCompleta;
    validacionFormulario = validacionCompleta;
}

function manejarCambioRadio(event) {
    const valorSeleccionado = event.target.value;
    de_registro = valorSeleccionado === 'SI' ? 1 : 0;
}

formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validacionFormulario) return;
    activarLoaderModal();
    const cargaUtil = construirCargaUtil();
    fetch("/funcion/crear-o-editar", {
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
                $("#modalFuncion").modal("hide");
                renderizarDatosTabla();
            }
        })
        .catch((error) => {
            if (error.statusCode === 400) {
                mostrarAlerta("alert-warning", "Advertencia : ", error.message);
            }
        });
});

function activarLoaderModal() {
    contenedorLoader.style.display = "flex";
    contenedorLoader.style.alignItems = "center";
    contenedorLoader.style.justifyContent = "center";
}

function construirCargaUtil() {
    const entradasNumericas = ["orden"];
    let cargaUtil = {
        id: idFuncion.value == "" ? null : Number(idFuncion.value),
        de_registro: de_registro
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

function mostrarAlerta(tipo, titulo, mensaje) {
    const alert = document.getElementById("alertWarning");
    const strongElement = document.getElementById("alertStrongText");
    const messageElement = document.getElementById("alertMessageText");
    strongElement.textContent = titulo;
    messageElement.textContent = mensaje;
    alert.classList.remove(
        "alert-success",
        "alert-warning",
        "alert-danger",
        "alert-info"
    );
    alert.classList.remove("d-none");
    alert.classList.add(tipo);
    setTimeout(() => cerrarAlerta(tipo), 5000);
}

function cerrarAlerta(tipo) {
    const alert = document.getElementById("alertWarning");
    alert.classList.add("d-none");
    alert.classList.remove(tipo);
}

function editar(id, estado) {
    tituloModal.textContent = 'EDITAR FUNCIÓN';
    let datosEdicion;
    for (let index = 0; index < datosTabla.length; index++) {
        if (datosTabla[index].id === id) {
            datosEdicion = datosTabla[index];
            break;
        }
    }
    establecerValoreEdicion(datosEdicion);
    $("#modalFuncion").modal('show');
}

function establecerValoreEdicion(data) {
    idFuncion.value = data.id;
    document.getElementById('nombre').value = data.nombre;
    document.getElementById('funcion').value = data.funcion;
    document.getElementById('icono').value = data.icono === null ? '' : data.icono;
    document.getElementById('clase').value = data.clase === null ? '' : data.clase;
    document.getElementById('orden').value = data.orden === null ? '' : data.orden;
    if (data.de_registro === 1) {
        document.getElementById('customRadio1').checked = true;
    } else {
        document.getElementById('customRadio2').checked = true;
    }
    de_registro = data.de_registro;
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
            fetch(`/funcion/eliminar-o-restaurar/?id=${id}&estado=${estado}`, {
                method: 'DELETE'
            })
            .then(res => res.json())
            .then(data => {
                if(data.success) {
                    mostrarAlerta('alert-success', 'Éxito : ', data.message);
                    renderizarDatosTabla();
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