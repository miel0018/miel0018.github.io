import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, runTransaction, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBP6_x00NmTX9yRNA2LpTdk0cPJQfIgbgs",
  authDomain: "miel-website-50a32.firebaseapp.com",
  databaseURL: "https://miel-website-50a32-default-rtdb.firebaseio.com",
  projectId: "miel-website-50a32",
  storageBucket: "miel-website-50a32.firebasestorage.app",
  messagingSenderId: "386877582726",
  appId: "1:386877582726:web:c914fa9344d05a53aa5007"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const viewRef = ref(db, 'contador');

// LocalStorage: Conta a view apenas uma vez
if (!localStorage.getItem('miel_view_counted')) {
    runTransaction(viewRef, (current) => (current || 0) + 1);
    localStorage.setItem('miel_view_counted', 'true');
}

onValue(viewRef, (snap) => {
    const el = document.getElementById('view-count-number');
    if (el) el.innerText = snap.val() || 0;
});

const playlist = [
    { title: "16 Mirrors", artist: "Alex G", src: "assets/musics/16mirrors.mp3", cover: "assets/images/16mirrors.jpg" },
    { title: "Nuts", artist: "Lil Peep", src: "assets/musics/nuts.mp3", cover: "assets/images/nuts.jpg" },
    { title: "August 10", artist: "Julie Doiron", src: "assets/musics/august10.mp3", cover: "assets/images/august10.jpg" }
];

let currentTrack = 0;
const audio = document.getElementById('bg-audio');
const playToggle = document.getElementById('play-toggle');

window.loadTrack = function(index) {
    const track = playlist[index];
    audio.src = track.src;
    document.getElementById('track-title').innerText = track.title;
    document.getElementById('artist-name').innerText = track.artist;
    document.getElementById('album-art').style.backgroundImage = `url('${track.cover}')`;
}

window.startExperience = function() {
    window.loadTrack(currentTrack);
    audio.volume = 0.4;
    audio.play();
    document.getElementById('overlay').style.opacity = '0';
    setTimeout(() => { document.getElementById('overlay').style.display = 'none'; }, 800);
    const content = document.getElementById('main-content');
    content.classList.remove('blurred');
    content.classList.add('not-blurred');
    playToggle.checked = true;
    window.updateBars(true);
}

window.togglePlay = function() {
    setTimeout(() => {
        if (playToggle.checked) { audio.play(); window.updateBars(true); }
        else { audio.pause(); window.updateBars(false); }
    }, 50);
}

window.updateBars = function(running) {
    const bars = document.querySelectorAll('.bar');
    bars.forEach(bar => bar.style.animationPlayState = running ? 'running' : 'paused');
}

audio.addEventListener('timeupdate', () => {
    if (isNaN(audio.duration)) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    document.getElementById('progress-fill').style.width = pct + '%';
    document.getElementById('progress-handle').style.left = pct + '%';
    document.getElementById('current-time').innerText = formatTime(audio.currentTime);
    document.getElementById('duration-time').innerText = formatTime(audio.duration);
});

document.getElementById('progress-container').addEventListener('click', (e) => {
    const width = e.currentTarget.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    if (!isNaN(duration)) audio.currentTime = (clickX / width) * duration;
});

function formatTime(s) {
    const m = Math.floor(s/60);
    const sec = Math.floor(s%60);
    return `${m}:${sec<10?'0'+sec:sec}`;
}

window.nextTrack = function() {
    currentTrack = (currentTrack + 1) % playlist.length;
    window.loadTrack(currentTrack);
    audio.play();
    playToggle.checked = true;
    window.updateBars(true);
}

window.prevTrack = function() {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    window.loadTrack(currentTrack);
    audio.play();
    playToggle.checked = true;
    window.updateBars(true);
}

async function getDiscordStatus() {
    const userId = "1239726174511300648"; 
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
        const data = await response.json();
        const status = data.data.discord_status;
        const dot = document.getElementById('discord-status');
        if (status === 'online') dot.style.backgroundColor = '#43b581';
        else if (status === 'dnd') dot.style.backgroundColor = '#f04747';
        else if (status === 'idle') dot.style.backgroundColor = '#faa61a';
        else dot.style.backgroundColor = '#747f8d';
    } catch (e) {}
}

function updateInfo() {
    const now = new Date();
    const bday = new Date(now.getFullYear(), 2, 20);
    if (now > bday) bday.setFullYear(now.getFullYear()+1);
    const diff = Math.ceil((bday - now)/(1000*60*60*24));
    document.getElementById('countdown').innerText = `(${diff} days left)`;
    const noon = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 15, 0, 0));
    document.getElementById('local-time').innerText = noon.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
}

updateInfo();
window.loadTrack(currentTrack);
getDiscordStatus();
setInterval(getDiscordStatus, 30000);
