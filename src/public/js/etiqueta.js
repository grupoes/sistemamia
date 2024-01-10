$('#tableEtiqueta').DataTable();
$('#tableEmbudo').DataTable();

const renderEti = document.getElementById('renderEtiquetas');
const allEmbudo = document.getElementById('allEmbudo');
const addEtiqueta = document.getElementById('addEtiqueta');
const formEtiqueta = document.getElementById('formEtiqueta');
const guardarEtiqueta = document.getElementById('guardarEtiqueta');

const nombre_etiqueta = document.getElementById('nombre_etiqueta');
const selectEmbudos = document.getElementById('selectEmbudo');

const titleModalEtiqueta = document.getElementById('titleModalEtiqueta');
const idetiqueta = document.getElementById('idetiqueta');

renderEtiquetas();

function renderEtiquetas() {
    fetch('/getEtiquetasAll')
    .then(res => res.json())
    .then(data => {
        if(data.message === 'ok') {
            const datos = data.response;

            viewEtiquetaas(datos);
        
        } else {
            alert(data.response);
        }
    })
}

function viewEtiquetaas(data) {
    let trs = "";

    data.forEach((etiqueta, index) => {
        trs += `
            <tr>
                <td>${index + 1}</td>
                <td>${etiqueta.descripcion}</td>
                <td>${etiqueta.embudo.descripcion}</td>
                <td>
                    <button type="button" class="btn btn-info" onclick="editEtiqueta(${etiqueta.id})">Editar</button>
                    <button type="button" class="btn btn-danger" onclick="deleteEtiqueta(${etiqueta.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    $('#tableEtiqueta').DataTable().destroy();
    renderEti.innerHTML =trs;

    $('#tableEtiqueta').DataTable();
}

renderEmbudo();

function renderEmbudo() {
    fetch('/allEmbudo')
    .then(res => res.json())
    .then(data => {
        if (data.message === 'ok') {
            const datos = data.response;

            tbodyEmbudo(datos);
        } else {
            alert(data.response);
        }
    })
}

function tbodyEmbudo(data) {
    let trs = "";

    data.forEach((embudo, index) => {
        trs += `
            <tr>
                <td>${index + 1}</td>
                <td>${embudo.descripcion}</td>
                <td>
                    <button type="button" class="btn btn-info" onclick="editEmbudo(${embudo.id})">Editar</button>
                    <button type="button" class="btn btn-danger" onclick="deleteEmbudo(${embudo.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    $('#tableEmbudo').DataTable().destroy();
    allEmbudo.innerHTML = trs;
    $('#tableEmbudo').DataTable();
}

function selectEmbudo() {
    fetch('/allEmbudo')
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data.message === 'ok') {
                const datos = data.response;
    
                let select = `<option value="">Seleccione...</option>`;

                datos.forEach(embudo => {
                    select += `<option value="${embudo.id}">${embudo.descripcion}</option>`;
                });

                selectEmbudos.innerHTML = select;

            } else {
                alert(data.response);
            }
        })
}

addEtiqueta.addEventListener('click', () => {
    $("#modalEtiqueta").modal("show");
    selectEmbudo();
    formEtiqueta.reset();

    titleModalEtiqueta.textContent = "Agregar Etiqueta";

    guardarEtiqueta.textContent = "Guardar";

    idetiqueta.value = 0;
});

guardarEtiqueta.addEventListener('click', (e) => {
    const formData = new FormData(formEtiqueta);

    const formDataObj = {};

    formData.forEach((value, key) => {
        formDataObj[key] = value;
    });

    fetch('/guardarEtiqueta', {
        method: 'POST',
        body: JSON.stringify(formDataObj),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(res => res.json())
    .then(data => {
        if(data.message === 'ok') {
            Swal.fire({
                position: "top-center",
                icon: "success",
                title: data.dialog,
                showConfirmButton: false,
                timer: 1500
            });

            $("#modalEtiqueta").modal("hide");

            renderEtiquetas();
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

function editEtiqueta(id) {
    $("#modalEtiqueta").modal("show");
    selectEmbudo();

    titleModalEtiqueta.textContent = "Editar Etiqueta";
    guardarEtiqueta.textContent = "Editar";

    idetiqueta.value = id;

    setTimeout(() => {
        fetch('/getEtiqueta/'+id)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if(data.message === 'ok') {
                const datos = data.response;

                nombre_etiqueta.value = datos.descripcion;
                selectEmbudos.value = datos.embudo_id;

            } else {
                alert(data.response);
            }
        })
    }, 200);
}

function deleteEtiqueta(id) {
    Swal.fire({
        title: "¿Está seguro?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, bórralo!"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('/delete-etiqueta/'+id)
            .then(res => res.json())
            .then(data => {
                if(data.message === 'ok') {
                    Swal.fire({
                        position: "top-center",
                        icon: "success",
                        title: "Se elimino correctamente la etiqueta",
                        showConfirmButton: false,
                        timer: 1500
                    });

                    renderEtiquetas();
                } else {
                    alert(data.response);
                }
            })
        }
    });
}


const addEmbudo = document.getElementById('addEmbudo');
const guardarEmbudo =document.getElementById('guardarEmbudo');
const titleModalEmbudo = document.getElementById('titleModalEmbudo');
const formEmbudo = document.getElementById('formEmbudo');
const idembudo = document.getElementById('idembudo');

addEmbudo.addEventListener('click', () => {
    $("#modalEmbudo").modal('show');

    titleModalEmbudo.textContent = "Agregar Embudo";
    guardarEmbudo.textContent = "Guardar";
    idembudo.value = 0;

    formEmbudo.reset();
});

guardarEmbudo.addEventListener('click', () => {
    const formData = new FormData(formEmbudo);

    const formDataObj = {};

    formData.forEach((value, key) => {
        formDataObj[key] = value;
    });

    fetch('/guardarEmbudo', {
        method: 'POST',
        body: JSON.stringify(formDataObj),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(res => res.json())
    .then(data => {
        if(data.message === 'ok') {
            Swal.fire({
                position: "top-center",
                icon: "success",
                title: data.dialog,
                showConfirmButton: false,
                timer: 1500
            });

            $("#modalEmbudo").modal("hide");

            renderEmbudo();
        } else {
            alert(data.response);
        }
    })
});

function editEmbudo(id) {
    idembudo.value = id;

    $("#modalEmbudo").modal('show');

    titleModalEmbudo.textContent = "Editar Embudo";
    guardarEmbudo.textContent = "Editar";

    fetch('/getEmbudoId/'+id)
    .then(res => res.json())
    .then(data => {
        if (data.message === 'ok') {
            const datos = data.response;

            const nombre_embudo = document.getElementById('nombre_embudo');
            nombre_embudo.value = datos.descripcion;
        }
    })
}

function deleteEmbudo(id) {
    Swal.fire({
        title: "¿Está seguro?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, bórralo!"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('/delete-embudo/'+id)
            .then(res => res.json())
            .then(data => {
                if(data.message === 'ok') {
                    Swal.fire({
                        position: "top-center",
                        icon: "success",
                        title: "Se elimino correctamente el embudo",
                        showConfirmButton: false,
                        timer: 1500
                    });

                    renderEmbudo();
                } else {
                    alert(data.response);
                }
            })
        }
    });
}