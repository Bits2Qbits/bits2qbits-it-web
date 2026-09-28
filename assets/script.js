// BITS2QBITS — door interaction
// click → crossfade into fullscreen video (sound ON) → navigate on 'ended'
(function () {
  var overlay = document.getElementById('video-overlay');
  var video = document.getElementById('overlay-video');
  var btnAudio = document.getElementById('btn-audio');
  var btnSkip = document.getElementById('btn-skip');
  var target = null;

  function setMuteUI(muted) {
    document.body.classList.toggle('is-muted', muted);
    btnAudio.setAttribute('aria-label', muted ? 'Unmute' : 'Mute');
    btnAudio.title = muted ? 'Unmute' : 'Mute';
  }

  function openDoor(panel) {
    target = panel.getAttribute('data-target');
    video.src = panel.getAttribute('data-video');
    video.muted = false;               // sound ON by default (the click is a user gesture)
    setMuteUI(false);
    overlay.hidden = false;
    // crossfade: start hidden, then fade to full opacity on next frame
    requestAnimationFrame(function () {
      overlay.classList.add('visible');
    });
    document.body.style.overflow = 'hidden';
    var p = video.play();
    if (p && p.catch) {
      p.catch(function () {
        // if sound-autoplay was blocked, fall back to muted so the video still plays
        video.muted = true;
        setMuteUI(true);
        video.play();
      });
    }
    btnSkip.focus();
  }

  function closeOverlay() {
    target = null;
    video.pause();
    overlay.classList.remove('visible');
    // wait for the fade-out before actually hiding
    setTimeout(function () {
      video.removeAttribute('src');
      video.load();
      overlay.hidden = true;
      document.body.style.overflow = '';
    }, 450);
  }

  document.getElementById('door-business').addEventListener('click', function () { openDoor(this); });
  document.getElementById('door-private').addEventListener('click', function () { openDoor(this); });

  video.addEventListener('ended', function () {
    if (target) { window.location.href = target; }
  });

  btnSkip.addEventListener('click', closeOverlay);

  btnAudio.addEventListener('click', function () {
    video.muted = !video.muted;
    setMuteUI(video.muted);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !overlay.hidden) { closeOverlay(); }
  });

  // Touch devices (no hover): light the door up when it scrolls into view
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
    var doors = [document.getElementById('door-business'), document.getElementById('door-private')];
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { entry.target.classList.add('lit'); }
          else { entry.target.classList.remove('lit'); }
        });
      }, { threshold: 0.35 });
      doors.forEach(function (d) { io.observe(d); });
    }
  }
})();