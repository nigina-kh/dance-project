document.addEventListener('DOMContentLoaded', () => {
  const heroVideo = document.querySelector('.hero__video');

  if (!heroVideo) {
    return;
  }

  const API_URL = 'http://localhost:3000/videos';

  fetch(API_URL)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load video data');
      }
      return response.json();
    })
    .then(videos => {
      if (!Array.isArray(videos) || videos.length === 0) {
        throw new Error('Video list is empty');
      }

      const videoSrc = 'assets/video/dance.mp4';

      heroVideo.src = videoSrc;
      heroVideo.muted = true;
      heroVideo.autoplay = true;
      heroVideo.loop = true;
      heroVideo.playsInline = true;

      const playPromise = heroVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // eslint-disable-nex-line no-unused-vars
          console.warn('Autoplay was blocked by the browser:', error);
        });
      }
    })
    .catch(error => {
      heroVideo.style.display = 'none';

      const heroSection = heroVideo.closest('.hero');
      if (heroSection) {
        heroSection.classList.add('slider--no-video');
      }
    });
});

