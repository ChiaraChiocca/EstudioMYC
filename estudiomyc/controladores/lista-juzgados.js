import { seleccionarJuzgados, insertarJuzgados, actualizarJuzgados, eliminarJuzgados } from '../modelos/juzgados.js';
/* Objetos del DOM*/
// Listado de artículos
const listado = document.querySelector("#listado");

// Alerta
const alerta = document.querySelector("#alerta");

// Formulario
const formulario = document.querySelector("#formulario");
const formularioModal = new bootstrap.Modal(document.querySelector("#formularioModal"));
const btnNuevo = document.querySelector("#btnNuevo");

// Inputs
const inputId = document.querySelector("#id");
const inputNroJuzgado = document.querySelector("#nroJuzgado");
const inputNombreJuzgado = document.querySelector("#nombreJuzgado");
const inputJuezTram = document.querySelector("#juezTram");
const inputSecretario = document.querySelector("#secretario");
const inputTelefono = document.querySelector("#telefono");


// Variables 
let opcion = '';
let id;
let mensajeAlerta;

let juzgados = [];
let juzgado = {};

// Control de usuario
let usuario = '';
let logueado = false;


/**
 * Esta función se ejecuta cuando
 * todo el contenido está cargado
 */

document.addEventListener('DOMContentLoaded', async () => {
    controlUsuario();
    juzgados = await obtenerJuzgados();
    mostrarJuzgados();
});

/**
 * Controla si el usuario está logueado
 */
const controlUsuario = () => {
    if (sessionStorage.getItem('usuario')) {
        usuario = sessionStorage.getItem('usuario');
        logueado = true;
    } else {
        logueado = false;
    }

    if (logueado) {
        btnNuevo.style.display = 'inline';
    } else {
        btnNuevo.style.display = 'none';
    }
};

/**
 * Obtiene los juzgados
 */
async function obtenerJuzgados() {
    juzgados = await seleccionarJuzgados();
    return juzgados;
}

/**
 * Muestra los juzgados
 * 
 */
function mostrarJuzgados() {
    listado.innerHTML = '';
    if (!logueado) return; // No muestra nada si no está logueado
    juzgados.forEach((juzgado) => {
        listado.innerHTML += `
            <div class="col">
                <div class="card" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title">
                            <span name="spanId">${juzgado.id}</span> - <span name="spanNombreJuzgado">${juzgado.nombreJuzgado}</span>
                        </h5>
                        <p class="card-text">
                            <strong>Nro. Juzgado: </strong><span name="spanNroJuzgado">${juzgado.nroJuzgado}</span><br>
                            <strong>Juez de Trámite: </strong><span name="spanJueztram">${juzgado.juezTram}</span><br>
                            <strong>Secretario: </strong><span name="spanSecretario">${juzgado.secretario}</span><br>
                            <strong>Teléfono: </strong><span name="spanTelefono">${juzgado.telefono}</span><br>
                        </p>
                    </div>
                    <div class="card-footer ${logueado ? 'd-flex' : 'none'};">
                        <a class="btn-editar btn btn-primary">Editar</a>
                        <a class="btn-borrar btn btn-danger">Borrar</a>
                        <input type="hidden" class="id-juzgado" value="${juzgado.id}">
                    </div>
                </div>
            </div>
        `;
    });
}

/**
 * Ejecuta el evento click del bóton Nuevo
 */
btnNuevo.addEventListener('click', () => {

    // Limpiamos los inputs
    inputNroJuzgado.value = null;
    inputNombreJuzgado.value = null;
    inputJuezTram.value = null;
    inputSecretario.value = null;
    inputTelefono.value = null;

    // Mostrar el formulario Modal
    formularioModal.show();

    opcion = 'insertar';
})

/**
 *  Ejecuta el evento submit del formulario
 */
formulario.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevenimos la acción por defecto

    const datos = new FormData(formulario); // Guardamos los datos del formulario

    switch (opcion) {
        case 'insertar':
            mensajeAlerta = 'Datos guardados';
            await insertarJuzgados(datos); // Esperamos a que se complete la inserción
            break;

        case 'actualizar':
            mensajeAlerta = 'Datos actualizados';
            await actualizarJuzgados(datos, id); // Esperamos a que se complete la actualización
            break;
    }

    insertarAlerta(mensajeAlerta, 'success');
    // Actualizamos los juzgados y mostramos la lista de nuevo
    juzgados = await obtenerJuzgados(); // Obtiene los datos más recientes
    mostrarJuzgados(); // Muestra los juzgados actualizados
})

/**
 * Define los mensajes de alerta
 * @param mensaje el mensaje a mostrar
 * @param tipo el tipo de alerta
 */
const insertarAlerta = (mensaje, tipo) => {
    const envoltorio = document.createElement('div');
    envoltorio.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible" role="alert">
            <div>${mensaje}</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>
    `;
    alerta.append(envoltorio);
}

/**
 * Determina en qué elemento se realiza un evento
 * @param elemento el elemento al que se le realiza el evento
 * @param evento el evento realizado
 * @param selector el selector seleccionado
 * @param manejador el método que maneja el evento
 */

const on = (elemento, evento, selector, manejador) => {
    elemento.addEventListener(evento, e => { // Agregamos el método para escuchar el evento
        if (e.target.closest(selector)) { // Si el objetivo del manejador es el selector 
            manejador(e); // Ejecutamos el método del manejador 
        }
    })
}

/**
* Función para el botón Editar
*/
on(document, 'click', '.btn-editar', e => {
    const cardFooter = e.target.parentNode; // Guardamos el elemento padre del botón

    // Guardamos los valores del card del expediente
    id = cardFooter.querySelector('.id-juzgado').value;
    juzgado = juzgados.find(item => item.id == id);
    console.log(juzgado);

    // Asignamos los valores a los input del formulario
    inputNroJuzgado.value = juzgado.nroJuzgado;
    inputNombreJuzgado.value = juzgado.nombreJuzgado;
    inputJuezTram.value = juzgado.juezTram;
    inputSecretario.value = juzgado.secretario;
    inputTelefono.value = juzgado.telefono;

    // Mostramos el formulario
    formularioModal.show();

    opcion = 'actualizar';

})

/**
 * Función para el botón Borrar
 */
on(document, 'click', '.btn-borrar', async (e) => {
    const cardFooter = e.target.parentNode;
    id = cardFooter.querySelector('.id-juzgado').value;

    juzgado = juzgados.find(item => item.id == id);

    let aceptar = confirm(`¿Relamente desea eliminar el juzgado ${juzgado.nombreJuzgado}?`);
    if (aceptar) {
        await eliminarJuzgados(id); // Espera a que se complete la eliminación
        insertarAlerta(`${juzgado.nombreJuzgado} borrado`, 'danger');
        // Actualizamos la lista después de la eliminación
        juzgados = await obtenerJuzgados(); // Obtiene los datos más recientes
        mostrarJuzgados(); // Muestra los juzgados actualizados
    }
})