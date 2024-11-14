const url = './api/login.php'; // Constante de la url de la API

// Variables de objetos del DOM
const frmLogin = document.getElementById('form-login');
const divLogin = document.getElementById('div-login');
const divLogout = document.getElementById('div-logout');
const textoLogueado = document.getElementById('texto-logueado');
const btnLogout = document.getElementById('btn-logout');
const inputUsuario = document.getElementById('usuario');
const inputPassword = document.getElementById('password');

// Variables
let usuario = '';
let logueado = false;

document.addEventListener('DOMContentLoaded', () => {
    verificar();
})

/**
 * Envía los datos del formulario
 * a la API
 */
frmLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    const datos = new FormData(frmLogin);
    login(datos);
})

/**
 * Busca el usuario y se loguea
 */
const login = (datos) => {
    fetch(url, {
        method: 'POST',
        body: datos
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        if(data[0].usuario) {
            usuario = data[0].usuario;
            logueado = true;
            sessionStorage.setItem('usuario', usuario);
            verificar();
        } else {
            textoLogueado.innerHTML = data;
        }
        inputUsuario.value = '';
        inputPassword.value = '';
    });
    //window.location.reload();
}

/**
 * Verifica si un usuario está logueado
 */
const verificar = () => {
    if(sessionStorage.getItem('usuario')) {
        usuario = sessionStorage.getItem('usuario');
        textoLogueado.innerHTML = `Bienvenido: ${usuario}`;
        logueado = true;
    }

    if(logueado) {
        divLogin.style.display = 'none';
        divLogout.style.display = 'inline';
    } else {
        divLogin.style.display = 'inline';
        divLogout.style.display = 'none';
    }
}

/**
 * Cierra la sesión
 */
const logout = () => {
    logueado = false;
    textoLogueado.innerHTML = '';
    sessionStorage.removeItem('usuario');
    verificar();
    window.location.reload();
}

/**
 * Ejecuta el evento click del botón logout
 */
btnLogout.addEventListener('click', () =>{
    logout();
})