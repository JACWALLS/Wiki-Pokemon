// MODO OSCURO
function cambiarModo() {
  document.body.classList.toggle("oscuro");
  const boton = document.getElementById("botonModo");
  if (document.body.classList.contains("oscuro")) {
    boton.innerHTML = '<i class="fas fa-sun"></i> Modo claro';
  } else {
    boton.innerHTML = '<i class="fas fa-moon"></i> Modo oscuro';
  }
  localStorage.setItem("modoOscuro", document.body.classList.contains("oscuro"));
}

// Cargar modo oscuro guardado
if (localStorage.getItem("modoOscuro") === "true") {
  document.body.classList.add("oscuro");
  const boton = document.getElementById("botonModo");
  if (boton) boton.innerHTML = '<i class="fas fa-sun"></i> Modo claro';
}

// AGREGAR REGIONES
function agregar() {
  let tareaInput = document.getElementById("tarea");
  let tarea = tareaInput.value.trim();
  let lista = document.getElementById("lista");
  if (tarea === "") {
    alert("¡Escribe una región chida! Ej: Hoenn, Sinnoh, Unova...");
    return;
  }
  let li = document.createElement("li");
  li.innerHTML = `<i class="fas fa-map-pin"></i> ${tarea}`;
  lista.appendChild(li);
  tareaInput.value = "";
  
  // Guardar en localStorage
  let regionesGuardadas = [];
  document.querySelectorAll("#lista li").forEach(li => {
    regionesGuardadas.push(li.innerText.replace(/[^\w\sáéíóú]/gi, '').trim());
  });
  localStorage.setItem("regionesExtra", JSON.stringify(regionesGuardadas));
}

// Cargar regiones guardadas
function cargarRegionesGuardadas() {
  let regiones = localStorage.getItem("regionesExtra");
  if (regiones) {
    let lista = document.getElementById("lista");
    lista.innerHTML = "";
    JSON.parse(regiones).forEach(reg => {
      let li = document.createElement("li");
      li.innerHTML = `<i class="fas fa-map-pin"></i> ${reg}`;
      lista.appendChild(li);
    });
  }
}

// BOTÓN SUBIR
const btnArriba = document.getElementById("btnArriba");
if (btnArriba) {
  btnArriba.onclick = function() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
}

// INICIALIZAR TODO CUANDO EL DOM ESTÉ LISTO
document.addEventListener("DOMContentLoaded", () => {
  // Cargar regiones
  cargarRegionesGuardadas();
  
  // Sistema de LIKES
  const btnLike = document.getElementById("btnLike");
  const contadorLikesSpan = document.getElementById("contadorLikes");
  let likes = localStorage.getItem("likes");
  likes = likes === null ? 0 : parseInt(likes);
  contadorLikesSpan.textContent = likes;
  
  if (btnLike) {
    btnLike.addEventListener("click", () => {
      likes++;
      contadorLikesSpan.textContent = likes;
      localStorage.setItem("likes", likes);
      btnLike.style.transform = "scale(1.2)";
      setTimeout(() => { btnLike.style.transform = "scale(1)"; }, 150);
    });
  }
  
  // CONTADOR DEL QUIZ
  const inputsQuiz = document.querySelectorAll("#quiz input");
  const contadorSpan = document.getElementById("contador");
  
  function actualizarContadorQuiz() {
    let total = 0;
    inputsQuiz.forEach(input => {
      if (input.checked) total++;
    });
    if (contadorSpan) contadorSpan.textContent = total;
  }
  
  inputsQuiz.forEach(input => input.addEventListener("change", actualizarContadorQuiz));
  actualizarContadorQuiz();
  
  // GUARDAR RESPUESTAS DEL QUIZ
  const btnGuardar = document.getElementById("guardarQuiz");
  const mensajeGuardadoSpan = document.getElementById("mensajeGuardado");
  
  if (btnGuardar) {
    btnGuardar.addEventListener("click", () => {
      let respuestasGuardar = [];
      inputsQuiz.forEach(input => {
        respuestasGuardar.push(input.checked);
      });
      localStorage.setItem("respuestasQuizMamalon", JSON.stringify(respuestasGuardar));
      mensajeGuardadoSpan.innerHTML = "✅ ¡Respuestas guardadas exitosamente! 🔥";
      setTimeout(() => {
        if (mensajeGuardadoSpan) mensajeGuardadoSpan.innerHTML = "";
      }, 2500);
    });
  }
  
  // Cargar respuestas guardadas del quiz
  const respuestasPrevias = localStorage.getItem("respuestasQuizMamalon");
  if (respuestasPrevias && inputsQuiz.length > 0) {
    const respuestasArr = JSON.parse(respuestasPrevias);
    if (respuestasArr.length === inputsQuiz.length) {
      inputsQuiz.forEach((input, i) => {
        input.checked = respuestasArr[i];
      });
      actualizarContadorQuiz();
    }
  }
  
  // CARRUSEL DE IMÁGENES
  const imagenesCar = document.querySelectorAll(".imagenes-carrusel img");
  const btnSiguiente = document.getElementById("siguiente");
  const btnAnterior = document.getElementById("anterior");
  let indiceActual = 0;
  
  if (imagenesCar.length) {
    function mostrarImagenCarrusel() {
      imagenesCar.forEach((img, i) => {
        img.classList.toggle("activa", i === indiceActual);
      });
    }
    mostrarImagenCarrusel();
    
    if (btnSiguiente) {
      btnSiguiente.addEventListener("click", () => {
        indiceActual = (indiceActual + 1) % imagenesCar.length;
        mostrarImagenCarrusel();
      });
    }
    if (btnAnterior) {
      btnAnterior.addEventListener("click", () => {
        indiceActual = (indiceActual - 1 + imagenesCar.length) % imagenesCar.length;
        mostrarImagenCarrusel();
      });
    }
  }
  
  // Prevenir salida sin confirmación en enlaces externos
  const allLinks = document.querySelectorAll("a");
  allLinks.forEach(link => {
    if (link.hostname && link.hostname !== window.location.hostname && link.href.startsWith("http")) {
      link.addEventListener("click", (e) => {
        if (!confirm("⚠️ Estás saliendo de Pokemon Wiki. ¿Continuar?")) {
          e.preventDefault();
        }
      });
    }
  });
  
  // Manejar imágenes rotas
  const imagenesGal = document.querySelectorAll(".imagen");
  imagenesGal.forEach(img => {
    img.addEventListener("error", function() {
      this.src = "https://placehold.co/600x400?text=Region+Legendaria";
    });
  });
});

console.log("🔥 Pokémon Wiki Élite cargada — estilo mamastrosisimo!");