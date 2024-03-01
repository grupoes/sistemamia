const addUser = document.getElementById('addUser');
const tipoDocumento = document.getElementById('tipoDocumento');
const inputNumeroDocumento = document.getElementById('numeroDocumento');
const searchDni = document.getElementById('searchDni');
const nameUsuario = document.getElementById('nameUsuario');
const lastName = document.getElementById('lastName');
const fechaNacimiento = document.getElementById('fechaNacimiento');

$("#basic-datatable").DataTable();

addUser.addEventListener('click', () => {
    $("#modalAddUser").modal('show');
});

$('[data-plugin="customselect"]').select2();

const ubigeo_user = document.getElementById('ubigeo_user');
const perfil_user = document.getElementById('perfil_user');

renderUsers();
renderUbigeo();
renderPerfil();

function renderUbigeo() {
    fetch('/ubigeos')
    .then(res => res.json())
    .then(data => {
        if(data.status === 'ok') {
            const datos = data.data;

            let html = "";

            datos.forEach(ubigeo => {
                html += `<option value="${ubigeo.id}">${ubigeo.departamento}-${ubigeo.provincia}-${ubigeo.distrito}</option>`;
            });

            ubigeo_user.innerHTML = html;

        } else {
            console.log(data.message);
        }
    })
}

function renderPerfil() {
    fetch('/areas')
    .then(res => res.json())
    .then(data => {
        if(data.status === 'ok') {
            const datos = data.data;

            let html = `<option value="">Seleccionar...</option>`;

            datos.forEach(perfil => {
                html += `<option value="${perfil.id}">${perfil.nombre}</option>`;
            });

            perfil_user.innerHTML = html;

        } else {
            console.log(data.message);
        }
    })
}

const renderTableUsers = document.getElementById('renderTableUsers');

function renderUsers() {
    fetch('/users')
    .then(res => res.json())
    .then(data => {
        if(data.status === 'ok') {
            const datos = data.data;

            let html = ``;

            datos.forEach((user, index) => {
                html += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${user.trabajadore.nombres} ${user.trabajadore.apellidos}</td>
                    <td>${user.trabajadore.fecha_nacimiento}</td>
                    <td>${user.trabajadore.area.nombre}</td>
                    <td>${user.email}</td>
                    <td>${user.password}</td>
                    <td>${user.trabajadore.tipo_trabajo.nombre}</td>
                    <td>
                        <div class="dropdown">
                            <a href="javascript:void(0);" class="table-action-btn dropdown-toggle arrow-none btn btn-light btn-xs" data-bs-toggle="dropdown" aria-expanded="false"><i class="uil uil-ellipsis-h"></i></a>
                            <div class="dropdown-menu dropdown-menu-end">
                                <a class="dropdown-item" href="javascript:void(0);"><i class="uil uil-pen me-2 text-muted vertical-middle"></i>Editar</a>
                                <a class="dropdown-item" href="javascript:void(0);"><i class="uil uil-trash-alt me-2 text-muted vertical-middle"></i>Eliminar</a>
                            </div>
                        </div>
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
    })
}

searchDni.addEventListener('click', () => {
    console.log('aca');
    if(tipoDocumento.value == '1') {
        const numero = inputNumeroDocumento.value;
        if(numero.length == 8) {
            fetch('/api-dni/'+numero)
            .then(res => res.json())
            .then(data => {
                if(data.status === 'ok') {
                    const datos = data.data;

                    nameUsuario.value = datos.nombres;
                    lastName.value = datos.ap_paterno + " " + datos.ap_materno;

                    const partes = datos.fecha_nacimiento.split('/');
                    const fechaFormateada = partes[2] + '-' + partes[1] + '-' + partes[0];
                    fechaNacimiento.value = fechaFormateada;

                } else {
                    console.log(data.message);
                }
            })
        } else {
            alert('Ingrese un DNI correcto de 8 digitos');
        }
        
    }
});