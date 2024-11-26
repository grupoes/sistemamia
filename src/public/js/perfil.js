let permisosRegisto = [];
let permisosNoRegistro = [];

document.addEventListener("mainJsReady", () => {
    const path = currentPath.split('/').filter(Boolean)[0];
    construirPermisos(path);
    renderDataTable();
});

const addProfile = document.getElementById('addProfile');
const id = document.getElementById('idProfile');
const nameProfile = document.getElementById('nameProfile');
const description = document.getElementById('description');
const renderTableProfiles = document.getElementById('renderTableProfiles');
const save = document.getElementById('saveProfile');
const loaderContainer = document.getElementById('loaderContainer');
let dataSourceTable;

$("#basic-datatable").DataTable();

function crear() {
    resetValuesForm();
    $("#modalAddProfile").modal('show');
    validateForm();
}

nameProfile.addEventListener('input', function () {
    this.value = this.value.toUpperCase();
    validateForm();
});

description.addEventListener('input', function () {
    this.value = this.value.toUpperCase();
});

function renderDataTable() {
    fetch('/listProfiles')
        .then(res => res.json())
        .then(data => {
            if (data.status === 'ok') {
                const datos = data.data;
                dataSourceTable = datos;
                let html = ``;
                datos.forEach((perfil) => {
                    let contenidoPermisos = '';
                    if (permisosRegisto.length > 0) {
                        permisosRegisto.forEach((permiso) => {
                            contenidoPermisos += `
                                <button type="button" class="btn btn-${permiso.clase || 'secondary'}" 
                                        style="padding: .13rem .3rem;" 
                                        data-bs-toggle="tooltip" 
                                        data-bs-placement="right" 
                                        title="${permiso.nombre}" 
                                        onclick="${permiso.funcion}(${perfil.id}, ${perfil.estado})">
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
                                        ? perfil.estado === 1 
                                            ? contenidoPermisos
                                            : `<button type="button" class="btn btn-warning" style="padding: .13rem .3rem;" 
                                                    data-bs-toggle="tooltip" 
                                                    data-bs-placement="right" 
                                                    title="Restaurar" 
                                                    onclick="eliminar_restaurar(${perfil.id}, ${perfil.estado})">
                                                    <i class="uil uil-sync"></i>
                                                </button>`
                                        : contenidoPermisos
                                    }
                                </div>
                            </td>
                            <td class="small-medium filas">${perfil.nombre}</td>
                            <td class="small-medium filas">${perfil.descripcion === null ? '' : perfil.descripcion}</td>
                            <td class="small-medium filas">
                                ${perfil.estado === 1
                                    ? `<div class="bg-success text-center rounded text-white" style="width: 80px">ACTIVO</div>`
                                    : `<div class="bg-danger text-center rounded text-white" style="width: 80px">INACTIVO</div>`
                                }
                            </td>
                        </tr>
                        `;
                });
                $("#basic-datatable").DataTable().destroy();
                renderTableProfiles.innerHTML = html;
                $("#basic-datatable").DataTable();
            } else {
                console.log(data.message);
            }
        })
}

save.addEventListener('click', () => {
    activateLoad();
    const payload = buildPayload();
    fetch('/saveProfile', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(res => res.json())
        .then(data => {
            loaderContainer.style.display = 'none';
            if (data.message === 'ok') {
                Swal.fire({
                    position: "top-center",
                    icon: "success",
                    title: data.dialog,
                    showConfirmButton: false,
                    timer: 1500
                });
                $("#modalAddProfile").modal("hide");
                renderDataTable();
            } else {
                Swal.fire({
                    position: "top-center",
                    icon: "danger",
                    title: data.response,
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        })
});

function validateForm() {
    if (nameProfile.value.trim() === "") {
        save.disabled = true;
    } else {
        save.disabled = false;
    }
}

function activateLoad() {
    loaderContainer.style.display = 'flex';
    loaderContainer.style.alignItems = 'center';
    loaderContainer.style.justifyContent = 'center';
}

function editar(id, estado) {
    let dataFiltered;
    for (let index = 0; index < dataSourceTable.length; index++) {
        if (dataSourceTable[index].id === id) {
            dataFiltered = dataSourceTable[index];
            break;
        }

    }
    setEditValues(dataFiltered);
    $("#modalAddProfile").modal('show');
    validateForm();
}

function setEditValues(data) {
    id.value = data.id;
    nameProfile.value = data.nombre;
    description.value = data.descripcion;
}

function resetValuesForm() {
    id.value = "0";
    nameProfile.value = "";
    description.value = "";
}

function buildPayload() {
    const payload = {
        idProfile: id.value,
        nameProfile: nameProfile.value,
        description: description.value,
    }
    return payload;
}

function eliminar_restaurar(id, state) {
    Swal.fire({
        title: `¿Está seguro de ${state === 0 ? 'activar' : 'eliminar'} el registro seleccionado?`,
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: `Sí,  ${state === 0 ? 'activar' : 'eliminar'}!`
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/deleteOrRestoreProfile/?id=${id}&estado=${state}`)
            .then(res => res.json())
            .then(data => {
                if(data.message === 'ok') {
                    Swal.fire({
                        position: "top-center",
                        icon: "success",
                        title: data.dialog,
                        showConfirmButton: false,
                        timer: 3000
                    });
                    renderDataTable();
                } else {
                    alert(data.response);
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