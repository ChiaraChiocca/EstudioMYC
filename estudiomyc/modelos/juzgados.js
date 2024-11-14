const url = './api/datos.php?tabla=juzgados';

/**
 * Función asíncrona para seleccionar juzgados
 */
export async function seleccionarJuzgados() {
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
export function insertarJuzgados(datos) {
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
 * @param id el id del juzgado
 */
export const actualizarJuzgados = (datos, id) => { 
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
 * @param id el id del juzgado a eliminar
 */
export const eliminarJuzgados = (id) => { 
    fetch(`${url}&accion=eliminar&id=${id}`,{})
        .then(res => res.json())
        .then(data => {
            console.log(data);
            return data;
        })
} 