let permisosRegisto = [];
let permisosNoRegistro = [];

document.addEventListener("mainJsReady", () => {
    const path = currentPath.split('/').filter(Boolean)[0];
    construirPermisos(path);
    renderizarDatosTabla();
});
$("#basic-datatable").DataTable();
let datosTabla;
const tablaModuloPadre = document.getElementById('tablaModuloPadre');
const entradas = document.querySelectorAll('.form-input');
const idModuloPadre = document.getElementById('idModuloPadre');
const entradasObligatorias = document.querySelectorAll('.requerido');
const guardar = document.getElementById('guardar');
let validacionFormulario;
const loaderModal = document.getElementById('loaderContainer');

function renderizarDatosTabla() {
    fetch('/modulo_padre/bandeja')
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const datos = data.data;
                datosTabla = datos;
                let html = '';
                datos.forEach((modulo_padre) => {
                    let contenidoPermisos = '';
                    if (permisosRegisto.length > 0) {
                        permisosRegisto.forEach((permiso) => {
                            contenidoPermisos += `
                                <button type="button" class="btn btn-${permiso.clase || 'secondary'}" 
                                        style="padding: .13rem .3rem;" 
                                        data-bs-toggle="tooltip" 
                                        data-bs-placement="right" 
                                        title="${permiso.nombre}" 
                                        onclick="${permiso.funcion}(${modulo_padre.id}, ${modulo_padre.estado})">
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
                                        ? modulo_padre.estado === 1 
                                            ? contenidoPermisos
                                            : `<button type="button" class="btn btn-warning" style="padding: .13rem .3rem;" 
                                                    data-bs-toggle="tooltip" 
                                                    data-bs-placement="right" 
                                                    title="Restaurar" 
                                                    onclick="eliminar_restaurar(${modulo_padre.id}, ${modulo_padre.estado})">
                                                    <i class="uil uil-sync"></i>
                                                </button>`
                                        : contenidoPermisos
                                    }
                                </div>
                            </td>
                            <td class="small-medium filas">${modulo_padre.nombre}</td>
                            <td class="small-medium filas">${modulo_padre.enlace}</td>
                            <td class="small-medium filas">${modulo_padre.icono}</td>
                            <td class="small-medium filas">${modulo_padre.orden}</td>
                            <td class="small-medium filas">
                                ${modulo_padre.estado === 1
                                    ? `<div class="bg-success text-center rounded text-white" style="width: 80px">ACTIVO</div>`
                                    : `<div class="bg-danger text-center rounded text-white" style="width: 80px">INACTIVO</div>`
                                }
                            </td>
                            
                        </tr>`;
                });
                $("#basic-datatable").DataTable().destroy();
                tablaModuloPadre.innerHTML = html;
                $("#basic-datatable").DataTable();
            }
        })
        .catch((error) => {
            console.log(error)
        });
}

function crear() {
    tituloModal.textContent = 'AGREGAR MÓDULO PADRE';
    limpiarValoresEntradas();
    validarEntradasObligatorias();
    if(idModuloPadre.value !== '') idModuloPadre.value = '';
    $("#modalModuloPadre").modal("show");
}

function limpiarValoresEntradas() {
    entradas.forEach(entrada => {
        if (entrada.value !== '') entrada.value = '';
    })
}

function construirCargaUtil() {
    const entradasNumericas = ['orden'];
    let cargaUtil = {
        id: idModuloPadre.value == '' ? null : Number(idModuloPadre.value),
    };
    entradas.forEach(entrada => {
        if (entradasNumericas.includes(entrada.id)) {
            cargaUtil[entrada.id] = parseFloat(entrada.value) || null;
        }else {
            cargaUtil[entrada.id] = entrada.value == '' ? null : entrada.value;
        }
    });
    return cargaUtil;
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

guardar.addEventListener('click', function() {
    if (!validacionFormulario) return;
    activarLoaderModal();
    let cargaUtil = construirCargaUtil();
    fetch('/modulo_padre/crear-o-editar', {
        method: 'POST',
        body: JSON.stringify(cargaUtil),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(res => {
            loaderModal.style.display = 'none';
            if (!res.ok) {
                return res.json().then(data => Promise.reject(data)); 
            }
            return res.json();
        })
        .then(data => {
            if (data.success) {
                mostrarAlerta('alert-success', 'Éxito : ', data.message);
                $("#modalModuloPadre").modal("hide");
                renderizarDatosTabla();
            }
        })
        .catch(error => {
            if (error.statusCode === 400) {
                mostrarAlerta('alert-warning', 'Advertencia : ', error.message);
            }
        });
});

function activarLoaderModal() {
    loaderModal.style.display = 'flex';
    loaderModal.style.alignItems = 'center';
    loaderModal.style.justifyContent = 'center';
}

function mostrarAlerta(tipo, titulo, mensaje) {
    const alert = document.getElementById('alertWarning');
    const strongElement = document.getElementById('alertStrongText');
    const messageElement = document.getElementById('alertMessageText');
    strongElement.textContent = titulo;
    messageElement.textContent = mensaje;
    alert.classList.remove('alert-success', 'alert-warning', 'alert-danger', 'alert-info');
    alert.classList.remove('d-none');
    alert.classList.add(tipo);
    setTimeout(() => cerrarAlerta(tipo), 5000);
}

function cerrarAlerta(tipo) {
    const alert = document.getElementById('alertWarning');
    alert.classList.add('d-none');
    alert.classList.remove(tipo);
}

function editar(id, estado) {
    tituloModal.textContent = 'EDITAR MÓDULO PADRE';
    let datosEdicion;
    for (let index = 0; index < datosTabla.length; index++) {
        if (datosTabla[index].id === id) {
            datosEdicion = datosTabla[index];
            break;
        }
    }
    establecerValoreEdicion(datosEdicion);
    $("#modalModuloPadre").modal('show');
}

function establecerValoreEdicion(data) {
    document.getElementById('idModuloPadre').value = data.id;
    document.getElementById('nombre').value = data.nombre;
    document.getElementById('enlace').value = data.enlace;
    document.getElementById('icono').value = data.icono;
    document.getElementById('orden').value = data.orden;
    validarEntradasObligatorias();
}

function eliminar_restaurar(id, estado) {
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
            fetch(`/modulo_padre/eliminar-o-restaurar/?id=${id}&estado=${estado}`, {
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