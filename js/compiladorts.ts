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
    [index: number]: string
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
            let resultadoOperacion: number = procSMR2.memoria.registros[procSMR2.auxiliares.registroActual()];
            if (procSMR2.banderas.usaNegativos) {
                resultadoOperacion -= 127;
            }
            return resultadoOperacion.toString();
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
        usaNegativos: false,
    },

    auxiliares: { //Objeto donde se guardan varias funciones auxiliares que ayudan a hacer el código más legible

        operacionActual: function () {
            return procSMR2.memoria.programa[procSMR2.memoria.linea][0];
        },

        registroActual: function () {
            let registroBin = procSMR2.memoria.programa[procSMR2.memoria.linea][1];
            return parseInt(registroBin, 2);
        },

        datoActual: function () {
            let datoBin = procSMR2.memoria.programa[procSMR2.memoria.linea][2];
            return parseInt(datoBin, 2);
        },

        resetearProcesador: function () {
            procSMR2.auxiliares.limpiarBanderas();
            procSMR2.auxiliares.limpiarMemoria();
        },

        limpiarBanderas: function () {
            let arrayBanderas = Object.keys(procSMR2.banderas);
            for (let bandera of arrayBanderas) {
                procSMR2.banderas[bandera] = false;
            }
        },

        limpiarMemoria: function () {
            procSMR2.memoria.linea = 0;
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

const maximoLineas: number = 256;
const divError: JQuery<HTMLElement> = $("#divError");
const divOutput: JQuery<HTMLElement> = $("#divOutput");

///////////////////
//   VARIABLES   //
///////////////////



///////////////////
//   FUNCIONES   //
///////////////////

function mostrarError(error: string): void {
    divError.text(error);
    throw new Error(error);
}

function mostrarResultado(resultado: string, divResultado: JQuery<HTMLElement>, preFormateado?: boolean): void {
    if(preFormateado) {
        divResultado.html(resultado);
    }
    else {
        divResultado.text(resultado);
    }
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

    //Esta función genera el array con el código separado en tres partes
    function generarArrayCodigo(): string[][] {
        if (txtCodigo == "") { //Si está vacío, muestra un error
            mostrarError("Error: el campo de código está vacío");
        }

        let arrayPorLineas: string[] = txtCodigo.split(/\r?\n/); //Divide el texto usando como separador espacios y retornos de carro
        let arrayGenerado: string[][] = new Array;

        for (let linea: number = 0; linea < arrayPorLineas.length; linea++) {
            let lineaSeparada: string[] = arrayPorLineas[linea].split(/\s+/);
            arrayGenerado[linea] = new Array;

            if (lineaSeparada.length > 3) {
                mostrarError(`Error: demasiados argumentos en la línea ${linea + 1}`);
            }

            for (let elementoLinea: number = 0; elementoLinea < lineaSeparada.length; elementoLinea++) {
                arrayGenerado[linea][elementoLinea] = lineaSeparada[elementoLinea];
            }
        }

        generarEtiquetas(arrayGenerado);
        if (arrayGenerado.length > maximoLineas) {
            mostrarError("Error: el programa introducido supera el límite de lineas");
        }
        return arrayGenerado;

    }

    //Esta función recorre el código y elimina las etiquetas y guarda sus respectivas líneas
    function generarEtiquetas(arrayGenerado: string[][]): void {
        for (let linea: number = 0; linea < arrayGenerado.length; linea++) {
            if (arrayGenerado[linea][0].match(/:$/)) { //Si encuentra una etiqueta
                let etiquetaSinPuntos: string = arrayGenerado[linea][0].replace(":", ""); //Elimina los puntos
                procSMR2.memoria.etiquetas[etiquetaSinPuntos] = linea.toString(); //Guarda la linea en la que está
                arrayGenerado.splice(linea, 1); //Elimina la etiqueta
            }
        }
    }

    //Esta función convierte el string de la instruccion a su binario correspondiente
    function instruccionABinario(instruccionActual: Instruccion): void {
        if (instruccionActual == undefined) { //Si la instruccion no existe, es undefined y muestra un error
            mostrarError(`Error: ha introducido una instrucción ilegal en la línea ${linea + 1}`);
        }
        strBinario += instruccionActual["codigoBinario"];
    }

    //Esta función convierte el string del registro a su binario correspondiente
    function registroABinario(instruccionActual: Instruccion, linea: number): void {
        if (instruccionActual["usaRegistro"]) { //Si la instruccion usa algún registro, añadelo al binario
            if (procSMR2.diccionarios.registros[arrCodigo[linea][1]] == undefined) { //Si el registro no es válido muestra un error
                mostrarError(`Error: ha introducido un registro ilegal en la línea ${linea + 1}`);
            }
            strBinario += procSMR2.diccionarios.registros[arrCodigo[linea][1]]; //Si no, añade el valor de el registro en binario a el string binario
        }
        else { //En caso de que no use un registro, añadimos 3 ceros para rellenar
            strBinario += "000";
        }
    }

    //Esta función convierte el string del dato a su binario correspondiente
    function datoABinario(instruccionActual: Instruccion, linea: number): void {
        if (instruccionActual["usaDatos"]) { //Si la instrucción usa datos, añadelo al binario
            let posicion: number = 1; //Se asume que el dato está en la primera posición
            if (instruccionActual["usaRegistro"]) { //Si usa un registro el dato está en la segunda posición
                posicion++;
            }

            comprobarEtiqueta(posicion);

            if (Number(arrCodigo[linea][posicion]) < 0 || Number(arrCodigo[linea][posicion]) > 255) { //Si el dato es menor que 0 o mayor que 255 activa la bandera de numeroIlegal
                mostrarError("Error: ha introducido un número ilegal en la línea " + linea);
            }
            else { //Si no, convierte el número a binario y añade ceros al principio hasta que mida 8 caracteres de largo
                let numTemporal: string = Number(arrCodigo[linea][posicion]).toString(2); //Convierte el número a binario y luego a string
                while (numTemporal.length < 8) {
                    numTemporal = "0" + numTemporal; //Añade ceros a la izquierda hasta que su longitud sea 8 caracteres
                }
                strBinario += numTemporal;
            }
        }
        else { //En caso de que no use datos, se añaden ocho ceros para rellenar
            strBinario += "00000000";
        }
    }

    //Esta función comprueba si se usa una etiqueta y si es válida
    function comprobarEtiqueta(posicion: number) {
        if (isNaN(Number(arrCodigo[linea][posicion]))) { //Si no es un numero se asume que es una etiqueta
            if (procSMR2.memoria.etiquetas[arrCodigo[linea][posicion]] != undefined) { //Si existe en el objeto etiquetas de procSMR2
                arrCodigo[linea][posicion] = procSMR2.memoria.etiquetas[arrCodigo[linea][posicion]]; //Reemplaza la etiqueta por su número de línea
            }
            else { //Si no existe la etiqueta, muestra un error
                mostrarError(`Error: ha introducido una etiqueta no declarada en la linea " ${linea + 1}`);
            }
        }
    }

    procSMR2.auxiliares.resetearProcesador();
    let txtCodigo: string = $("#txtCodigo").val()!.toString().toLowerCase(); //Recuperamos el texto en el textarea de código
    let arrCodigo: string[][] = generarArrayCodigo();
    let linea: number = 0;
    let strBinario: string = ""; //Una cadena para el binario

    for (linea = 0; linea < arrCodigo.length; linea++) { //Bucle principal de la función
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

    //Esta función hace comprobaciones previas a la ejecución para asegurarse de que el código está bien
    function comprobarErrores(): void {

        mostrarResultado("", divOutput); //Usamos esta función para limpiar el div de errores

        if (txtBinario.length > (maximoLineas * 2)) { //Si el programa es más de 512 bytes de largo, muestra un error
            mostrarError(`Error: el programa supera la longitud de ${maximoLineas * 2} bytes`);
        }

        else if (txtBinario == "") { //Si está vacío, muestra un error
            mostrarError("Error: introduzca código binario válido para ejecutarlo");
        }

        else if (txtBinario.length % 16 != 0) { //Si no se puede dividir perfectamente entre 16 no es válido
            mostrarError("Error, el programa tiene una longitud inválida (No es dividible entre 16)");
        }
    }

    //Esta función separa el binario a un array que contiene tres elementos de longitud 3, 5 y 8 respectivamente
    function generarArrayBinario(): void {
        let arrayBinario: RegExpMatchArray = txtBinario.match(/.{1,16}/g)!; //Convierte el string en binario a un array con elementos que son 16 bits de largo

        for (let contador: number = 0; contador < arrayBinario.length; contador++) {
            procSMR2.memoria.programa[contador] = []; //Se crea un nuevo array en la posición de la línea
            procSMR2.memoria.programa[contador][0] = arrayBinario[contador].slice(0, 5); //Carga la instrucción, 5 bits de largo
            procSMR2.memoria.programa[contador][1] = arrayBinario[contador].slice(5, 8); //Carga el registro, 3 bits de largo
            procSMR2.memoria.programa[contador][2] = arrayBinario[contador].slice(8, 16); //Carga el dato, 8 bits de largo
        }
    }

    let txtBinario: string = $("#txtBinario").val()!.toString().toLowerCase();
    let strOutput: string = "<p>"; //Como el texto es preformateado, usamos una etiqueta HTML

    procSMR2.auxiliares.resetearProcesador();
    comprobarErrores();
    generarArrayBinario();

    //Bucle principal de la función
    for(procSMR2.memoria.linea = 0; procSMR2.memoria.linea < procSMR2.memoria.programa.length; procSMR2.memoria.linea++) {

        if (procSMR2.auxiliares.operacionActual() == undefined) { //Si la operación no existe, muestra un error
			mostrarError("Error: el código binario que ha introducido no es válido")
		}

        let resultadoOperacion: string = procSMR2.operaciones[procSMR2.auxiliares.operacionActual()]();
    
        if(resultadoOperacion != undefined) { //Si la operación ha devuelto un valor (Como por ejemplo la operación imprimec), muestralo
            if(resultadoOperacion == "\n"){ //Si es un salto de línea, conviertelo a HTML
                resultadoOperacion = "<br>"
            }
            strOutput += resultadoOperacion;
        }
	}

	strOutput += "</p>";
	mostrarResultado(strOutput, divOutput, true);

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