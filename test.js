
var SINControlCode = require('./sincontrolcode');
var fs = require('fs');
var controlcode = new SINControlCode();

fs.readFile('5000CasosPruebaCCVer7.txt', 'utf8', function (err, contents) {
    var all = contents.split("\n");
    var totalLinesPassed = 0;
    var totalLinesFailed = 0;
    all.forEach((line, index) => {
        var data = line.split("|");
        var code = controlcode.generateControlCode(data[0],//Numero de autorizacion
            data[1],//Numero de factura
            data[2],//Número de Identificación Tributaria o Carnet de Identidad
            data[3].replace("/", "").replace("/", "").replace("/", ""),//fecha de transaccion de la forma AAAAMMDD
            data[4],//Monto de la transacción
            data[5]//Llave de dosificación
        );

        if (code === data[10]) {
            console.log("Line " + index + ": actual \"" + code + "\" expected \"" + data[10] + "\" PASSED!");
            totalLinesPassed++;
        }
        else {
            console.log("Line " + index + ": actual \"" + code + "\" expected \"" + data[10] + "\" FAILED!!!");
            totalLinesFailed++
        }
    });
    console.log("/********* Test finished ********/");
    console.log("/* Passed: " + totalLinesPassed + "/" + all.length );
    console.log("/* Failed: " + totalLinesFailed + "/" + all.length );
    console.log("/********************************/");
});

