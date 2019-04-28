# SINCodeControl

This is a javascript library to generate Contro Code for SIN - Bolivia (Servicio de Impuestos Nacionales).

## Installation

    npm i sincontrolcode

## Usage


    import SINControlCode from 'sincontrolcode';

    const dosageKey= "9rCB7Sv4X29d)5k7N%3ab89p-3(5[A";
    let date = new Date(order.invoiceIssueDate);
    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let year = date.getFullYear();

    SINControlCode.generateControlCode(
        authorization.toString(), // Número de autorización
        invoiceNumber.toString(), // Número de Factura
        invoiceIdFor.toString(),  // CI o NIT
        `${year}${month}${day}`,  // Fecha en formato YYYYMMDD
        total.toString(),         // Total de la transacción
        dosageKey                 // Llave de dosificación
    );

## Author

Marco Zárate 

### References 

https://www.jc-mouse.net/net/c-sharp/impuestos-bolivia-codigo-de-control-en-c

https://www.jc-mouse.net/proyectos/facturacion-electronica-el-codigo-de-control