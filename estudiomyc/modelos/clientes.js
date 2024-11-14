const url = './api/datos.php?tabla=clientes';

/**
 * Función asíncrona para seleccionar clientes
 */
export async function seleccionarClientes() {
    let res = await fetch(url + '&accion=seleccionar');
    let datos = await res.json();
    if (res.status !== 200) {
        throw Error('Los datos no se encontraron');
    }
    console.log(datos);
    return datos;
}

/**
 * Inserta los datos en la Base de Datos
 * @param datos Los datos a insertar
 */
export function insertarClientes(datos) {
    fetch(`${url}&accion=insertar`, {
        method: 'POST',
        body: datos

    })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            return data;

        })
}

/**
 * Actualiza los datos en la Basa de Datos
 * @param datos los datos a actualizar
 * @param id el id del cliente
 */
export const actualizarClientes = (datos, id) => { 
    fetch(`${url}&accion=actualizar&id=${id}`, {
        method: 'POST',
        body: datos

    })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            return data;
        });
} 

/**
 * Eliminar los datos en la base de datos
 * @param id el id del cliente a eliminar
 */
export const eliminarClientes = (id) => { 
    fetch(`${url}&accion=eliminar&id=${id}`,{})
        .then(res => res.json())
        .then(data => {
            console.log(data);
            return data;
        })
} 