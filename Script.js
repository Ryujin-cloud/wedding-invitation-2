// script.js - All interactive features (Modern, Elegant, Complete)

document.addEventListener('DOMContentLoaded', () => {
  // ----------------------------- DOM Elements -----------------------------
  const cover = document.getElementById('cover');
  const mainContent = document.getElementById('mainContent');
  const openBtn = document.getElementById('openInvitationBtn');
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const personalGreetingDiv = document.getElementById('personalGreeting');

  // RSVP
  const rsvpForm = document.getElementById('rsvpForm');
  const rsvpName = document.getElementById('rsvpName');
  const rsvpAttendance = document.getElementById('rsvpAttendance');
  const rsvpGuests = document.getElementById('rsvpGuests');
  const rsvpMessageDiv = document.getElementById('rsvpMessage');

  // Wishes
  const wishForm = document.getElementById('wishForm');
  const wishName = document.getElementById('wishName');
  const wishMessage = document.getElementById('wishMessage');
  const wishesList = document.getElementById('wishesList');

  // Countdown target: 25 December 2025, 09:00:00
  const weddingDate = new Date('December 25, 2025 09:00:00').getTime();

  // ----------------------------- 1. OPEN INVITATION -----------------------------
  openBtn.addEventListener('click', () => {
    // Fade out cover
    cover.style.opacity = '0';
    setTimeout(() => {
      cover.style.display = 'none';
      mainContent.classList.remove('hidden');
      // trigger fade in main
      setTimeout(() => {
        mainContent.classList.add('visible');
      }, 50);
    }, 1000);
    // Play music after user interaction
    bgMusic.play().catch(e => console.log('Autoplay prevented?', e));
    // update music toggle text/icon
    updateMusicUI(true);
  });

  // ----------------------------- 2. MUSIC TOGGLE (PLAY/PAUSE) -----------------------------
  let isPlaying = false;
  function updateMusicUI(playing) {
    isPlaying = playing;
    const iconSpan = musicToggle.querySelector('.music-icon');
    const textSpan = musicToggle.querySelector('.music-text');
    if (isPlaying) {
      iconSpan.innerHTML = '🎵';
      textSpan.innerHTML = 'Pause';
    } else {
      iconSpan.innerHTML = '⏸️';
      textSpan.innerHTML = 'Play';
    }
  }
  musicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play();
      updateMusicUI(true);
    } else {
      bgMusic.pause();
      updateMusicUI(false);
    }
  });
  bgMusic.addEventListener('play', () => updateMusicUI(true));
  bgMusic.addEventListener('pause', () => updateMusicUI(false));

  // ----------------------------- 3. PERSONALISASI NAMA TAMU (URL parameter) -----------------------------
  const urlParams = new URLSearchParams(window.location.search);
  let guestName = urlParams.get('to');
  if (guestName) {
    guestName = decodeURIComponent(guestName);
    personalGreetingDiv.innerHTML = `Kepada Yth. ${guestName}, kami mengharap kehadiran Anda di acara pernikahan kami.`;
  } else {
    personalGreetingDiv.innerHTML = `Kepada Yth. Keluarga & Sahabat, kami mengharap kehadiran Anda.`;
  }

  // ----------------------------- 4. COUNTDOWN TIMER (Realtime) -----------------------------
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;
    if (distance < 0) {
      document.getElementById('days').innerText = '00';
      document.getElementById('hours').innerText = '00';
      document.getElementById('minutes').innerText = '00';
      document.getElementById('seconds').innerText = '00';
      return;
    }
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    document.getElementById('days').innerText = days < 10 ? '0' + days : days;
    document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
    document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ----------------------------- 5. RSVP with localStorage -----------------------------
  let rsvpData = JSON.parse(localStorage.getItem('wedding_rsvp')) || [];
  function saveRsvpToLocal() {
    localStorage.setItem('wedding_rsvp', JSON.stringify(rsvpData));
  }
  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = rsvpName.value.trim();
    const attendance = rsvpAttendance.value;
    let guests = rsvpGuests.value;
    if (!name || !attendance) {
      rsvpMessageDiv.innerText = 'Harap isi nama dan kehadiran.';
      return;
    }
    if (attendance === 'Hadir' && (!guests || guests < 1)) guests = 1;
    const newRsvp = { name, attendance, guests: attendance === 'Hadir' ? guests : 0, date: new Date().toISOString() };
    rsvpData.push(newRsvp);
    saveRsvpToLocal();
    rsvpForm.reset();
    rsvpMessageDiv.innerText = `Terima kasih ${name}, konfirmasi Anda telah tersimpan.`;
    setTimeout(() => { rsvpMessageDiv.innerText = ''; }, 3000);
  });

  // ----------------------------- 6. UCAPAN & DOA with localStorage -----------------------------
  let wishesData = JSON.parse(localStorage.getItem('wedding_wishes')) || [];
  function renderWishes() {
    if (!wishesList) return;
    wishesList.innerHTML = '';
    if (wishesData.length === 0) {
      wishesList.innerHTML = '<p style="text-align:center; color:#aaa;">Belum ada ucapan. Jadilah yang pertama memberi doa!</p>';
      return;
    }
    wishesData.slice().reverse().forEach(wish => {
      const wishDiv = document.createElement('div');
      wishDiv.classList.add('wish-item');
      wishDiv.innerHTML = `<div class="wish-name">${escapeHtml(wish.name)}</div><div class="wish-message">${escapeHtml(wish.message)}</div>`;
      wishesList.appendChild(wishDiv);
    });
  }
  function saveWishesToLocal() {
    localStorage.setItem('wedding_wishes', JSON.stringify(wishesData));
    renderWishes();
  }
  wishForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = wishName.value.trim();
    const message = wishMessage.value.trim();
    if (!name || !message) {
      alert('Nama dan pesan tidak boleh kosong.');
      return;
    }
    wishesData.push({ name, message, date: new Date().toISOString() });
    saveWishesToLocal();
    wishForm.reset();
    alert('Ucapan terkirim! Terima kasih atas doa baiknya.');
  });
  renderWishes();

  // ----------------------------- 7. TIMELINE SCROLL ANIMATION (Intersection Observer) -----------------------------
  const timelineItems = document.querySelectorAll('.timeline-content');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  timelineItems.forEach(item => observer.observe(item));

  // Add smooth scroll to top
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ----------------------------- 8. WHATSAPP FLOATING (already dynamic link) but add personalization? -----------------------------
  const whatsappBtn = document.getElementById('whatsappBtn');
  if (whatsappBtn && guestName) {
    const existingHref = whatsappBtn.getAttribute('href');
    const customMsg = `Assalamualaikum, saya ${guestName} menerima undangan pernikahan Ahmad & Aisyah.`;
    whatsappBtn.setAttribute('href', `https://wa.me/6281234567890?text=${encodeURIComponent(customMsg)}`);
  }

  // ----------------------------- 9. HERO & OTHER FADE-IN UTILITY (additional animation on load) -----------------------------
  const heroImg = document.querySelector('.hero-image');
  const heroTextEl = document.querySelector('.hero-text');
  if (heroImg) heroImg.style.animation = 'fadeInUp 0.8s ease';
  if (heroTextEl) heroTextEl.style.animation = 'fadeInUp 0.9s ease';

  // ----------------------------- 10. Helper: Escape HTML (security) -----------------------------
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      return m;
    }).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function(c) {
      return c;
    });
  }
});
