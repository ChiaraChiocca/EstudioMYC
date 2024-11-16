import { seleccionarClientes, insertarClientes, actualizarClientes, eliminarClientes } from '../modelos/clientes.js';
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
const inputTipoPersona = document.querySelector("#tipoPersona");
const inputTipoDNI = document.querySelector("#tipoDni");
const inputApellidoRsocial = document.querySelector("#apellidoRsocial");
const inputNombres = document.querySelector("#nombres");
const inputDomicilio = document.querySelector("#domicilio");
const inputTelefono = document.querySelector("#telefono");
const inputEmail = document.querySelector("#email");
const inputLocalidad = document.querySelector("#localidad");
const inputCpostal = document.querySelector("#cpostal");
const inputFnacimiento = document.querySelector("#fnacimiento");
const inputFalta = document.querySelector("#falta");
const inputFbaja = document.querySelector("#fbaja");


// Variables 
let opcion = '';
let id;
let mensajeAlerta;

let clientes = [];
let cliente = {};

// Control de usuario
let usuario = '';
let logueado = false;


/**
 * Esta función se ejecuta cuando
 * todo el contenido está cargado
 */

document.addEventListener('DOMContentLoaded', async () => {
    controlUsuario();
    clientes = await obtenerClientes();
    mostrarClientes();
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
 * Obtiene los clientes
 */
async function obtenerClientes() {
    clientes = await seleccionarClientes();
    return clientes;
}

/**
 * Muestra los clientes 
 * 
 */
function mostrarClientes() {
    listado.innerHTML = '';
    if (!logueado) return; // No muestra nada si no está logueado
    clientes.forEach((cliente) => {
        (listado.innerHTML += `
                   <div class="col">
                <div class="card" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title">
                            <span name="spanId">${cliente.id}</span> - <span name="spanApellidoRsocial">${cliente.apellidoRsocial}</span>
                        </h5>
                        <p class="card-text">
                            <strong>Nombre: </strong><span name="spanNombres">${cliente.nombres}</span><br>
                            <strong>DNI: </strong><span name="spanTipoDni">${cliente.tipoDNI}</span><br>
                            <strong>Tipo Persona: </strong><span name="spanTipoPersona">${cliente.tipoPersona}</span><br>
                            <strong>Domicilio: </strong><span name="spanDomicilio">${cliente.domicilio}</span><br>
                            <strong>Teléfono: </strong><span name="spanTelefono">${cliente.telefono}</span><br>
                            <strong>Email: </strong><span name="spanEmail">${cliente.email}</span><br>
                            <strong>Localidad: </strong><span name="spanLocalidad">${cliente.localidad}</span><br>
                            <strong>Código Postal: </strong><span name="spanCpostal">${cliente.cpostal}</span><br>
                            <strong>Fecha Nacimiento: </strong><span name="spanFnacimiento">${cliente.fnacimiento}</span><br>
                            <strong>Fecha Alta: </strong><span name="spanFalta">${cliente.falta}</span><br>
                            <strong>Fecha Baja: </strong><span name="spanFbaja">${cliente.fbaja ?? 'N/A'}</span><br>
                        </p>
                    </div>
                    <div class="card-footer ${logueado ? 'd-flex' : 'none'};">
                        <a class="btn-editar btn btn-primary">Editar</a>
                        <a class="btn-borrar btn btn-danger">Borrar</a>
                        <input type="hidden" class="id-cliente" value="${cliente.id}">
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
    inputTipoPersona.value = null;
    inputTipoDNI.value = null;
    inputApellidoRsocial.value = null;
    inputNombres.value = null;
    inputDomicilio.value = null;
    inputTelefono.value = null;
    inputEmail.value = null;
    inputLocalidad.value = null;
    inputCpostal.value = null;
    inputFnacimiento.value = null;
    inputFalta.value = null;
    inputFbaja.value = null;

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
            await insertarClientes(datos); // Esperamos a que se complete la inserción
            break;

        case 'actualizar':
            mensajeAlerta = 'Datos actualizados';
            await actualizarClientes(datos, id); // Esperamos a que se complete la actualización
            break;
    }

    insertarAlerta(mensajeAlerta, 'success');
    // Actualizamos los clientes y mostramos la lista de nuevo
    clientes = await obtenerClientes(); // Obtiene los datos más recientes
    mostrarClientes(); // Muestra los clientes actualizados
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

    // Guardamos los valores del card del cliente
    id = cardFooter.querySelector('.id-cliente').value;
    cliente = clientes.find(item => item.id == id);
    console.log(cliente);

    // Asignamos los valores a los input del formulario
    inputTipoPersona.value = cliente.tipoPersona;
    inputTipoDNI.value = cliente.tipoDNI;
    inputApellidoRsocial.value = cliente.apellidoRsocial;
    inputNombres.value = cliente.nombres;
    inputDomicilio.value = cliente.domicilio;
    inputTelefono.value = cliente.telefono;
    inputEmail.value = cliente.email;
    inputLocalidad.value = cliente.localidad;
    inputCpostal.value = cliente.cpostal;
    inputFnacimiento.value = cliente.fnacimiento;
    inputFalta.value = cliente.falta;
    inputFbaja.value = cliente.fbaja;

    // Mostramos el formulario
    formularioModal.show();

    opcion = 'actualizar';

})

/**
 * Función para el botón Borrar
 */
on(document, 'click', '.btn-borrar', async (e) => {
    const cardFooter = e.target.parentNode;
    id = cardFooter.querySelector('.id-cliente').value;

    cliente = clientes.find(item => item.id == id);

    let aceptar = confirm(`¿Realmente desea eliminar al cliente ${cliente.apellidoRsocial} ${cliente.nombres}?`);
    if (aceptar) {
        await eliminarClientes(id); // Espera a que se complete la eliminación
        insertarAlerta(`${cliente.apellidoRsocial} ${cliente.nombres} borrado`, 'danger');
        // Actualizamos la lista después de la eliminación
        clientes = await obtenerClientes(); // Obtiene los datos más recientes
        mostrarClientes(); // Muestra los clientes actualizados
    }
})