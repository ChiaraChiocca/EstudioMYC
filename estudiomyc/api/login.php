<?php
    require_once 'modelos.php'; // Requerimos la clase Modelos

    $valores = $_POST; // Guardamos en $valores los datos del formulario

    $usuario = "'".$valores['usuario']."'"; // Guardamos el usuario entre '
    $password = "'".$valores['password']."'"; // Guardamos el password entre '

    $usuarios = new ModeloABM('usuarios'); // Ahora la tabla es 'usuarios'
    $usuarios->set_criterio("usuario=$usuario AND password=$password"); // Establecemos el criterio con el usuario y el password

    $datos = $usuarios->seleccionar(); // Ejecutamos el método seleccionar

    echo $datos; // Devolvemos los datos

    // SELECT * FROM usuarios WHERE usuario='josesanmartin' AND password='123456'
?>