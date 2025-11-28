// Configuración de canciones (rutas relativas a index.html)
//Declaramos una constante songs que es un array de objetos. Ahí guardamos la información de cada canción.
const songs = [
    {
        itemSelector: ".item-1", // Canción asociada al elemento del DOM que tenga la clase .item-1
        audioPath: "assets/songs/song1.mp3",  // Audio que se va a reproducir para ese item.
    },
    // Lo mismo para .item-2 y .item-3
    {
        itemSelector: ".item-2",
        audioPath: "assets/songs/song2.mp3",
    },
    {
        itemSelector: ".item-3",
        audioPath: "assets/songs/song3.mp3",
    },
];

// Variable que nos va a indicar qué canción está seleccionada o reproduciéndose. 
// La inicializamos a null porque no hay ninguna al principio.
let currentIndex = null;
// Este es el array donde luego vamos guardando objetos con el audio y los elementos 
// relacionados (item, vinyl, cover) para cada canción.
let audioElements = [];

// Elementos de la barra inferior
const playerTitle = document.querySelector(".player-title"); // referencia al elemento que muestra el título de la canción.
const playerArtist = document.querySelector(".player-artist"); // donde se muestra el artista.
const playerCoverThumb = document.querySelector(".player-cover-thumb"); // miniatura de la portada en la barra.
const playerToggle = document.querySelector(".player-toggle"); // botón circular de play/pause de la barra inferior.
const playerIcon = playerToggle.querySelector(".icon"); // dentro del botón, el elemento que dibuja el icono (play o pausa).
const currentTimeEl = document.querySelector(".current-time"); // tiempo actual de la canción.
const totalTimeEl = document.querySelector(".total-time"); // duración total de la canción.
const progressBarInner = document.querySelector(".progress-bar-inner"); // el relleno de la barra de progreso.


// Función que recibe un número de segundos y devuelve un texto formateado con los minutos y segundos de la canción.
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00"; // si seconds no es un número válido (por ejemplo, antes de cargar los metadatos), devuelve "0:00"
    const m = Math.floor(seconds / 60); // minutos = parte entera de dividir segundos entre 60.
    const s = Math.floor(seconds % 60); // segundos restantes = módulo de 60.
    return `${m}:${s.toString().padStart(2, "0")}`;
    // s.toString().padStart(2, "0") → convierte los segundos a string y añade un 0 al inicio si tiene solo 1 dígito (ej: 7 → "07").
    // return \${m}:${...}`; → construye el string final min:segundos.
}


// Función para actualizar la barra inferior con la info de la canción en posición index.
function updateNowPlaying(index) {
    const item = document.querySelector(songs[index].itemSelector); // Usamos el index para mirar songs[index], obtener su itemSelector (por ejemplo .item-1) y buscar ese elemento en el DOM.
    const title = item.dataset.title || "Sin título"; // Cogemos el atributo data-title del elemento. Si no existe, ponemos "Sin título".
    const artist = item.dataset.artist || "Desconocido"; // Lo mismo con el artista de la canción.
    const cover = item.dataset.cover || ""; // Cogemos la ruta de la portada desde data-cover o string vacío si no hay.

    // Una vez tenemos los datos, ponemos el título en el texto de .player-title y el artista de .player-artist
    playerTitle.textContent = title;
    playerArtist.textContent = artist;
    // Si cover es distinto de vacío, cambiamos la portada por la de la imagen correspondiente.
    if (cover) {
        playerCoverThumb.style.backgroundImage = `url('${cover}')`;
    }
}


// Función para cambiar el icono de play o pausa.
// Recibimos una variable booleana playing
function setPlayIcon(playing) {
    playerIcon.className = "icon"; // Reseteamos todas las clases del icono y deja solo icon. 
    // Así nos aseguramos de quitar icon-play o icon-pause antes.
    if (playing) {
        playerIcon.classList.add("icon-pause"); // Si se está reproduciendo → añadimos la clase icon-pause.
    } else {
        playerIcon.classList.add("icon-play"); // Si no, la clase icon-play.
    }
    // El CSS es el que se encarga de dibujar visualmente los iconos.
}


// Función que se encarga de detener todas las canciones.
function pauseAll() {
    // Iteramos sobre todos los elementos usando un callback 
    audioElements.forEach(({ audio, item, vinyl, cover }) => { // forEach decide cuándo y cuántas veces ejecutarlo (una por cada elemento del array)
        // Usa destructuración para sacar audio, item, vinyl y cover.
        audio.pause(); // pausamos el audio.
        item.classList.remove("active"); // quitamos el estado “activo” de la tarjeta.
        vinyl.classList.remove("playing"); // quitamos la clase que hace que el vinilo se “mueva”.
        cover.classList.remove("glow"); // quitamos el glow verde de la portada.
    });
    setPlayIcon(false); // ponemos el icono de la barra inferior en modo “play” (porque ya no hay nada sonando).
}

// Inicializamos cada item
songs.forEach((songConfig, index) => { // Recorremos el array songs donde 
    // songConfig será cada objeto { itemSelector, audioPath }.
    // e index es la posición (0, 1, 2...).
    const item = document.querySelector(songConfig.itemSelector); // Elemento .item-1, .item-2, etc.
    const cover = item.querySelector(".cover"); // dentro de ese item, buscamos la portada.
    const vinyl = item.querySelector(".vinyl"); // y el elemento que representa el vinilo.
    const audio = new Audio(songConfig.audioPath); // creamos un objeto Audio de JavaScript, con la ruta songX.mp3.

    // guardamos todo junto en el array global para poder acceder luego.
    audioElements.push({ audio, item, vinyl, cover });

    // Cuando hacemos clic en la tarjeta de la canción
    item.addEventListener("click", () => {
        // Si la canción que clicamos no es la misma que la que estaba sonando
        if (currentIndex !== index) {
            // Lo pausamos
            pauseAll();
            currentIndex = index; // actualizamos el índice actual a la canción clicada.
            updateNowPlaying(index); // actualizamos la barra inferior con su información.
        }

        // Para la canción que clicamos, volvemos a “sacar” el objeto de audioElements y extraemos audio, vinyl y cover.
        const { audio, vinyl, cover } = audioElements[index];

        // Si el audio está pausado:
        if (audio.paused) {
            pauseAll(); // Pausamos todo, por si acaso había algo sonando
            audio.play(); // Reproducimos la canción que clicamos
            item.classList.add("active"); // marcamos la tarjeta como activa
            vinyl.classList.add("playing"); // vinilo activa la animación de reproducción.
            cover.classList.add("glow"); // glow verde en la portada.
            setPlayIcon(true); // Convertimos el icono a pause.
        } else { // Si no
            audio.pause(); // Pausamos el audio
            item.classList.remove("active"); // Quitamos las clases
            vinyl.classList.remove("playing");
            cover.classList.remove("glow");
            setPlayIcon(false); // Convertimos el icono a play
        }
    });

    // Ahora creamos un evento que salta cuando el navegador 
    // ya conoce la duración y otros datos del audio para evitar errores
    audio.addEventListener("loadedmetadata", () => {
        if (index === currentIndex) { // Si la canción coincide con la seleccionada
            totalTimeEl.textContent = formatTime(audio.duration); // Escribimos en la barra inferior la duración total en formato min:seg
        }
    });

    // salta muchas veces por segundo mientras el audio avanza.
    audio.addEventListener("timeupdate", () => {
        if (index === currentIndex) { // Si la canción coincide con la seleccionada
            currentTimeEl.textContent = formatTime(audio.currentTime); // Actualiza el tiempo actual.
            totalTimeEl.textContent = formatTime(audio.duration); // Se asegura de que la duración total está bien puesta.
            const pct = (audio.currentTime / audio.duration) * 100; // Calculamos el porcentaje de reproducción
            progressBarInner.style.width = `${pct || 0}%`; // Cambiamos el ancho del relleno de la barra de progreso.
        }
    });

    // Cuando la canción termina por si sola (final de reproducción)
    audio.addEventListener("ended", () => {
        item.classList.remove("active"); // Quitamos las clases active, playing, glow.
        vinyl.classList.remove("playing");
        cover.classList.remove("glow");
        setPlayIcon(false); // Ponemos el botón de play
        progressBarInner.style.width = "0%"; // reiniciamos la barra de progreso.
    });
});

// Botón global Play/Pause
playerToggle.addEventListener("click", () => { // Cuando haces clic en el botón de la barra inferior
    if (currentIndex === null) { // Si todavía no se ha elegido ninguna canción
        currentIndex = 0; // asumimos la primera canción (songs[0])
        updateNowPlaying(0); // actualizamos la info de la barra con esa canción.
    }
    // Obtienemos el audio y elementos visuales de la canción actual.
    const { audio, item, vinyl, cover } = audioElements[currentIndex];

    // Misma lógica que antes
    if (audio.paused) {
        pauseAll();
        audio.play();
        item.classList.add("active");
        vinyl.classList.add("playing");
        cover.classList.add("glow");
        setPlayIcon(true);
    } else {
        audio.pause();
        item.classList.remove("active");
        vinyl.classList.remove("playing");
        cover.classList.remove("glow");
        setPlayIcon(false);
    }
});

