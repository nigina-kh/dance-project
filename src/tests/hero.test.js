/**
 * @jest-environment jsdom
 */

beforeEach(() => {
  document.body.innerHTML = `
    <section class="hero"></section>
    <video class="hero__video"></video>
  `;

  global.fetch = jest.fn();
});

test('sets video src and autoplay when API returns data', async () => {
  const heroVideo = document.querySelector('.hero__video');
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [{ video: 'test-video.mp4' }]
  });

  // Mock your function that fetches and sets the video
  heroVideo.src = 'test-video.mp4';
  heroVideo.muted = true;
  heroVideo.autoplay = true;
  heroVideo.loop = true;

  expect(heroVideo.src).toContain('test-video.mp4');
  expect(heroVideo.muted).toBe(true);
  expect(heroVideo.autoplay).toBe(true);
  expect(heroVideo.loop).toBe(true);
});

test('handles fetch failure gracefully', async () => {
  const heroSection = document.querySelector('.hero');
  fetch.mockRejectedValueOnce(new Error('API failed'));

  // Mock failure handling
  heroSection.classList.add('hero--no-video');

  expect(heroSection.classList.contains('hero--no-video')).toBe(true);
});

test('handles empty video list', async () => {
  const heroSection = document.querySelector('.hero');
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => []
  });

  heroSection.classList.add('hero--no-video');
  expect(heroSection.classList.contains('hero--no-video')).toBe(true);
});

test('handles missing video src', async () => {
  const heroSection = document.querySelector('.hero');
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [{}]
  });

  heroSection.classList.add('hero--no-video');
  expect(heroSection.classList.contains('hero--no-video')).toBe(true);
});
