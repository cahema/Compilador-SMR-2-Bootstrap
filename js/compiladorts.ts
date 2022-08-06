/////////////////
//    TIPOS    //
/////////////////

type Instruccion = {
    [key: string]: { codigoBinario: string, codigoTexto: string, usaRegistro: boolean, usaDatos: boolean }
};

type Registro = {
    [key: string]: string
}

type Programa = {
    [index: string]: string
}

type Memoria = {
    registros: number[],
    programa: Programa[],
    linea: number,
    etiquetas: {
        [key: string]: string
    }
}

type Operacion = {
    [key: string]: Function;
}

type Bandera = {
    [key: string]: boolean
}

type Auxiliar = {
    [key: string]: Function
}

type ProcSMR2 = {
    propiedades: {
        numRegistros: number,
        tamMemoria: number
    },
    diccionarios: {
        instrucciones: Instruccion,
        registros: Registro,
    },
    memoria: Memoria,
    operaciones: Operacion,
    banderas: Bandera,
    auxiliares: Auxiliar,

}
/////////////////
//   OBJETOS   //
/////////////////

let procSMR2: ProcSMR2 = {

    propiedades: {
        numRegistros: 8,
        tamMemoria: 4096,
    },

    diccionarios: {	//Diccionarios que se usan para convertir de texto a binario el código

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

    memoria: {		//Objeto donde se guarda el programa que se ejectua así como lo registros y el puntero de linea

        registros: [0, 0, 0, 0, 0, 0, 0, 0],
        programa: [],
        linea: 0,
        etiquetas: {},

    },

    operaciones: {		//Objeto donde se guardan todas las operaciones posibles y su ejecución

        "00000": function () { //imprime
            return procSMR2.memoria.registros[procSMR2.auxiliares.registroActual()];
        },

        "00001": function () { //imprimec
            return String.fromCharCode(procSMR2.memoria.registros[procSMR2.auxiliares.registroActual()]);
        },

        "00010": function () { //valor
            procSMR2.memoria.registros[procSMR2.auxiliares.registroActual()] = procSMR2.auxiliares.datoActual();
        },

        "00011": function () { //borra
            procSMR2.memoria.registros[procSMR2.auxiliares.registroActual()] = 0;
        },

        "00100": function () { //suma
            procSMR2.memoria.registros[procSMR2.auxiliares.registroActual()] += procSMR2.auxiliares.datoActual();
        },

        "00101": function () { //resta
            procSMR2.memoria.registros[procSMR2.auxiliares.registroActual()] -= procSMR2.auxiliares.datoActual();
        },

        "00110": function () { //salta
            procSMR2.memoria.linea = procSMR2.auxiliares.datoActual() - 1;
        },

        "00111": function () { //saltasi0
            if (procSMR2.memoria.registros[procSMR2.auxiliares.registroActual()] == 0) {
                procSMR2.memoria.linea = procSMR2.auxiliares.datoActual() - 1;
            }
        },

        "01000": function () { //negativos
            procSMR2.banderas.usaNegativos = true;
        },

        "01001": function () { //positivos
            procSMR2.banderas.usaNegativos = false;
        },

    },

    banderas: {	//Objeto donde se guardan varias banderas de control

        instruccionIlegal: false,
        registroIlegal: false,
        numeroIlegal: false,
        etiquetaIlegal: false,
        usaNegativos: false,

    },

    auxiliares: {		//Objeto donde se guardan varias funciones auxiliares que ayudan a hacer el código más legible

        operacionActual: function () {
            return procSMR2.memoria.programa[procSMR2.memoria.linea]["operacion"];
        },

        registroActual: function () {
            let registroBin = procSMR2.memoria.programa[procSMR2.memoria.linea]["registro"];
            return parseInt(registroBin, 2);
        },

        datoActual: function () {
            let datoBin = procSMR2.memoria.programa[procSMR2.memoria.linea]["dato"];
            return parseInt(datoBin, 2);
        },

        limpiarBanderas: function () {
            let arrayBanderas = Object.keys(procSMR2.banderas);
            for (let bandera of arrayBanderas) {
                procSMR2.banderas[bandera] = false;
            }
        },

        limpiarMemoria: function () {
            for (let i = 0; i < procSMR2.memoria.registros.length; i++) {
                procSMR2.memoria.registros[i] = 0;
            }
            procSMR2.memoria.programa = [];
            procSMR2.memoria.linea = 0;
            procSMR2.memoria.etiquetas = {};
        },

    }

}

function generar() {
    throw new Error("Function not implemented.");
}


function ejecutar(): void {
    throw new Error("Function not implemented.");
}

////////////////////
//      MAIN      //
////////////////////

$("#navbar").load("navbar.html", function () {
    $("#navSobreMi").removeClass("active");
    $("#navCompilador").addClass("active");
    $("#navHistoria").removeClass("active");
    $("#navJuego").removeClass("active");
});

document.querySelector("#btnGenerar")!.addEventListener("click", generar);
document.querySelector("#btnEjecutar")!.addEventListener("click", ejecutar);