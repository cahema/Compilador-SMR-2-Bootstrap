'use strict'

$("#navbar").load("navbar.html", function() {
    $("#navSobreMi").removeClass("active");
    $("#navCompilador").removeClass("active");
    $("#navHistoria").removeClass("active");
    $("#navJuego").addClass("active");
});

//Constantes
const divJuego = $("#divJuego");

const arrayPreguntas = [
    "¿Quién implementó el primer compilador?",
    "¿Quién escribió en su tesis el concepto del compilador?",
    "¿Qué significa la G en GCC?",
    "¿Qué es el bootstrapping?",
    "¿Qué lenguaje compila el compilador Clang?"
];

const arrayRespuestas = [
	["A. Corrado Böhm", "B. Grace Hopper", "C. Alick Glennie", "D. Friedrich L. Bauer"],
	["A. Corrado Böhm", "B. Alan Turing", "C. Andrew S. Tanenbaum", "D. Bill Gates"],
	["A. General", "B. Great", "C. Gradiant", "D. GNU"],
	["A. Usar bootstrap para hacer una web", "B. Cuando un compilador se compila a si mismo", "C. No existe ese concepto", "D. Usar un compilador"],
	["A. Rust", "B. Python", "C. Java", "D. Familia de lenguajes C"]
];

const arrayRespuestasCorrectas = [
    "B. Grace Hopper",
    "A. Corrado Böhm",
    "D. GNU",
    "B. Cuando un compilador se compila a si mismo",
    "D. Familia de lenguajes C"
];

//Contadores
let tiempoRestante;
let preguntaActual;
let respuestaSeleccionada;
let pausa;
let respuestasCorrectas;
let respuestasErroneas;

//Función que genera la pantalla inicial
function pantallaInicial() {

    //Reiniciar las variables del juego
    preguntaActual = 0;
    respuestasCorrectas = 0;
    respuestasErroneas = 0;

    //Limpiar la pantalla y generar la inicial
	divJuego.empty();
	let h1 = generarElemento("<h1>", null, "pt-3", "Trivia de compiladores");
	let btn = generarElemento("<button>", "botonEmpezar", "click btn btn-outline-dark my-5 text-dark", "Empezar");
	divJuego.append(h1, btn);
}

//Funcion que genera el HTML de cada ronda
function generarHTML() {
	$("#divJuego").empty();
	temporizador();
	let pregunta = generarElemento("<h3>", "text-area", "py-2", arrayPreguntas[preguntaActual]);
	let divTemporizador = generarTemporizador();
	let botonesRespuestas = generarBotones(arrayRespuestas[preguntaActual]);
	divJuego.append(pregunta, divTemporizador, botonesRespuestas);
}

//Funcion que comprueba si una respuesta es correcta o no
function clickRespuesta() {
	tiempoRestante = 0;
	respuestaSeleccionada = $(this).text();
    desactivarBotones();
	if (respuestaSeleccionada === arrayRespuestasCorrectas[preguntaActual]) {
		clearInterval(pausa);
		correcta();
	} else {
		clearInterval(pausa);
		erronea();
	}
}

//Funcion que se llama cuando la respuesta es correcta
function correcta() {
	respuestasCorrectas++;
	$("#times").hide();
	$("#text-area").html(generarElemento("<h1>", null, null, "¡Respuesta Correcta!"));
	setTimeout(pause, 2000);
}

//Funcion que se llama cuando la respuesta es erronea
function erronea() {
	respuestasErroneas++;
	$("#times").hide();
	$("#text-area").html(generarElemento("<h1>", null, null, "¡Respuesta Equivocada!"));
	setTimeout(pause, 2000);
}

//Muestra la pantalla de haber acabado el juego
function pantallaFinal() {
	divJuego.empty();
	let h3 = generarElemento("<h3>", null, "py-4", "¡Has acabado el juego!");
	let p = generarElemento("<p>", null, "py-1", `Respuestas correctas: ${respuestasCorrectas}`);
	let p2 = generarElemento("<p>", null, null, `Respuestas equivocadas:  ${respuestasErroneas}`);
	let btn = generarElemento("<button>", "botonReset", "btn btn-outline-dark mt-4 mb-3 text-dark", "¡Empezar de nuevo!");
	divJuego.append(h3, p, p2, btn);
}

//Función temporizador
function temporizador() {
	tiempoRestante = 300;
	pausa = setInterval(countdown, 1000);

	function countdown() {
		if (tiempoRestante === 0) {
			clearTimeout(pausa);
			timeOut();
		} else {
			tiempoRestante--;
		}
		$(".temporizador").html(tiempoRestante);
	}
}

//Funcion que se llama cuando se acaba el tiempo
function timeOut() {
	divJuego.empty();
	let h3 = generarElemento("<h3>", null, "py-4", "¡SE ACABÓ EL TIEMPO!");
	let btn = generarElemento("<button>", "botonReset", "btn btn-outline-dark mt-4 mb-3 text-dark", "¡Empezar de nuevo!");
	divJuego.append(h3, btn);
}

//Funcion que se encarga de mostrar todas las preguntas
function pause() {
	if (preguntaActual < arrayPreguntas.length-1) {
		preguntaActual++;
		generarHTML();
	} else {
		pantallaFinal();
	}
}

//Funcion para generar elementos HTML
function generarElemento(type, id, className, text) {
	const element = $(type).addClass(className).text(text);
	if (id !== null) {
		element.attr("id", id);
	}
	return element;
}

//Funcion para generar el temporizador
function generarTemporizador() {
	const divTemporizador = generarElemento("<div>", null, null, null);
	const textoTemporizador = generarElemento("<h4>", "times", null, "Time Remaining:");
	const tiempoRestante = generarElemento("<small>", null, "px-1 temporizador", "30");
	textoTemporizador.append(tiempoRestante);
	return divTemporizador.append(textoTemporizador);
}

//Funcion para generar los botones de las respuestas
function generarBotones(respuesta) {
	let botonesRespuestas = generarElemento("<div>", "botonesRespuestas", "pb-3 d-flex justify-content-left flex-column", null);
	for (let i = 0; i <= 3; i++) {
		botonesRespuestas.append(generarElemento("<button>", "respuesta", "click btn btn-outline-dark mt-1 mb-3 d-flex justify-content-left justify-content-center", respuesta[i]));
	}
	return botonesRespuestas;
}

function desactivarBotones() {
    let botonesRespuestas = $("#botonesRespuestas > :button");
    for (const boton in botonesRespuestas) {
        $(boton).prop("disabled", true);
    }
}

//Event Listeners
$("body").on("click", "#botonEmpezar", generarHTML);
$("body").on("click", "#respuesta", clickRespuesta);
$("body").on("click", "#botonReset", pantallaInicial);

//Genera el juego cuando la web haya terminado de cargar
$(document).ready(pantallaInicial);