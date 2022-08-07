/////////////
//  TIPOS  //
/////////////

type Instruccion = {
    codigoBinario: string,
    codigoTexto: string,
    usaRegistro: boolean,
    usaDatos: boolean
};

type Instrucciones = {
    [key: string]: Instruccion
}

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
    diccionarios: {
        instrucciones: Instrucciones,
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

    memoria: { //Objeto donde se guarda el programa que se ejectua así como lo registros y el puntero de linea

        registros: [0, 0, 0, 0, 0, 0, 0, 0],
        programa: [],
        linea: 0,
        etiquetas: {},

    },

    operaciones: { //Objeto donde se guardan todas las operaciones posibles y su ejecución

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

    banderas: { //Objeto donde se guardan varias banderas de control

        instruccionIlegal: false,
        registroIlegal: false,
        numeroIlegal: false,
        etiquetaIlegal: false,
        usaNegativos: false,

    },

    auxiliares: { //Objeto donde se guardan varias funciones auxiliares que ayudan a hacer el código más legible

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

        resetearProcesador: function () {
            this.limpiarBanderas();
            this.limpiarMemoria();
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

//////////////////
//  CONSTANTES  //
//////////////////

const maximoLineas: number = 255;

///////////////////
//   VARIABLES   //
///////////////////

let divError: JQuery<HTMLElement> = $("#divError");

///////////////////
//   FUNCIONES   //
///////////////////

function mostrarError(error: string): void {
    divError.text(error);
    throw new Error(error);
}

function mostrarResultado(resultado: string, divResultado: JQuery<HTMLElement>): void {
    divResultado.text(resultado);
    divError.text("");
}

/*
* Generar
*
*	Esta función convierte el código introducido en el textarea de código
*	en una serie de números binarios y además comprueba la validez del código introducido
*
*/

function generar(): void {

    function generarArrayCodigo(): string[][] {
        if (txtCodigo == "") { //Si está vacío, muestra un error
            mostrarError("Error: el campo de código está vacío");
        }

        let arrayPorLineas: string[] = txtCodigo.split(/\r?\n/);
        let arrayGenerado: string[][] = new Array;

        for (let linea: number = 0; linea < arrayPorLineas.length; linea++) {
            let lineaSeparada: string[] = arrayPorLineas[linea].split(/\s+/);
            arrayGenerado[linea] = new Array;

            if (lineaSeparada.length > 3) {
                mostrarError("Error: demasiados argumentos en la línea " + (linea + 1));
            }

            for (let cadena: number = 0; cadena < lineaSeparada.length; cadena++) {
                arrayGenerado[linea][cadena] = lineaSeparada[cadena];
            }
        }

        generarEtiquetas(arrayGenerado);
        if (arrayGenerado.length > 255) {
            mostrarError("Error: el programa introducido supera el límite de lineas");
        }
        return arrayGenerado;

    }

    function generarEtiquetas(arrayGenerado: string[][]): void {
        for (let contador = 0; contador < arrayGenerado.length; contador++) {
            if (arrayGenerado[contador][0].match(/:$/)) {
                let etiquetaSinPuntos: string = arrayGenerado[contador][0].replace(":", "");
                procSMR2.memoria.etiquetas[etiquetaSinPuntos] = contador.toString();
                arrayGenerado.splice(contador, 1);
            }
        }
    }

    function instruccionABinario(instruccionActual: Instruccion): void {
        if (instruccionActual == undefined) { //Si la instruccion no existe, es undefined y activa la bandera de instruccionIlegal
            mostrarError("Error: ha introducido una instrucción ilegal en la línea " + (linea + 1));
        }
        strBinario += instruccionActual["codigoBinario"];
    }

    function registroABinario(instruccionActual: Instruccion, linea: number): void {
        if (instruccionActual["usaRegistro"]) { //Si la instruccion usa algún registro, añadelo al binario
            if (procSMR2.diccionarios.registros[arrCodigo[linea][1]] == undefined) { //Si el registro no es válido activa la bandera de registroIlegal
                mostrarError("Error: ha introducido un registro ilegal en la línea " + (linea + 1));
            }
            strBinario += procSMR2.diccionarios.registros[arrCodigo[linea][1]]; //Si no, añade el valor de el registro en binario a el string binario
        }
        else {
            strBinario += "000";
        }
    }

    function datoABinario(instruccionActual: Instruccion, linea: number): void {
        if (instruccionActual["usaDatos"]) {
            let posicion: number = 2;
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

            if (Number(arrCodigo[linea][posicion]) < 0 || Number(arrCodigo[linea][posicion]) > 255) { //Si el dato es menor que 0 o mayor que 255 activa la bandera de numeroIlegal
                mostrarError("Error: ha introducido un número ilegal en la línea " + linea);
            }
            else { //Si no, convierte el número a binario y añade ceros al principio hasta que mida 8 caracteres de largo
                let numTemporal: string = Number(arrCodigo[linea][posicion]).toString(2);
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

    procSMR2.auxiliares.resetearProcesador();
    let txtCodigo: string = $("#txtCodigo").val()!.toString().toLowerCase(); //Recuperamos el texto en el textarea de código
    let arrCodigo: string[][] = generarArrayCodigo();
    let linea: number = 0;
    let strBinario: string = ""; //Una cadena para el binario

    for (linea = 0; linea < arrCodigo.length; linea++) {
        let instruccionActual: Instruccion = procSMR2.diccionarios.instrucciones[arrCodigo[linea][0]];
        instruccionABinario(instruccionActual);
        registroABinario(instruccionActual, linea);
        datoABinario(instruccionActual, linea);
    }

    mostrarResultado(strBinario, $("#txtBinario"));
}

/*
* Ejecutar
*
*	Esta función interpreta y ejecuta la serie de números binarios en el
*	textarea de binario y muestra el output que generaría ese código
*
*/

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