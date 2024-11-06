const addProfile = document.getElementById('addProfile');
const id = document.getElementById('idProfile');
const nameProfile = document.getElementById('nameProfile');
const description = document.getElementById('description');
const renderTableProfiles = document.getElementById('renderTableProfiles');
const save = document.getElementById('saveProfile');
const loaderContainer = document.getElementById('loaderContainer');
let dataSourceTable;

$("#basic-datatable").DataTable();
renderDataTable();

addProfile.addEventListener('click', () => {
    resetValuesForm();
    $("#modalAddProfile").modal('show');
    validateForm();
});

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
                datos.forEach((perfil, index) => {
                    html += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${perfil.nombre}</td>
                    <td>${perfil.descripcion}</td>
                    <td>
                        ${perfil.estado === 1
                            ? `<div class="bg-success text-center rounded text-white" style="width: 80px">ACTIVO</div>`
                            : `<div class="bg-danger text-center rounded text-white" style="width: 80px">INACTIVO</div>`
                        }
                    </td>
                    <td>
                        ${perfil.estado === 1
                            ? `<div class="dropdown">
                                    <a href="javascript:void(0);" class="table-action-btn dropdown-toggle arrow-none btn btn-light btn-xs" data-bs-toggle="dropdown" aria-expanded="false"><i class="uil uil-ellipsis-h"></i></a>
                                    <div class="dropdown-menu dropdown-menu-end">
                                        <a class="dropdown-item" href="javascript:void(0);" onclick="editProfile(${perfil.id})"><i class="uil uil-pen me-2 text-muted vertical-middle"></i>Editar</a>
                                        <a class="dropdown-item" href="javascript:void(0);" onclick="deleteOrRestore(${perfil.id}, ${perfil.estado})"><i class="uil uil-trash-alt me-2 text-muted vertical-middle"></i>Eliminar</a>
                                    </div>
                                </div>`
                            : `<div class="dropdown">
                                    <a href="javascript:void(0);" class="table-action-btn dropdown-toggle arrow-none btn btn-light btn-xs" data-bs-toggle="dropdown" aria-expanded="false"><i class="uil uil-ellipsis-h"></i></a>
                                    <div class="dropdown-menu dropdown-menu-end">
                                        <a class="dropdown-item" href="javascript:void(0);" onclick="deleteOrRestore(${perfil.id}, ${perfil.estado})"><i class="uil uil-sync me-2 text-muted vertical-middle"></i>Activar</a>
                                    </div>
                                </div>`
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

function editProfile(id) {
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

function deleteOrRestore(id, state) {
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