'use strict'

$("#navbar").load("navbar.html", function() {
    $("#navSobreMi").removeClass("active");
    $("#navCompilador").removeClass("active");
    $("#navHistoria").addClass("active");
    $("#navJuego").removeClass("active");
});