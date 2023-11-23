const token = localStorage.getItem('token');

$('#basic-datatable').DataTable();

const btnAgregar = document.getElementById('btnAgregar');

btnAgregar.addEventListener('click', (e) => {
    $("#modalAddFrase").modal('show');
});

const form_frase = document.getElementById('form_frase');

form_frase.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form_frase);

    const formDataObj = {};

    formData.forEach((value, key) => {
        formDataObj[key] = value;
    });

    fetch('/saveFrase', {
        method: 'POST',
        body: JSON.stringify(formDataObj),
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
    })
    .then(res => res.json())
    .then(data => {
        if(data.message === 'ok') {
            $("#modalAddFrase").modal('hide');

            Swal.fire({
                position: 'top-center',
                icon: 'success',
                title: 'Se agrego correctamente',
                showConfirmButton: false,
                timer: 2000
            });

            renderFrases();

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ocurrio un error!'
            })
        }
        console.log(data);
    })
});

function renderFrases(){
    fetch('/getFrasesFin')
    .then(res => res.json())
    .then(data => {
        console.log(data);
        viewTable(data);
    })
}

renderFrases();

function viewTable(data) {
    let contentTable = "";

    const datos = data.data;

    const tbody = document.getElementById('fraseTbody');

    $('#basic-datatable').DataTable().destroy();

    datos.forEach((frase, index) => {
        contentTable += `
        <tr>
            <td>${index + 1}</td>
            <td>${frase.descripcion}</td>
            <td>
                <button type="button" class="btn btn-info">Editar</button>
                <button type="button" class="btn btn-danger" onclick="eliminarFrase(${frase.id})">Eliminar</button>
            </td>
        </tr>
        `;
    });

    tbody.innerHTML = contentTable;

    $('#basic-datatable').DataTable();
}

function eliminarFrase(id) {
    Swal.fire({
        title: "¿Estás seguro de eliminar?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "¡Si, Eliminar!"
      }).then((result) => {
        if (result.isConfirmed) {

            fetch('/deleteFrase/'+id)
            .then(res => res.json())
            .then(data => {
                console.log(data);

                if(data.message === 'ok') {
                    Swal.fire({
                        title: "¡Eliminado!",
                        text: "Tu registro ha sido eliminado.",
                        icon: "success"
                    });

                    renderFrases();
                    
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Ocurrio un error!'
                    })
                }
            })

          
        }
      });
}