// Configuración de las canciones
const songs = [
    {
        item: ".item-1",
        cover: ".cv1",
        audio: "assets/songs/song1.mp3"
    },
    {
        item: ".item-2",
        cover: ".cv2",
        audio: "assets/songs/song2.mp3"
    },
    {
        item: ".item-3",
        cover: ".cv3",
        audio: "assets/songs/song3.mp3"
    }
];

let audios = []; // Para pausar las otras canciones

songs.forEach(config => {
    const item = document.querySelector(config.item);
    const cover = document.querySelector(config.cover);
    const vinyl = item.querySelector(".vinyl");
    const audio = new Audio(config.audio);

    audios.push(audio);

    item.addEventListener("click", () => {

        // pausa todas las demás
        audios.forEach(a => {
            if (a !== audio) a.pause();
        });

        // toggle play / pause
        if (audio.paused) {
            audio.play();
            cover.classList.add("open");
            vinyl.classList.add("playing");
        } else {
            audio.pause();
            cover.classList.remove("open");
            vinyl.classList.remove("playing");
        }
    });
});
