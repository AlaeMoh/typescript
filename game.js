"use strict";
const Game_Start = shuffleImages();
const bgAudio = new Audio('./assets/audio/bgmusic.mp3');
bgAudio.loop = true;
let isMusicPlaying = false;
function playAudio() {
    if (isMusicPlaying)
        return;
    bgAudio.play().then(() => {
        isMusicPlaying = true;
    }).catch((error) => {
        console.log(error);
    });
}
function muteAudio() {
    const btn = document.getElementById("btn");
    btn?.addEventListener("click", () => {
        if (bgAudio.volume === 0) {
            bgAudio.volume = 0.5;
            btn.innerHTML = `<i class="fa-solid fa-volume-high"></i>`;
        }
        else {
            bgAudio.volume = 0;
            btn.innerHTML = `<i class="fa-solid fa-volume-xmark"></i>`;
        }
    });
}
function shuffleImages() {
    const arr = [0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
let firstImg = null;
let secondImg = null;
let lock = false;
const win = new Audio('./assets/audio/match.wav');
function imageFlip() {
    const images = document.querySelectorAll('img');
    const flip = new Audio('./assets/audio/flip.mp3');
    images.forEach((img, index) => {
        img.dataset.value = Game_Start[index].toString();
        img.addEventListener('click', () => {
            playAudio();
            if (lock)
                return;
            if (img === firstImg)
                return;
            if (img.classList.contains("matched"))
                return;
            flip.play();
            img.src = `./assets/images/${img.dataset.value}.jpg`;
            if (!firstImg) {
                firstImg = img;
            }
            else {
                secondImg = img;
                lock = true;
                setTimeout(checkMatch, 700);
            }
        });
    });
}
const progress = document.getElementById("progressBar");
let currentProgress = 0;
const step = 100 / 6;
function checkMatch() {
    const gameOver = new Audio('./assets/audio/game-over.mp3');
    if (!firstImg || !secondImg)
        return;
    if (firstImg.dataset.value === secondImg.dataset.value) {
        win.play();
        currentProgress += step;
        progress.style.width = currentProgress + "%";
        firstImg.classList.add("matched");
        secondImg.classList.add("matched");
        const images = document.querySelectorAll('img');
        const allMatched = Array.from(images).every(img => img.classList.contains("matched"));
        if (allMatched) {
            gameOver.play();
        }
    }
    else {
        firstImg.src = './assets/images/bcpic.jpg';
        secondImg.src = './assets/images/bcpic.jpg';
    }
    resetTurn();
}
function resetTurn() {
    firstImg = null;
    secondImg = null;
    lock = false;
}
