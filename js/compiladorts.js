"use strict";
var instrucciones = {
    imprime: { codigoBinario: "00000", codigoTexto: "imprime", usaRegistro: true, usaDatos: false },
    imprimec: { codigoBinario: "00001", codigoTexto: "imprimec", usaRegistro: true, usaDatos: false },
    valor: { codigoBinario: "00010", codigoTexto: "valor", usaRegistro: true, usaDatos: true },
    borra: { codigoBinario: "00011", codigoTexto: "borra", usaRegistro: true, usaDatos: false },
    suma: { codigoBinario: "00100", codigoTexto: "suma", usaRegistro: true, usaDatos: true },
    resta: { codigoBinario: "00101", codigoTexto: "resta", usaRegistro: true, usaDatos: true },
    salta: { codigoBinario: "00110", codigoTexto: "salta", usaRegistro: false, usaDatos: true },
    saltasi0: { codigoBinario: "00111", codigoTexto: "saltasi0", usaRegistro: true, usaDatos: true },
    negativos: { codigoBinario: "01000", codigoTexto: "negativos", usaRegistro: false, usaDatos: false },
    positivos: { codigoBinario: "01001", codigoTexto: "positivos", usaRegistro: false, usaDatos: false }
};
var registros = {
    r0: "000",
    r1: "001",
    r2: "010",
    r3: "011",
    r4: "100",
    r5: "101",
    r6: "110",
    r7: "111"
};
var procSMR2 = {
    memoria: {
        registros: [0, 0, 0, 0, 0, 0, 0, 0],
        programa: [],
        linea: 0,
        etiquetas: {},
    },
    operaciones: {
        "00000": function () {
            return procSMR2.memoria.registros[procSMR2.auxiliares.registroActual()];
        },
        "00001": function () {
            return String.fromCharCode(procSMR2.memoria.registros[procSMR2.auxiliares.registroActual()]);
        },
        "00010": function () {
            procSMR2.memoria.registros[procSMR2.auxiliares.registroActual()] = procSMR2.auxiliares.datoActual();
        },
        "00011": function () {
            procSMR2.memoria.registros[procSMR2.auxiliares.registroActual()] = 0;
        },
        "00100": function () {
            procSMR2.memoria.registros[procSMR2.auxiliares.registroActual()] += procSMR2.auxiliares.datoActual();
        },
        "00101": function () {
            procSMR2.memoria.registros[procSMR2.auxiliares.registroActual()] -= procSMR2.auxiliares.datoActual();
        },
        "00110": function () {
            procSMR2.memoria.linea = procSMR2.auxiliares.datoActual() - 1;
        },
        "00111": function () {
            if (procSMR2.memoria.registros[procSMR2.auxiliares.registroActual()] == 0) {
                procSMR2.memoria.linea = procSMR2.auxiliares.datoActual() - 1;
            }
        },
        "01000": function () {
            procSMR2.banderas.usaNegativos = true;
        },
        "01001": function () {
            procSMR2.banderas.usaNegativos = false;
        },
    },
    banderas: {
        instruccionIlegal: false,
        registroIlegal: false,
        numeroIlegal: false,
        etiquetaIlegal: false,
        usaNegativos: false,
        campoVacio: false,
    },
    auxiliares: {
        operacionActual: function () {
            return procSMR2.memoria.programa[procSMR2.memoria.linea]["operacion"];
        },
        registroActual: function () {
            var registroBin = procSMR2.memoria.programa[procSMR2.memoria.linea]["registro"];
            return parseInt(registroBin, 2);
        },
        datoActual: function () {
            var datoBin = procSMR2.memoria.programa[procSMR2.memoria.linea]["dato"];
            return parseInt(datoBin, 2);
        },
        limpiarBanderas: function () {
            var arrayBanderas = Object.keys(procSMR2.banderas);
            for (var _i = 0, arrayBanderas_1 = arrayBanderas; _i < arrayBanderas_1.length; _i++) {
                var bandera = arrayBanderas_1[_i];
                procSMR2.banderas[bandera] = false;
            }
        },
        limpiarMemoria: function () {
            for (var i = 0; i < procSMR2.memoria.registros.length; i++) {
                procSMR2.memoria.registros[i] = 0;
            }
            procSMR2.memoria.programa = [];
            procSMR2.memoria.linea = 0;
            procSMR2.memoria.etiquetas = {};
        },
    },
};
function mostrarError(stringError, divError, lineaError) {
    divError.val(stringError + lineaError);
    throw new Error(stringError);
}
function generar() {
    function comprobarErrores() {
        if (procSMR2.banderas.instruccionIlegal) {
            mostrarError("Error: ha introducido una instrucción ilegal en la línea " + lineaError, divErrorCodigo);
        }
        else if (procSMR2.banderas.registroIlegal) {
            mostrarError("Error: ha introducido un registro ilegal en la línea " + lineaError, divErrorCodigo);
        }
        else if (procSMR2.banderas.numeroIlegal) {
            mostrarError("Error: ha introducido un número ilegal en la línea " + lineaError, divErrorCodigo);
        }
        else if (procSMR2.banderas.etiquetaIlegal) {
            mostrarError("Error: ha introducido una etiqueta no declarada en la linea " + lineaError, divErrorCodigo);
        }
    }
    var txtCodigo = $("#txtCodigo").text().toLowerCase();
    var divErrorCodigo = $("#divError");
    var arrCodigo = txtCodigo.split(/\s+/);
    var strBinario = "";
    var lineaError = 0;
    if (arrCodigo[0] == "") {
        mostrarError("Error: introduzca código para generar el código binario", divErrorCodigo);
    }
    for (var contador = 0; contador < arrCodigo.length; contador++) {
        comprobarErrores();
        var instruccionActual = procSMR2.diccionarios.instrucciones[arrCodigo[contador]];
    }
}
function ejecutar() {
    throw new Error("Function not implemented.");
}
$("#navbar").load("navbar.html", function () {
    $("#navSobreMi").removeClass("active");
    $("#navCompilador").addClass("active");
    $("#navHistoria").removeClass("active");
    $("#navJuego").removeClass("active");
});
document.querySelector("#btnGenerar").addEventListener("click", generar);
document.querySelector("#btnEjecutar").addEventListener("click", ejecutar);
//# sourceMappingURL=compiladorts.js.map