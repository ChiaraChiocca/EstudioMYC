<?php
// Requerimos el archivo de la clase Modelo
require_once('modelos.php');
$mensaje='';

if(isset($_GET['tabla'])) {
    $tabla = new ModeloABM($_GET['tabla']);

    if(isset ($_GET['id'])) {
        $tabla->set_criterio("id=".$_GET['id']);
    }


    if(isset($_GET['accion'])) {
        if($_GET['accion'] == 'insertar' || $_GET['accion'] == 'actualizar') { 
            $valores = $_POST;
        }


        switch($_GET['accion']) {
            case 'seleccionar':
                $datos = $tabla->seleccionar();
                print_r($datos) ;
                break;

            case 'insertar':
                $tabla->insertar($valores);
                $mensaje = 'Datos guardados';
                echo json_encode($mensaje);
                break;
            
            case 'actualizar':
                    $tabla->actualizar($valores);
                    $mensaje .= 'Datos actualizados';
                    echo json_encode($mensaje);
                break;

            case 'eliminar':
                    $tabla->eliminar();
                    $mensaje = 'Datos eliminados';
                    echo json_encode($mensaje);
                break;
        
        }
    }
}

?>