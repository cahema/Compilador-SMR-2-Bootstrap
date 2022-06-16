'use strict'

$("#navbar").load("navbar.html", function() {
    $("#navSobreMi").addClass("active");
    $("navCompilador").removeClass("active");
    $("navJuego").removeClass("active");
    $("navHistoria").removeClass("active");
});