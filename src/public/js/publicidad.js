$('#basic-datatable').DataTable();

const addbtn = document.getElementById('addbtn');
const formPublicidad = document.getElementById('formPublicidad');

addbtn.addEventListener('click', () => {
    $("#modalAddPublicidad").modal('show');
});

formPublicidad.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(formPublicidad);

    fetch('save-publicidad', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
    })
});

