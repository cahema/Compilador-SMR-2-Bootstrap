"use strict";
var procSMR2 = {
    diccionarios: {
        instrucciones: {
            imprime: { codigoBinario: "00000", codigoTexto: "imprime", usaRegistro: true, usaDatos: false },
            imprimec: { codigoBinario: "00001", codigoTexto: "imprimec", usaRegistro: true, usaDatos: false },
            valor: { codigoBinario: "00010", codigoTexto: "valor", usaRegistro: true, usaDatos: true },
            borra: { codigoBinario: "00011", codigoTexto: "borra", usaRegistro: true, usaDatos: false },
            suma: { codigoBinario: "00100", codigoTexto: "suma", usaRegistro: true, usaDatos: true },
            resta: { codigoBinario: "00101", codigoTexto: "resta", usaRegistro: true, usaDatos: true },
            salta: { codigoBinario: "00110", codigoTexto: "salta", usaRegistro: false, usaDatos: true },
            saltasi0: { codigoBinario: "00111", codigoTexto: "saltasi0", usaRegistro: true, usaDatos: true },
            negativos: { codigoBinario: "01000", codigoTexto: "negativos", usaRegistro: false, usaDatos: false },
            positivos: { codigoBinario: "01001", codigoTexto: "positivos", usaRegistro: false, usaDatos: false },
        },
        registros: {
            r0: "000",
            r1: "001",
            r2: "010",
            r3: "011",
            r4: "100",
            r5: "101",
            r6: "110",
            r7: "111",
        },
    },
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
        resetearProcesador: function () {
            this.limpiarBanderas();
            this.limpiarMemoria();
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
    }
};
var maximoLineas = 255;
var divError = $("#divError");
function mostrarError(error) {
    divError.text(error);
    throw new Error(error);
}
function mostrarResultado(resultado, divResultado) {
    divResultado.text(resultado);
    divError.text("");
}
function generar() {
    function generarArrayCodigo() {
        if (txtCodigo == "") {
            mostrarError("Error: el campo de código está vacío");
        }
        var arrayPorLineas = txtCodigo.split(/\r?\n/);
        var arrayGenerado = new Array;
        for (var linea_1 = 0; linea_1 < arrayPorLineas.length; linea_1++) {
            var lineaSeparada = arrayPorLineas[linea_1].split(/\s+/);
            arrayGenerado[linea_1] = new Array;
            if (lineaSeparada.length > 3) {
                mostrarError("Error: demasiados argumentos en la línea " + (linea_1 + 1));
            }
            for (var cadena = 0; cadena < lineaSeparada.length; cadena++) {
                arrayGenerado[linea_1][cadena] = lineaSeparada[cadena];
            }
        }
        generarEtiquetas(arrayGenerado);
        if (arrayGenerado.length > 255) {
            mostrarError("Error: el programa introducido supera el límite de lineas");
        }
        return arrayGenerado;
    }
    function generarEtiquetas(arrayGenerado) {
        for (var contador = 0; contador < arrayGenerado.length; contador++) {
            if (arrayGenerado[contador][0].match(/:$/)) {
                var etiquetaSinPuntos = arrayGenerado[contador][0].replace(":", "");
                procSMR2.memoria.etiquetas[etiquetaSinPuntos] = contador.toString();
                arrayGenerado.splice(contador, 1);
            }
        }
    }
    function instruccionABinario(instruccionActual) {
        if (instruccionActual == undefined) {
            mostrarError("Error: ha introducido una instrucción ilegal en la línea " + (linea + 1));
        }
        strBinario += instruccionActual["codigoBinario"];
    }
    function registroABinario(instruccionActual, linea) {
        if (instruccionActual["usaRegistro"]) {
            if (procSMR2.diccionarios.registros[arrCodigo[linea][1]] == undefined) {
                mostrarError("Error: ha introducido un registro ilegal en la línea " + (linea + 1));
            }
            strBinario += procSMR2.diccionarios.registros[arrCodigo[linea][1]];
        }
        else {
            strBinario += "000";
        }
    }
    function datoABinario(instruccionActual, linea) {
        if (instruccionActual["usaDatos"]) {
            var posicion = 2;
            if (!instruccionActual["usaRegistro"]) {
                posicion--;
            }
            if (isNaN(Number(arrCodigo[linea][posicion]))) {
                if (procSMR2.memoria.etiquetas[arrCodigo[linea][posicion]] != undefined) {
                    arrCodigo[linea][posicion] = procSMR2.memoria.etiquetas[arrCodigo[linea][posicion]];
                }
                else {
                    mostrarError("Error: ha introducido una etiqueta no declarada en la linea " + (linea + 1));
                }
            }
            if (Number(arrCodigo[linea][posicion]) < 0 || Number(arrCodigo[linea][posicion]) > 255) {
                mostrarError("Error: ha introducido un número ilegal en la línea " + linea);
            }
            else {
                var numTemporal = Number(arrCodigo[linea][posicion]).toString(2);
                while (numTemporal.length < 8) {
                    numTemporal = "0" + numTemporal;
                }
                strBinario += numTemporal;
            }
        }
        else {
            strBinario += "00000000";
        }
    }
    var txtCodigo = $("#txtCodigo").val().toString().toLowerCase();
    var arrCodigo = generarArrayCodigo();
    var linea = 0;
    var strBinario = "";
    procSMR2.auxiliares.limpiarBanderas();
    procSMR2.memoria.etiquetas = {};
    for (linea = 0; linea < arrCodigo.length; linea++) {
        var instruccionActual = procSMR2.diccionarios.instrucciones[arrCodigo[linea][0]];
        instruccionABinario(instruccionActual);
        registroABinario(instruccionActual, linea);
        datoABinario(instruccionActual, linea);
    }
    mostrarResultado(strBinario, $("#txtBinario"));
    procSMR2.auxiliares.resetearProcesador();
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