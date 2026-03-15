const playlist = [
    { title: "16 Mirrors", artist: "Alex G", src: "assets/musics/16mirrors.mp3", cover: "assets/images/16mirrors.jpg" },
    { title: "Nuts", artist: "Lil Peep", src: "assets/musics/nuts.mp3", cover: "assets/images/nuts.jpg" },
    { title: "August 10", artist: "Khruangbin", src: "assets/musics/august10.mp3", cover: "assets/images/august10.jpg" }
];

let currentTrack = 0;
const audio = document.getElementById('bg-audio');
const playToggle = document.getElementById('play-toggle');

function loadTrack(index) {
    const track = playlist[index];
    audio.src = track.src;
    document.getElementById('track-title').innerText = track.title;
    document.getElementById('artist-name').innerText = track.artist;
    document.getElementById('album-art').style.backgroundImage = `url('${track.cover}')`;
}

function startExperience() {
    loadTrack(currentTrack);
    audio.volume = 0.4;
    audio.play();
    
    document.getElementById('overlay').style.opacity = '0';
    setTimeout(() => { document.getElementById('overlay').style.display = 'none'; }, 800);
    
    const content = document.getElementById('main-content');
    content.classList.remove('blurred');
    content.classList.add('not-blurred');
    
    playToggle.checked = true;
    updateBars(true);
}

function togglePlay() {
    setTimeout(() => {
        if (playToggle.checked) { audio.play(); updateBars(true); }
        else { audio.pause(); updateBars(false); }
    }, 50);
}

function updateBars(running) {
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
    if (!isNaN(duration)) {
        audio.currentTime = (clickX / width) * duration;
    }
});

function formatTime(s) {
    const m = Math.floor(s/60);
    const sec = Math.floor(s%60);
    return `${m}:${sec<10?'0'+sec:sec}`;
}

function nextTrack() {
    currentTrack = (currentTrack + 1) % playlist.length;
    loadTrack(currentTrack);
    audio.play();
    playToggle.checked = true;
    updateBars(true);
}

function prevTrack() {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrack);
    audio.play();
    playToggle.checked = true;
    updateBars(true);
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
loadTrack(currentTrack);
getDiscordStatus();
setInterval(getDiscordStatus, 30000);
