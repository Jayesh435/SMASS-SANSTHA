document.addEventListener('DOMContentLoaded', () => {
  const menuToggleButton = document.querySelector('.menu-toggle');
  const navLinksList = document.querySelector('.nav-links');

  if (menuToggleButton && navLinksList) {
    menuToggleButton.addEventListener('click', () => {
      const expanded = menuToggleButton.getAttribute('aria-expanded') === 'true';
      menuToggleButton.setAttribute('aria-expanded', String(!expanded));
      navLinksList.classList.toggle('show');
    });

    navLinksList.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinksList.classList.remove('show');
        menuToggleButton.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const carouselElement = document.querySelector('[data-carousel]');
  if (!carouselElement) {
    return;
  }

  const slides = Array.from(carouselElement.querySelectorAll('.slide'));
  const previousButton = carouselElement.querySelector('.prev');
  const nextButton = carouselElement.querySelector('.next');
  const dotsContainer = carouselElement.querySelector('.carousel-dots');
  let activeSlideIndex = 0;
  let autoSlideTimer;

  const updateCarouselView = (newIndex) => {
    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === newIndex);
    });

    if (dotsContainer) {
      Array.from(dotsContainer.children).forEach((dot, index) => {
        dot.classList.toggle('active', index === newIndex);
      });
    }

    activeSlideIndex = newIndex;
  };

  const goToNextSlide = () => {
    const newIndex = (activeSlideIndex + 1) % slides.length;
    updateCarouselView(newIndex);
  };

  const goToPreviousSlide = () => {
    const newIndex = (activeSlideIndex - 1 + slides.length) % slides.length;
    updateCarouselView(newIndex);
  };

  if (dotsContainer) {
    slides.forEach((_, index) => {
      const dotButton = document.createElement('button');
      dotButton.type = 'button';
      dotButton.setAttribute('aria-label', `Slide ${index + 1}`);
      if (index === 0) {
        dotButton.classList.add('active');
      }
      dotButton.addEventListener('click', () => updateCarouselView(index));
      dotsContainer.appendChild(dotButton);
    });
  }

  nextButton?.addEventListener('click', goToNextSlide);
  previousButton?.addEventListener('click', goToPreviousSlide);

  const startAutoSlide = () => {
    autoSlideTimer = setInterval(goToNextSlide, 4000);
  };

  const stopAutoSlide = () => {
    clearInterval(autoSlideTimer);
  };

  carouselElement.addEventListener('mouseenter', stopAutoSlide);
  carouselElement.addEventListener('mouseleave', startAutoSlide);

  startAutoSlide();
});