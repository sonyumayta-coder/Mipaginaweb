/**
 * ARRAY DE LAS 7 CANCIONES Y SUS ARCHIVOS LOCALES .MP3
 */
let songs = [
    {
        id: 1,
        title: "Stupid Love Story",
        artist: "Canserbero",
        album: "Apa y Can",
        duration: "4:42",
        cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400",
        src: "1-stupid-love-story.mp3",
        liked: true
    },
    {
        id: 2,
        title: "Y Yo No Sé",
        artist: "Paulo Londra",
        album: "Homerun",
        duration: "3:10",
        cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400",
        src: "2-y-yo-no-se.mp3",
        liked: false
    },
    {
        id: 3,
        title: "Ella No Es Tuya",
        artist: "Rochy RD, Myke Towers & Nicki Nicole",
        album: "Single Remix",
        duration: "3:28",
        cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400",
        src: "3-ella-no-es-tuya.mp3",
        liked: true
    },
    {
        id: 4,
        title: "Es Muy Tarde",
        artist: "Smoky",
        album: "Urbano Hits",
        duration: "3:45",
        cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=400",
        src: "4-es-muy-tarde.mp3",
        liked: false
    },
    {
        id: 5,
        title: "Hawái",
        artist: "Maluma",
        album: "Papi Juancho",
        duration: "3:19",
        cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400",
        src: "5-hawai.mp3",
        liked: true
    },
    {
        id: 6,
        title: "Kintsugi",
        artist: "Humbe",
        album: "Esencia",
        duration: "3:02",
        cover: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=400",
        src: "6-kintsugi.mp3",
        liked: false
    },
    {
        id: 7,
        title: "Fantasma",
        artist: "Humbe",
        album: "Esencia",
        duration: "3:14",
        cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400",
        src: "7-fantasma.mp3",
        liked: true
    }
];

// Estado Global
let currentIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

// DOM Elements
const mainAudio = document.getElementById('main-audio');
const songsGrid = document.getElementById('songs-grid');
const songsTable = document.getElementById('songs-table');
const searchInput = document.getElementById('search-input');

const playerThumb = document.getElementById('player-thumb');
const playerTitle = document.getElementById('player-title');
const playerArtist = document.getElementById('player-artist');
const playerLikeBtn = document.getElementById('player-like-btn');

const btnPlayPause = document.getElementById('btn-play-pause');
const heroPlayBtn = document.getElementById('btn-hero-play');
const heroPlayIcon = document.getElementById('hero-play-icon');
const stickyPlayIcon = document.getElementById('sticky-play-icon');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const btnShuffle = document.getElementById('btn-shuffle');
const btnRepeat = document.getElementById('btn-repeat');

const progressBar = document.getElementById('progress-bar');
const timeCurrent = document.getElementById('time-current');
const timeTotal = document.getElementById('time-total');
const volumeBar = document.getElementById('volume-bar');
const btnMute = document.getElementById('btn-mute');
const volumeIcon = document.getElementById('volume-icon');
const stickyEq = document.getElementById('sticky-eq');

// Modal Elements
const editModal = document.getElementById('edit-modal');
const btnEditSongs = document.getElementById('btn-edit-songs');
const closeModal = document.getElementById('close-modal');
const btnCancelModal = document.getElementById('btn-cancel-modal');
const btnSaveModal = document.getElementById('btn-save-modal');
const modalInputsContainer = document.getElementById('modal-inputs-container');

function renderSongs(filterQuery = "") {
    songsGrid.innerHTML = '';
    songsTable.innerHTML = '';

    const filtered = songs.filter(s => 
        s.title.toLowerCase().includes(filterQuery.toLowerCase()) || 
        s.artist.toLowerCase().includes(filterQuery.toLowerCase())
    );

    filtered.forEach((song) => {
        const originalIndex = songs.findIndex(s => s.id === song.id);
        const isActive = originalIndex === currentIndex;

        // 1. Grid Card View
        const card = document.createElement('div');
        card.className = `bg-urban-card hover:bg-urban-hover border border-urban-border p-3.5 rounded-xl transition duration-300 cursor-pointer group flex flex-col justify-between relative ${
            isActive ? 'ring-2 ring-urban-red bg-urban-hover' : ''
        }`;

        card.innerHTML = `
            <div class="relative w-full aspect-square mb-3 rounded-lg shadow-lg overflow-hidden bg-black/40">
                <img src="${song.cover}" alt="${song.title}" class="w-full h-full object-cover">
                <button class="absolute bottom-2 right-2 w-11 h-11 rounded-xl bg-urban-red text-white flex items-center justify-center shadow-2xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition duration-300 hover:scale-105 active:scale-95">
                    <i class="fa-solid ${isActive && isPlaying ? 'fa-pause' : 'fa-play'} text-base translate-x-0.5"></i>
                </button>
            </div>
            <div class="min-w-0">
                <h3 class="font-bold text-sm ${isActive ? 'text-urban-red' : 'text-white'} truncate">${song.title}</h3>
                <p class="text-xs text-urban-subtext truncate mt-1">${song.artist}</p>
            </div>
        `;

        card.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentIndex === originalIndex) {
                togglePlayPause();
            } else {
                loadAndPlaySong(originalIndex);
            }
        });

        songsGrid.appendChild(card);

        // 2. Table Row View
        const row = document.createElement('div');
        row.className = `grid grid-cols-12 text-sm text-urban-subtext py-2.5 px-4 rounded-xl hover:bg-urban-hover items-center cursor-pointer group border border-transparent hover:border-urban-border/50 ${
            isActive ? 'bg-urban-hover text-white border-urban-border' : ''
        }`;

        row.innerHTML = `
            <div class="col-span-1 flex items-center">
                <span class="${isActive ? 'text-urban-red font-bold' : 'group-hover:hidden'}">${originalIndex + 1}</span>
                <i class="fa-solid ${isActive && isPlaying ? 'fa-pause text-urban-red' : 'fa-play text-white'} hidden group-hover:inline text-xs"></i>
            </div>
            <div class="col-span-6 sm:col-span-5 flex items-center gap-3 min-w-0">
                <img src="${song.cover}" alt="${song.title}" class="w-10 h-10 rounded-lg object-cover flex-shrink-0">
                <div class="min-w-0">
                    <p class="font-bold ${isActive ? 'text-urban-red' : 'text-white'} truncate">${song.title}</p>
                    <p class="text-xs text-urban-subtext truncate sm:hidden">${song.artist}</p>
                </div>
            </div>
            <div class="col-span-4 hidden sm:block truncate text-xs text-urban-subtext">${song.album}</div>
            <div class="col-span-5 sm:col-span-2 text-right text-xs font-mono">${song.duration}</div>
        `;

        row.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentIndex === originalIndex) {
                togglePlayPause();
            } else {
                loadAndPlaySong(originalIndex);
            }
        });

        songsTable.appendChild(row);
    });
}

function loadAndPlaySong(index) {
    currentIndex = index;
    const song = songs[currentIndex];

    mainAudio.src = song.src;
    playerThumb.src = song.cover;
    playerTitle.textContent = song.title;
    playerArtist.textContent = song.artist;
    
    updateLikeStatus();
    playAudio();
    renderSongs(searchInput.value);
}

function playAudio() {
    mainAudio.play().then(() => {
        isPlaying = true;
        updatePlayStateUI();
    }).catch(err => {
        console.log("Play handle:", err);
    });
}

function pauseAudio() {
    mainAudio.pause();
    isPlaying = false;
    updatePlayStateUI();
}

function togglePlayPause() {
    if (!mainAudio.src || mainAudio.src === "" || mainAudio.src === window.location.href) {
        loadAndPlaySong(0);
        return;
    }

    if (isPlaying) {
        pauseAudio();
    } else {
        playAudio();
    }
}

function updatePlayStateUI() {
    if (isPlaying) {
        stickyPlayIcon.className = "fa-solid fa-pause text-sm";
        heroPlayIcon.className = "fa-solid fa-pause text-xl";
        stickyEq.classList.remove('opacity-0', 'paused');
    } else {
        stickyPlayIcon.className = "fa-solid fa-play text-sm translate-x-0.5";
        heroPlayIcon.className = "fa-solid fa-play text-xl translate-x-0.5";
        stickyEq.classList.add('paused');
    }
    renderSongs(searchInput.value);
}

function updateLikeStatus() {
    const isLiked = songs[currentIndex]?.liked;
    if (isLiked) {
        playerLikeBtn.innerHTML = '<i class="fa-solid fa-heart text-urban-red text-base"></i>';
    } else {
        playerLikeBtn.innerHTML = '<i class="fa-regular fa-heart text-base"></i>';
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

// EVENTS
mainAudio.addEventListener('timeupdate', () => {
    if (mainAudio.duration) {
        const progress = (mainAudio.currentTime / mainAudio.duration) * 100;
        progressBar.value = progress;
        timeCurrent.textContent = formatTime(mainAudio.currentTime);
        timeTotal.textContent = formatTime(mainAudio.duration);
    }
});

progressBar.addEventListener('input', (e) => {
    if (mainAudio.duration) {
        const seekTime = (e.target.value / 100) * mainAudio.duration;
        mainAudio.currentTime = seekTime;
    }
});

mainAudio.addEventListener('ended', () => {
    if (isRepeat) {
        playAudio();
    } else {
        playNextSong();
    }
});

function playNextSong() {
    if (isShuffle) {
        let randomIndex = Math.floor(Math.random() * songs.length);
        loadAndPlaySong(randomIndex);
    } else {
        const nextIndex = (currentIndex + 1) % songs.length;
        loadAndPlaySong(nextIndex);
    }
}

function playPrevSong() {
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    loadAndPlaySong(prevIndex);
}

btnPlayPause.addEventListener('click', togglePlayPause);
heroPlayBtn.addEventListener('click', togglePlayPause);
btnNext.addEventListener('click', playNextSong);
btnPrev.addEventListener('click', playPrevSong);

btnShuffle.addEventListener('click', () => {
    isShuffle = !isShuffle;
    btnShuffle.classList.toggle('text-urban-red', isShuffle);
    btnShuffle.classList.toggle('text-urban-subtext', !isShuffle);
});

btnRepeat.addEventListener('click', () => {
    isRepeat = !isRepeat;
    btnRepeat.classList.toggle('text-urban-red', isRepeat);
    btnRepeat.classList.toggle('text-urban-subtext', !isRepeat);
});

volumeBar.addEventListener('input', (e) => {
    const val = e.target.value / 100;
    mainAudio.volume = val;
    if (val === 0) {
        volumeIcon.className = "fa-solid fa-volume-xmark text-urban-subtext";
    } else {
        volumeIcon.className = "fa-solid fa-volume-high text-urban-subtext";
    }
});

btnMute.addEventListener('click', () => {
    if (mainAudio.volume > 0) {
        mainAudio.volume = 0;
        volumeBar.value = 0;
        volumeIcon.className = "fa-solid fa-volume-xmark text-urban-subtext";
    } else {
        mainAudio.volume = 0.8;
        volumeBar.value = 80;
        volumeIcon.className = "fa-solid fa-volume-high text-urban-subtext";
    }
});

searchInput.addEventListener('input', (e) => {
    renderSongs(e.target.value);
});

// MODAL CONFIG
btnEditSongs.addEventListener('click', () => {
    modalInputsContainer.innerHTML = '';
    songs.forEach((song, idx) => {
        const row = document.createElement('div');
        row.className = "flex flex-col gap-1 bg-black/40 p-3 rounded-xl border border-urban-border";
        row.innerHTML = `
            <label class="text-xs font-bold text-urban-red">${idx + 1}. ${song.title} (${song.artist})</label>
            <input type="text" data-idx="${idx}" value="${song.src}" class="modal-src-input bg-urban-dark text-xs text-white p-2.5 rounded-lg border border-urban-border focus:outline-none focus:border-urban-red">
        `;
        modalInputsContainer.appendChild(row);
    });
    editModal.classList.remove('hidden');
});

closeModal.addEventListener('click', () => editModal.classList.add('hidden'));
btnCancelModal.addEventListener('click', () => editModal.classList.add('hidden'));

btnSaveModal.addEventListener('click', () => {
    const inputs = document.querySelectorAll('.modal-src-input');
    inputs.forEach(input => {
        const idx = parseInt(input.getAttribute('data-idx'));
        songs[idx].src = input.value;
    });
    editModal.classList.add('hidden');
    loadAndPlaySong(currentIndex);
});

// INIT
window.addEventListener('DOMContentLoaded', () => {
    const first = songs[0];
    mainAudio.src = first.src;
    mainAudio.volume = 0.8;

    playerThumb.src = first.cover;
    playerTitle.textContent = first.title;
    playerArtist.textContent = first.artist;
    timeTotal.textContent = first.duration;

    updateLikeStatus();
    renderSongs();
});