// BITS2QBITS — door interaction: click → fullscreen muted autoplay → navigate on 'ended'
(function () {
  var overlay = document.getElementById('video-overlay');
  var video = document.getElementById('overlay-video');
  var btnAudio = document.getElementById('btn-audio');
  var btnSkip = document.getElementById('btn-skip');
  var target = null;

  function openDoor(panel) {
    target = panel.getAttribute('data-target');
    video.src = panel.getAttribute('data-video');
    video.muted = true;
    btnAudio.textContent = 'Unmute';
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    var p = video.play();
    if (p && p.catch) {
      p.catch(function () { /* autoplay blocked — user can press play via native controls */ video.controls = true; });
    }
    btnSkip.focus();
  }

  function closeOverlay() {
    video.pause();
    video.removeAttribute('src');
    video.load();
    overlay.hidden = true;
    document.body.style.overflow = '';
    target = null;
  }

  document.getElementById('door-business').addEventListener('click', function () { openDoor(this); });
  document.getElementById('door-private').addEventListener('click', function () { openDoor(this); });

  video.addEventListener('ended', function () {
    if (target) { window.location.href = target; }
  });

  btnSkip.addEventListener('click', closeOverlay);

  btnAudio.addEventListener('click', function () {
    video.muted = !video.muted;
    btnAudio.textContent = video.muted ? 'Unmute' : 'Mute';
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !overlay.hidden) { closeOverlay(); }
  });
})();
