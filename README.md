# SINCodeControl

This is a javascript library to generate Control Code for SIN - Bolivia (Servicio de Impuestos Nacionales).

## Installation

    npm i sincontrolcode

## Usage

### ES6

    import SINControlCode from 'sincontrolcode';

    const dosageKey= "9rCB7Sv4X29d)5k7N%3ab89p-3(5[A";
    let date = new Date();
    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let year = date.getFullYear();

    let controlcode = new SINControlCode();
    let code = controlcode.generateControlCode(
        authorization.toString(), // Número de autorización
        invoiceNumber.toString(), // Número de Factura
        invoiceIdFor.toString(),  // CI o NIT
        `${year}${month}${day}`,  // Fecha en formato YYYYMMDD
        total.toString(),         // Total de la transacción
        dosageKey                 // Llave de dosificación
    );

### NodeJS

    var SINControlCode = require('./sincontrolcode');

    var controlcode = new SINControlCode();

    var code = controlcode.generateControlCode(
        "29040011007",                       // Número de autorización
        "1503",                              // Número de Factura
        "4189179011",                        // CI o NIT
        "20070702",                          // Fecha en formato YYYYMMDD
        "2500",                              // Total de la transacción
        "9rCB7Sv4X29d)5k7N%3ab89p-3(5[A"     // Llave de dosificación
    );
    if (code === "6A-DC-53-05-14") {
        console.log(code + " match!!");
    }
    else {
        console.log("ERROR!!! codes do not match");
    }

## Test

This code tested 5000 different examples provided by SIN and this passed all of them, to run the test again:

    npm run test

## Author

Marco Zárate

### References

https://www.jc-mouse.net/net/c-sharp/impuestos-bolivia-codigo-de-control-en-c

https://www.jc-mouse.net/proyectos/facturacion-electronica-el-codigo-de-control