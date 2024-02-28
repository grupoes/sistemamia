$('#tableActivity').DataTable();

const addActivity = document.getElementById('addActivity');
const renderActivityView = document.getElementById('renderActivity');
const formActivity = document.getElementById('formActivity');
const idActivity = document.getElementById('idActivity');
const name_activity =document.getElementById('name_activity');
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
        if(data.status === 'ok') {
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

    if(idActivity.value === '0') {
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
    fetch('/activities/'+id, {
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

    fetch('/activities/'+id)
    .then(res => res.json())
    .then(data => {
        if(data.status === 'ok') {
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
          fetch('/activities-status/'+id, {
            method: 'PUT',
            body: JSON.stringify(),
            headers: {
                'Content-Type': 'application/json',
            },
          })
          .then(res => res.json())
          .then(data => {
            if(data.status === 'ok') {
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