const rol = document.getElementById('rol_user');
const iduser = document.getElementById('user_id');

window.addEventListener('load', (e) => {
    const token_ = localStorage.getItem('token');

    fetch('/getData', {
        headers: {
            'Authorization': 'Bearer ' + token_,
        }
    })
    .then(res => res.json())
    .then(data => {
        rol.value = data.rol;
        iduser.value = data.id;
    })
    
});


const salir = document.getElementById('cerrarSesion');

salir.addEventListener('click', (e) => {
    e.preventDefault();

    localStorage.removeItem('token');

    window.location='/';
});

