$('#tableActivity').DataTable();

const addActivity = document.getElementById('addActivity');
const renderActivityView = document.getElementById('renderActivity');
const formActivity = document.getElementById('formActivity');
const idActivity = document.getElementById('idActivity');
const name_activity = document.getElementById('name_activity');
const description_activity = document.getElementById('description_activity');
const titleModalActivity = document.getElementById('titleModalActivity');
const btnActivity = document.getElementById('btnActivity');

addActivity.addEventListener('click', () => {
    $("#modalActivity").modal('show');
    idActivity.value = '0';
    titleModalActivity.textContent = 'Agregar Actividad';
    btnActivity.textContent = 'Guardar';
    formActivity.reset();
});

renderActivity();

function renderActivity() {
    fetch('/activities')
        .then(res => res.json())
        .then(data => {
            if (data.status === 'ok') {
                viewRender(data);
            } else {
                console.log(data.message);
            }
        })
}

function viewRender(data) {
    let html = "";

    const datos = data.data;

    datos.forEach((activity, index) => {
        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${activity.name}</td>
                <td>${activity.description}</td>
                <td>
                    <button type="button" class="btn btn-info" onclick="editarActividad(${activity.id})">Editar</button>
                    <button type="button" class="btn btn-danger" onclick="eliminarActividad(${activity.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    $('#tableActivity').DataTable().destroy();
    renderActivityView.innerHTML = html;

    $('#tableActivity').DataTable();
}

formActivity.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(formActivity);

    const formDataObj = {};

    formData.forEach((value, key) => {
        formDataObj[key] = value;
    });

    if (idActivity.value === '0') {
        createActivity(formDataObj);
    } else {
        updateActivity(idActivity.value, formDataObj);
    }
});

function createActivity(data) {
    btnActivity.disabled = true;
    btnActivity.textContent = 'Agregando...';
    fetch('/activities', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(res => res.json())
        .then(data => {
            btnActivity.disabled = false;
            btnActivity.textContent = 'Agregar';

            if (data.status === 'ok') {
                Swal.fire({
                    position: "top-center",
                    icon: "success",
                    title: "Se agregó correctamente la actividad",
                    showConfirmButton: false,
                    timer: 1500
                });

                $("#modalActivity").modal('hide');

                renderActivity();
            } else {
                Swal.fire({
                    title: "Error!",
                    text: data.message,
                    icon: "error"
                });
            }
        })
}

function updateActivity(id, data) {
    btnActivity.disabled = true;
    btnActivity.textContent = 'Editando...';
    fetch('/activities/' + id, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(res => res.json())
        .then(data => {
            btnActivity.disabled = false;
            btnActivity.textContent = 'Editar';

            if (data.status === 'ok') {
                Swal.fire({
                    position: "top-center",
                    icon: "success",
                    title: "Se editó correctamente la actividad",
                    showConfirmButton: false,
                    timer: 1500
                });

                $("#modalActivity").modal('hide');

                renderActivity();
            } else {
                Swal.fire({
                    title: "Error!",
                    text: data.message,
                    icon: "error"
                });
            }
        })
}

function editarActividad(id) {
    $("#modalActivity").modal('show');
    idActivity.value = id;
    titleModalActivity.textContent = 'Editar Actividad';
    btnActivity.textContent = 'Editar';

    fetch('/activities/' + id)
        .then(res => res.json())
        .then(data => {
            if (data.status === 'ok') {
                name_activity.value = data.data.name;
                description_activity.value = data.data.description;
            } else {
                console.log(data.message);
            }
        })
}

function eliminarActividad(id) {
    Swal.fire({
        title: "¿Desea Eliminar?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('/activities-status/' + id, {
                method: 'PUT',
                body: JSON.stringify(),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'ok') {
                        Swal.fire({
                            position: "top-center",
                            icon: "success",
                            title: "Se elimino correctamente la actividad",
                            showConfirmButton: false,
                            timer: 1500
                        });

                        renderActivity();
                    } else {
                        Swal.fire({
                            title: "Error!",
                            text: data.message,
                            icon: "error"
                        });
                    }
                })
        }
    });
}

renderPerfiles();

function renderPerfiles() {
    const perfiles = document.getElementById('data-perfiles');

    fetch('/areas')
        .then(res => res.json())
        .then(data => {
            if (data.status === 'ok') {
                let html = "";
                const datos = data.data;

                datos.forEach(perfil => {
                    html += `
                <button type="button" class="list-group-item list-group-item-action" data-id="${perfil.id}">
                    ${perfil.nombre}
                </button>
                `;
                });

                let view = `
                <div class="list-group">
                    ${html}
                </div>
                `;

                perfiles.innerHTML = view;

                selectPerfil();

            } else {
                console.log(data.message);
            }
        })
}

function selectPerfil() {
    const buttons = document.querySelectorAll('.list-group-item');

    buttons.forEach(button => {
        button.addEventListener('click', function () {
            buttons.forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');

            const id = this.getAttribute('data-id');
            
            fetch('/activities-perfil/'+id)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'ok') {
                    viewListActividades(data.data, id);
                } else {
                    console.log(data.message);
                }
            })
        });
    });
}

const listaActividades = document.getElementById('listaActividades');

function viewListActividades(data, perfil) {

    let html = "";

    data.forEach(activity => {

        let checked = "";

        if (activity.check === 1) {
            checked = `checked=""`;
        }

        html += `
        <div class="form-check mb-1 ms-3">
            <input type="checkbox" class="form-check-input check-activity" id="activity-${activity.id}" value="${activity.id}" data-perfil="${activity.perfil}" ${checked}>
            <label class="form-check-label" for="activity-${activity.id}">${activity.nombre}</label>
        </div>
        `;
    });

    let viewCard = `
    <div class="card">
        <div class="card-body">
            <div class="form-check">
                <input type="checkbox" class="form-check-input" id="todos" value="${perfil}" onclick="todosCheck(event)">
                <label class="form-check-label" for="todos">TODOS</label>
            </div>
            ${html}
        </div>
    </div>
    `;

    listaActividades.innerHTML = viewCard;
}

function todosCheck(e){
    const actividades = document.querySelectorAll('.check-activity');

    if (e.target.checked) {
        let datos = [];
        actividades.forEach(act => {
            act.checked = true;

            datos.push(act.value);
        });

        const enviar = {
            perfil: e.target.value,
            activities: datos
        }

        fetch('/activities-perfil-all', {
            method: 'POST',
            body: JSON.stringify(enviar),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
        })

    } else {
        actividades.forEach(act => {
            act.checked = false;
        });

        fetch('/activities-perfil-all/'+e.target.value)
        .then(res => res.json())
        .then(data => {
            console.log(data);
        })
    }

}

listaActividades.addEventListener('click', (e) => {
    if (e.target.classList.contains('check-activity')) {
        const activity = e.target.value;
        const perfil = e.target.getAttribute('data-perfil');

        if(e.target.checked) {
            const data = {
                perfil: perfil,
                activity: activity
            }

            addPerfilActivity(data);

        } else {
            deletePerfilActivity(perfil, activity);
        }
    }
});

function addPerfilActivity(datos) {
    fetch('/activities-perfil', {
        method: 'POST',
        body: JSON.stringify(datos),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
    })
}

function deletePerfilActivity(perfil, activity) {
    fetch(`/activities-perfil/${perfil}/${activity}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
    })
}