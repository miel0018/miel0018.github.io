var firebaseConfig = {
    apiKey: "AIzaSyBP6_x00NmTX9yRNA2LpTdk0cPJQfIgbgs",
    authDomain: "miel-website-50a32.firebaseapp.com",
    databaseURL: "https://miel-website-50a32-default-rtdb.firebaseio.com",
    projectId: "miel-website-50a32",
    storageBucket: "miel-website-50a32.firebasestorage.app",
    messagingSenderId: "386877582726",
    appId: "1:386877582726:web:c914fa9344d05a53aa5007"
};

firebase.initializeApp(firebaseConfig);
var db = firebase.database();
var viewRef = db.ref('contador');

if (!localStorage.getItem('miel_view_counted')) {
    viewRef.transaction(function(c) { return (c || 0) + 1; });
    localStorage.setItem('miel_view_counted', 'true');
}

viewRef.on('value', function(snap) {
    var el = document.getElementById('view-count');
    if (el) el.innerText = snap.val() || 0;
});

var gate = document.getElementById('gate');
var bgVideo = document.getElementById('bg-video');

if (bgVideo) {
    bgVideo.load();
    bgVideo.muted = true;
    bgVideo.play().catch(function() {});
}

if (gate) {
    gate.addEventListener('click', function() {
        gate.classList.add('closing');
        gate.addEventListener('animationend', function() {
            gate.style.display = 'none';
            observeReveal();
            if (bgVideo) {
                bgVideo.muted = false;
                bgVideo.play().catch(function() {});
            }
        }, { once: true });
    });
}

function observeReveal() {
    var els = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function(entries) {
            entries.forEach(function(en, i) {
                if (en.isIntersecting) {
                    setTimeout(function() { en.target.classList.add('visible'); }, i * 90);
                    io.unobserve(en.target);
                }
            });
        }, { threshold: 0.1 });
        els.forEach(function(el) { io.observe(el); });
    } else {
        els.forEach(function(el) { el.classList.add('visible'); });
    }
}

function fetchDiscordStatus() {
    fetch('https://api.lanyard.rest/v1/users/1239726174511300648')
        .then(function(r) { return r.json(); })
        .then(function(d) {
            if (d && d.data) {
                var dot = document.getElementById('dot');
                var map = { online: '#43b581', dnd: '#f04747', idle: '#faa61a', offline: '#747f8d' };
                var status = d.data.discord_status || 'offline';
                if (dot) dot.style.backgroundColor = map[status] || '#ccc';
            }
        })
        .catch(function() {});
}

function lastUpdated() {
    var el = document.getElementById('last-updated');
    if (!el) return;
    var d = new Date(document.lastModified);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    el.innerText = 'last updated ' + months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
}

function setupFriends() {
    var friends = document.querySelectorAll('.friend');
    friends.forEach(function(el) {
        var newEl = el.cloneNode(true);
        el.parentNode.replaceChild(newEl, el);
        var finalEl = newEl;
        var link = finalEl.getAttribute('href');
        var hasLink = link && link !== '';
        function handleInteraction(e) {
            e.stopPropagation();
            finalEl.classList.add('touched');
            setTimeout(function() { finalEl.classList.remove('touched'); }, 300);
            if (hasLink && e.type !== 'touchstart') {
                
            }
        }
        finalEl.addEventListener('click', handleInteraction);
        finalEl.addEventListener('touchstart', handleInteraction, { passive: false });
    });
}

fetchDiscordStatus();
setInterval(fetchDiscordStatus, 30000);
lastUpdated();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupFriends);
} else {
    setupFriends();
}
