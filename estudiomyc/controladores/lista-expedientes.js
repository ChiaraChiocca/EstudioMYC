import { seleccionarExpedientes, insertarExpedientes, actualizarExpedientes, eliminarExpedientes } from '../modelos/expedientes.js';
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
const inputTipoExpediente = document.querySelector("#tipoExpediente");
const inputNroExpediente = document.querySelector("#nroExpediente");
const inputJuzgado = document.querySelector("#juzgado");
const inputCaratula = document.querySelector("#caratula");
const inputFechaInicio = document.querySelector("#fechaInicio");
const inputTipoJuicio = document.querySelector("#tipoJuicio");
const inputAcargode = document.querySelector("#acargode");
const inputFechaFin = document.querySelector("#fechaFin");
const inputEstado = document.querySelector("#estado");
const inputFechaBaja = document.querySelector("#fechaBaja");


// Variables 
let opcion = '';
let id;
let mensajeAlerta;

let expedientes = [];
let expediente = {};

// Control de usuario
let usuario = '';
let logueado = false;


/**
 * Esta función se ejecuta cuando
 * todo el contenido está cargado
 */

document.addEventListener('DOMContentLoaded', async () => {
    controlUsuario();
    expedientes = await obtenerExpedientes();
    mostrarExpedientes();
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
 * Obtiene los expedientes
 */
async function obtenerExpedientes() {
    expedientes = await seleccionarExpedientes();
    return expedientes;
}

/**
 * Muestra los expedientes
 * 
 */
function mostrarExpedientes() {
    listado.innerHTML = '';
    if (!logueado) return; // No muestra nada si no está logueado
    expedientes.forEach((expediente) => {
        (listado.innerHTML += `
                    <div class="col">
                <div class="card" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title">
                            <span name="spanId">${expediente.id}</span> - <span name="spanCaratura">${expediente.caratura}</span>
                        </h5>
                        <p class="card-text">
                            <strong>Tipo de Expediente: </strong><span name="spanTipoExpediente">${expediente.tipoExpediente === 'J' ? 'Judicial' : 'Extrajudicial'}</span><br>
                            <strong>Nro. Expediente: </strong><span name="spanNroExpediente">${expediente.nroExpediente}</span><br>
                            <strong>Juzgado: </strong><span name="spanJuzgado">${expediente.juzgado}</span><br>
                            <strong>Fecha de Inicio: </strong><span name="spanFechaInicio">${expediente.fechaInicio}</span><br>
                            <strong>Tipo de Juicio: </strong><span name="spanTipoJuicio">${expediente.tipoJuicio ?? 'N/A'}</span><br>
                            <strong>A Cargo de: </strong><span name="spanAcargode">${expediente.acargode}</span><br>
                            <strong>Fecha de Finalización: </strong><span name="spanFechaFin">${expediente.fechaFin ?? 'Pendiente'}</span><br>
                            <strong>Estado: </strong><span name="spanEstado">${expediente.estado}</span><br>
                            <strong>Fecha de Baja: </strong><span name="spanFechaBaja">${expediente.fechaBaja ?? 'N/A'}</span><br>
                        </p>
                    </div>
                    <div class="card-footer ${logueado ? 'd-flex' : 'none'};">
                        <a class="btn-editar btn btn-primary">Editar</a>
                        <a class="btn-borrar btn btn-danger">Borrar</a>
                        <input type="hidden" class="id-expediente" value="${expediente.id}">
                    </div>
                </div>
            </div>
        
        `)
    });
}

/**
 * Ejecuta el evento click del bóton Nuevo
 */
btnNuevo.addEventListener('click', () => {

    // Limpiamos los inputs
    inputTipoExpediente.value = null;
    inputNroExpediente.value = null;
    inputJuzgado.value = null;
    inputCaratula.value = null;
    inputFechaInicio.value = null;
    inputTipoJuicio.value = null;
    inputAcargode.value = null;
    inputFechaFin.value = null;
    inputEstado.value = null;
    inputFechaBaja.value = null;

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
            mensajeAlerta = 'Datos guardados'; // Esperamos a que se complete la inserción
            await insertarExpedientes(datos);
            break;

        case 'actualizar':
            mensajeAlerta = 'Datos actualizados';
            await actualizarExpedientes(datos, id); // Esperamos a que se complete la actualización
            break;
    }

    insertarAlerta(mensajeAlerta, 'success');
    // Actualizamos los expedientes y mostramos la lista de nuevo
    expedientes = await obtenerExpedientes(); // Obtiene los datos más recientes
    mostrarExpedientes(); // Muestra los expedientes actualizados
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
    id = cardFooter.querySelector('.id-expediente').value;
    expediente = expedientes.find(item => item.id == id);
    console.log(expediente);

    // Asignamos los valores a los input del formulario
    inputTipoExpediente.value = expediente.tipoExpediente;
    inputNroExpediente.value = expediente.nroExpediente;
    inputJuzgado.value = expediente.juzgado;
    inputCaratula.value = expediente.caratula;
    inputFechaInicio.value = expediente.fechaInicio;
    inputTipoJuicio.value = expediente.tipoJuicio;
    inputAcargode.value = expediente.acargode;
    inputFechaFin.value = expediente.fechaFin;
    inputEstado.value = expediente.estado;
    inputFechaBaja.value = expediente.fechaBaja;

    // Mostramos el formulario
    formularioModal.show();

    opcion = 'actualizar';

})

/**
 * Función para el botón Borrar
 */
on(document, 'click', '.btn-borrar', async (e) => {
    const cardFooter = e.target.parentNode;
    id = cardFooter.querySelector('.id-expediente').value;

    expediente = expedientes.find(item => item.id == id);

    let aceptar = confirm(`¿Relamente desea eliminar el expediente ${expediente.nroExpediente}?`);
    if (aceptar) {
        await eliminarExpedientes(id); // Espera a que se complete la eliminación
        insertarAlerta(`${expediente.nroExpediente} borrado`, 'danger');
        // Actualizamos la lista después de la eliminación
        expedientes = await obtenerExpedientes(); // Obtiene los datos más recientes
        mostrarExpedientes(); // Muestra los expedientes actualizados
    }
})