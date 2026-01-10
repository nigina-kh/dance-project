window.addEventListener('load', () => {
  document.body.classList.add('page-loaded');
});

const fadeElems = document.querySelectorAll('.fade-up');

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

fadeElems.forEach((el, index) => {
  el.style.transitionDelay = `${index * 0.15}s`;
  observer.observe(el);
});
