'use strict'

$("#navbar").load("navbar.html", function() {
    $("#navSobreMi").addClass("active");
    $("#navCompilador").removeClass("active");
    $("#navHistoria").removeClass("active");
    $("#navJuego").removeClass("active");
});