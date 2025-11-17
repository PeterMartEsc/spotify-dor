// Configuración de las canciones
const songs = [
    {
        id: 1,
        item: ".item-1",
        cover: ".cv1",
        audio: "assets/songs/song1.mp3"
    },
    {
        id: 2,
        item: ".item-2",
        cover: ".cv2",
        audio: "assets/songs/song2.mp3"
    },
    {
        id: 3,
        item: ".item-3",
        cover: ".cv3",
        audio: "assets/songs/song3.mp3"
    }
];

let audios = []; // Para pausar las otras canciones
let audioGeneral = new Audio(songs[0].audio); //Para el audio del footer
let coverGeneral = 1;

songs.forEach(config => {
    const coverPlaying = document.querySelector(".cover-player");

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
            coverPlaying.setAttribute("src", `./assets/images/cover${config.id}.jpg`)
            audioGeneral = new Audio(config.audio);
            cover.classList.add("open");
            vinyl.classList.add("playing");
        } else {
            audio.pause();
            cover.classList.remove("open");
            vinyl.classList.remove("playing");
        }
    });
});


let player = document.querySelector(".icon-play");
let coverPlaying = document.querySelector(".cover-player");
let playerButton = document.querySelector(".player-button");

function calculateTime(time){
    let minutes = "0" + Math.floor(time / 60);
    let seconds = "0" +  Math.floor(time - minutes * 60);
    let dur = minutes.substr(-2) + ":" + seconds.substr(-2);
}

player.addEventListener("click", ()=>{

    // console.log(audioGeneral)
    // toggle play / pause
    if (audioGeneral.paused) {
        audioGeneral.play();
        playerButton.setAttribute("src", 'assets/images/pause-icon.png')
        coverPlaying.setAttribute("src", `./assets/images/cover${songs[0].id}.jpg`)
        console.log("playing")
    } else {
        audioGeneral.pause();
        playerButton.setAttribute("src", 'assets/images/play-icon.png')
        console.log("paused")
    }
});