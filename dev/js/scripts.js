/* UBICACIÓN DE ELEMENTOS HTML, CREACIÓN DE CONSTANTES Y VARIABLES
================================================================================================= */
const form = document.querySelector('#container-form__form');
const divColores = document.querySelector('#div-colores');
const containerTareas = document.querySelector('#container-tareas');
const containerError = document.querySelector('#container-error');
const pError = document.querySelector('#container-error__parrafo');

const date = new Date();
let colorSeleccionado;
let arrayTareas = [];
let errores = [];
/* ============================================================================================== */

/* FUNCIONES
================================================================================================= */

// SELECCIONA EL COLOR DE FONDO DE LA TAREA (Delegación de Eventos)
divColores.addEventListener('click', (event) => {
  event.preventDefault();
  const colorTarea = event.target.classList[1];

  switch (colorTarea) {
    case 'div1':
      colorSeleccionado = '#008000';
      divColores.firstElementChild.classList.toggle('container-form__form__div-colores__html-div1--active');
      divColores.children[1].classList.remove('container-form__form__div-colores__html-div2--active');
      divColores.lastElementChild.classList.remove('container-form__form__div-colores__html-div3--active');
      break;
    case 'div2':
      colorSeleccionado = '#ff4500';
      divColores.children[1].classList.toggle('container-form__form__div-colores__html-div2--active');
      divColores.firstElementChild.classList.remove('container-form__form__div-colores__html-div1--active');
      divColores.lastElementChild.classList.remove('container-form__form__div-colores__html-div3--active');
      break;
    case 'div3':
      colorSeleccionado = '#ff0000';
      divColores.lastElementChild.classList.toggle('container-form__form__div-colores__html-div3--active');
      divColores.firstElementChild.classList.remove('container-form__form__div-colores__html-div1--active');
      divColores.children[1].classList.remove('container-form__form__div-colores__html-div2--active');
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
});

// FUNCIÓN QUE COMPARA Y VALIDA LA FECHA
const compararFechas = ((inputDate) => {
  const yearActual = date.getFullYear();
  let monthActual = (date.getMonth() + 1).toString();
  let dateActual = (date.getDate()).toString();

  if (monthActual.length <= 1) {
    monthActual = `0${monthActual}`;
  }

  if (dateActual.length <= 1) {
    dateActual = `0${dateActual}`;
  }

  const fechaActual = `${yearActual}-${monthActual}-${dateActual}`;

  if (inputDate < fechaActual) {
    return true;
  }
});

// FUNCIÓN QUE CREA LOS ITEMS O TAREAS
const crearItem = ((inputElement, dateElement, color) => {
  const item = {
    check: false,
    name: inputElement,
    date: dateElement,
    bgcolor: color,
    estado: false,
  };

  arrayTareas.push(item);

  return item;
});

// FUNCIÓN QUE MUESTRA LAS TAREAS TRAIDAS DESDE EL LOCAL STORAGE EN NUESTRO HTML
const mostarTareas = (() => {
  containerTareas.innerHTML = '';
  arrayTareas = JSON.parse(localStorage.getItem('tareas'));

  if (arrayTareas === null) {
    arrayTareas = [];
  } else {
    arrayTareas.forEach((element) => {
      if (element.estado) {
        containerTareas.innerHTML += `<div class="container-tareas__item" style="background-color: ${element.bgcolor}">
                                      <div class="container-tareas__item__div-span">
                                        <span class="container-tareas__item__div-span__span" style="text-decoration: line-through">${element.name}</span>
                                      </div>
                                      <div class="container-tareas__item__div-date">
                                        <label class="container-tareas__item__div-date__date">${element.date}</label>
                                      </div>
                                      <div class="container-tareas__item__div-modificar">
                                        <label class="container-tareas__item__div-modificar__label-modificar">Ѵ</label>
                                      </div>
                                      <div class="container-tareas__item__div-borrar">
                                        <label class="container-tareas__item__div-borrar__label-borrar">X</label>
                                      </div>
                                    </div>`;
      } else {
        containerTareas.innerHTML += `<div class="container-tareas__item" style="background-color: ${element.bgcolor}">
                                        <div class="container-tareas__item__div-span">
                                          <span class="container-tareas__item__div-span__span">${element.name}</span>
                                        </div>
                                        <div class="container-tareas__item__div-date">
                                          <label class="container-tareas__item__div-date__date">${element.date}</label>
                                        </div>
                                        <div class="container-tareas__item__div-modificar">
                                          <label class="container-tareas__item__div-modificar__label-modificar">Ѵ</label>
                                        </div>
                                        <div class="container-tareas__item__div-borrar">
                                          <label class="container-tareas__item__div-borrar__label-borrar">X</label>
                                        </div>
                                      </div>`;
      }
    });
  }
});

// FUNCIÓN QUE GUARDA LAS TAREAS EN EL LOCAL STORAGE
const guardarLocasStorage = (() => {
  localStorage.setItem('tareas', JSON.stringify(arrayTareas));
  errores = [];
  pError.textContent = '';
  colorSeleccionado = '';

  divColores.firstElementChild.classList.remove('container-form__form__div-colores__html-div1--active');
  divColores.children[1].classList.remove('container-form__form__div-colores__html-div2--active');
  divColores.lastElementChild.classList.remove('container-form__form__div-colores__html-div3--active');

  containerError.classList.remove('container-error-visible');

  mostarTareas();
});

// FUNCIÓN PARA ELIMINAR ITEMS O TAREAS TANTO DEL LOCAL STORAGE COMO DE LA WEB
const eliminarTareas = ((tareaAeliminar) => {
  let indexTarea;

  arrayTareas.forEach((element, index) => {
    if (element.name === tareaAeliminar) {
      indexTarea = index;
    } else {
      errores.push('No se encontro la tarea a eliminar');
    }
  });

  arrayTareas.splice(indexTarea, 1);

  guardarLocasStorage();
});

// FUNCIÓN PARA MODIFICAR LOS ITEMS O TAREAS DEL LOCAL STORAGE COMO DE LA WEB
const modificarTareas = ((tareaAmodificar) => {
  const indexTarea = arrayTareas.findIndex((element) => element.name === tareaAmodificar);

  if (arrayTareas[indexTarea].estado === true) {
    arrayTareas[indexTarea].estado = false;
  } else {
    arrayTareas[indexTarea].estado = true;
  }

  guardarLocasStorage();
});

/* ============================================================================================== */

/* CÓDIGO PRINCIPAL Y EVENT LISTENER
================================================================================================= */

// Coloca el foco en el input donde se agrega la tarea
form.input_item.focus();

// Evento de escucha del submit en el formulario
form.addEventListener('submit', (event) => {
  event.preventDefault();
  errores = [];

  if (form.input_item.value === '') {
    errores.push('Tarea descripción requerida');
    form.input_item.focus();
  } else if (form.input_item.value.length > 60) {
    errores.push(`De [1-60] caracteres, actuales ${form.input_item.value.length}`);
    form.input_item.focus();
  } else if ((colorSeleccionado === undefined) || (colorSeleccionado === null) || (colorSeleccionado === '')) {
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
    const inputElement = form.input_item.value;
    form.input_item.value = '';
    const dateElement = form.input_date.value;

    crearItem(inputElement, dateElement, colorSeleccionado);
    guardarLocasStorage();
  }
});

// Evento de escucha del DOM al terminar de cargar todos los elementos html, llama a la función
// mostrarTareas(), encargada de mostrar o pintar las tareas traidas desde el localStorage
document.addEventListener('DOMContentLoaded', mostarTareas);

// Evento de escucha del Div contenedor de todas nuestras tareas, esto nos permitirá seleccionar
// en especial la etiqueta label con el simbolo de eliminar.
containerTareas.addEventListener('click', (event) => {
  event.preventDefault();

  if (event.target.innerHTML === 'X') {
    // Tarea seleccionada para eliminar
    const tareaAeliminar = event.path[2].childNodes[1].innerText.trim();
    eliminarTareas(tareaAeliminar);
  } else if (event.target.innerHTML === 'Ѵ') {
    // Tarea seleccionada para modificar
    const tareaAmodificar = event.path[2].childNodes[1].innerText.trim();
    modificarTareas(tareaAmodificar);
  }
});
/* ============================================================================================== */
