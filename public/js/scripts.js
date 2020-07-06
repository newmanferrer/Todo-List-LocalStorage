"use strict";

/* UBICACIÓN DE ELEMENTOS HTML, CREACIÓN DE CONSTANTES Y VARIABLES
================================================================================================= */
var form = document.querySelector('#container-form__form');
var divColores = document.querySelector('#div-colores');
var containerTareas = document.querySelector('#container-tareas');
var containerError = document.querySelector('#container-error');
var pError = document.querySelector('#container-error__parrafo');
var date = new Date();
var colorSeleccionado;
var arrayTareas = [];
var errores = [];
/* ============================================================================================== */

/* FUNCIONES
================================================================================================= */
// SELECCIONA EL COLOR DE FONDO DE LA TAREA (Delegación de Eventos)

divColores.addEventListener('click', function (event) {
  event.preventDefault();
  var colorTarea = event.target.classList[1];

  switch (colorTarea) {
    case 'div1':
      colorSeleccionado = '#008000';
      divColores.firstElementChild.classList.toggle('container-form__form__div-colores__html-div1--active');
      break;

    case 'div2':
      colorSeleccionado = '#ff4500';
      divColores.children[1].classList.toggle('container-form__form__div-colores__html-div2--active');
      break;

    case 'div3':
      colorSeleccionado = '#ff0000';
      divColores.lastElementChild.classList.toggle('container-form__form__div-colores__html-div3--active');
      break;

    case undefined:
      errores.push('Color de tarea indefinido');
      break;

    case null:
      errores.push('Color de tarea null');
      break;

    default:
      errores.push('Color de tarea requerido');
      break;
  }
}); // FUNCIÓN QUE COMPARA Y VALIDA LA FECHA

var compararFechas = function compararFechas(inputDate) {
  var yearActual = date.getFullYear();
  var monthActual = (date.getMonth() + 1).toString();
  var dateActual = date.getDate().toString();

  if (monthActual.length <= 1) {
    monthActual = "0".concat(monthActual);
  }

  if (dateActual.length <= 1) {
    dateActual = "0".concat(dateActual);
  }

  var fechaActual = "".concat(yearActual, "-").concat(monthActual, "-").concat(dateActual);

  if (inputDate < fechaActual) {
    return true;
  }
}; // FUNCIÓN QUE CREA LOS ITEMS O TAREAS


var crearItem = function crearItem(inputElement, dateElement, color) {
  var item = {
    check: false,
    name: inputElement,
    date: dateElement,
    bgcolor: color,
    estado: false
  };
  arrayTareas.push(item);
  return item;
}; // FUNCIÓN QUE MUESTRA LAS TAREAS TRAIDAS DESDE EL LOCAL STORAGE EN NUESTRO HTML


var mostarTareas = function mostarTareas() {
  containerTareas.innerHTML = '';
  arrayTareas = JSON.parse(localStorage.getItem('tareas'));

  if (arrayTareas === null) {
    arrayTareas = [];
  } else {
    arrayTareas.forEach(function (element) {
      if (element.estado) {
        containerTareas.innerHTML += "<div class=\"container-tareas__item\" style=\"background-color: ".concat(element.bgcolor, "\">\n                                      <div class=\"container-tareas__item__div-span\">\n                                        <span class=\"container-tareas__item__div-span__span\" style=\"text-decoration: line-through\">").concat(element.name, "</span>\n                                      </div>\n                                      <div class=\"container-tareas__item__div-date\">\n                                        <label class=\"container-tareas__item__div-date__date\">").concat(element.date, "</label>\n                                      </div>\n                                      <div class=\"container-tareas__item__div-modificar\">\n                                        <label class=\"container-tareas__item__div-modificar__label-modificar\">\u0474</label>\n                                      </div>\n                                      <div class=\"container-tareas__item__div-borrar\">\n                                        <label class=\"container-tareas__item__div-borrar__label-borrar\">X</label>\n                                      </div>\n                                    </div>");
      } else {
        containerTareas.innerHTML += "<div class=\"container-tareas__item\" style=\"background-color: ".concat(element.bgcolor, "\">\n                                        <div class=\"container-tareas__item__div-span\">\n                                          <span class=\"container-tareas__item__div-span__span\">").concat(element.name, "</span>\n                                        </div>\n                                        <div class=\"container-tareas__item__div-date\">\n                                          <label class=\"container-tareas__item__div-date__date\">").concat(element.date, "</label>\n                                        </div>\n                                        <div class=\"container-tareas__item__div-modificar\">\n                                          <label class=\"container-tareas__item__div-modificar__label-modificar\">\u0474</label>\n                                        </div>\n                                        <div class=\"container-tareas__item__div-borrar\">\n                                          <label class=\"container-tareas__item__div-borrar__label-borrar\">X</label>\n                                        </div>\n                                      </div>");
      }
    });
  }
}; // FUNCIÓN QUE GUARDA LAS TAREAS EN EL LOCAL STORAGE


var guardarLocasStorage = function guardarLocasStorage() {
  localStorage.setItem('tareas', JSON.stringify(arrayTareas));
  errores = [];
  pError.textContent = '';
  colorSeleccionado = '';
  divColores.firstElementChild.classList.remove('container-form__form__div-colores__html-div1--active');
  divColores.children[1].classList.remove('container-form__form__div-colores__html-div2--active');
  divColores.lastElementChild.classList.remove('container-form__form__div-colores__html-div3--active');
  containerError.classList.remove('container-error-visible');
  mostarTareas();
}; // FUNCIÓN PARA ELIMINAR ITEMS O TAREAS TANTO DEL LOCAL STORAGE COMO DE LA WEB


var eliminarTareas = function eliminarTareas(tareaAeliminar) {
  var indexTarea;
  arrayTareas.forEach(function (element, index) {
    if (element.name === tareaAeliminar) {
      indexTarea = index;
    } else {
      errores.push('No se encontro la tarea a eliminar');
    }
  });
  arrayTareas.splice(indexTarea, 1);
  guardarLocasStorage();
}; // FUNCIÓN PARA MODIFICAR LOS ITEMS O TAREAS DEL LOCAL STORAGE COMO DE LA WEB


var modificarTareas = function modificarTareas(tareaAmodificar) {
  var indexTarea = arrayTareas.findIndex(function (element) {
    return element.name === tareaAmodificar;
  });

  if (arrayTareas[indexTarea].estado === true) {
    arrayTareas[indexTarea].estado = false;
  } else {
    arrayTareas[indexTarea].estado = true;
  }

  guardarLocasStorage();
};
/* ============================================================================================== */

/* CÓDIGO PRINCIPAL Y EVENT LISTENER
================================================================================================= */
// Coloca el foco en el input donde se agrega la tarea


form.input_item.focus(); // Evento de escucha del submit en el formulario

form.addEventListener('submit', function (event) {
  event.preventDefault();
  errores = [];

  if (form.input_item.value === '') {
    errores.push('Tarea descripción requerida');
    form.input_item.focus();
  } else if (form.input_item.value.length > 60) {
    errores.push("De [1-60] caracteres, actuales ".concat(form.input_item.value.length));
    form.input_item.focus();
  } else if (colorSeleccionado === undefined || colorSeleccionado === null || colorSeleccionado === '') {
    errores.push('Tarea color requerido');
    divColores.firstElementChild.focus();
  } else if (form.input_date.value === '') {
    errores.push('Tarea fecha requerida');
    form.input_date.focus();
  } else if (compararFechas(form.input_date.value) === true) {
    errores.push('Fecha menor a la actual');
    form.input_date.focus();
  }

  if (errores.length > 0) {
    event.preventDefault();
    containerError.classList.add('container-error-visible');
    pError.textContent = '';
    pError.innerHTML = errores.join(', ');
  } else {
    var inputElement = form.input_item.value;
    form.input_item.value = '';
    var dateElement = form.input_date.value;
    crearItem(inputElement, dateElement, colorSeleccionado);
    guardarLocasStorage();
  }
}); // Evento de escucha del DOM al terminar de cargar todos los elementos html, llama a la función
// mostrarTareas(), encargada de mostrar o pintar las tareas traidas desde el localStorage

document.addEventListener('DOMContentLoaded', mostarTareas); // Evento de escucha del Div contenedor de todas nuestras tareas, esto nos permitirá seleccionar
// en especial la etiqueta label con el simbolo de eliminar.

containerTareas.addEventListener('click', function (event) {
  event.preventDefault();

  if (event.target.innerHTML === 'X') {
    // Tarea seleccionada para eliminar
    var tareaAeliminar = event.path[2].childNodes[1].innerText.trim();
    eliminarTareas(tareaAeliminar);
  } else if (event.target.innerHTML === 'Ѵ') {
    // Tarea seleccionada para modificar
    var tareaAmodificar = event.path[2].childNodes[1].innerText.trim();
    modificarTareas(tareaAmodificar);
  }
});
/* ============================================================================================== */