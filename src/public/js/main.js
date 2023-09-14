const salir = document.getElementById('cerrarSesion');

salir.addEventListener('click', (e) => {
    e.preventDefault();

    localStorage.removeItem('token');

    window.location='/';
});