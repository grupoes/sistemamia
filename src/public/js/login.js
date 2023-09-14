const email = document.getElementById('email');
const password = document.getElementById('password');

const form = document.getElementById('authentication-form');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const formDataObj = {};

    formData.forEach((value, key) => {
        formDataObj[key] = value;
    });

    fetch("/sigin", {
        method: 'post',
        body: JSON.stringify(formDataObj),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(res => res.json())
    .then(data => {
        if (data.message == 'ok') {
            localStorage.setItem('token',data.token);
            window.location='/dashboard';
        } else {
            alert(data.message);
        }
    })

});