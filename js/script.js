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
  if (carouselElement) {
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
  }

  const galleryLinks = Array.from(document.querySelectorAll('.gallery-grid .gallery-item[href]'));
  if (galleryLinks.length > 0) {
    galleryLinks.forEach((link, index) => {
      const imageElement = link.querySelector('img');
      if (!imageElement) {
        return;
      }

      imageElement.setAttribute('loading', 'lazy');
      imageElement.setAttribute('decoding', 'async');

      if (!imageElement.getAttribute('alt') || imageElement.getAttribute('alt')?.startsWith('Image')) {
        imageElement.setAttribute('alt', `गॅलरी फोटो ${index + 1}`);
      }
    });

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-viewer';
    lightbox.setAttribute('aria-hidden', 'true');

    lightbox.innerHTML = `
      <div class="lightbox-content" role="dialog" aria-modal="true" aria-label="Image Viewer">
        <div class="lightbox-counter" aria-live="polite">1 / ${galleryLinks.length}</div>
        <button type="button" class="lightbox-nav lightbox-prev" aria-label="Previous Image">❮</button>
        <button type="button" class="lightbox-nav lightbox-next" aria-label="Next Image">❯</button>
        <button type="button" class="lightbox-close" aria-label="Close">×</button>
        <img class="lightbox-image" src="" alt="Preview Image">
      </div>
    `;

    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const closeButton = lightbox.querySelector('.lightbox-close');
    const previousImageButton = lightbox.querySelector('.lightbox-prev');
    const nextImageButton = lightbox.querySelector('.lightbox-next');
    const counterElement = lightbox.querySelector('.lightbox-counter');
    let activeImageIndex = 0;

    const showImageAtIndex = (index) => {
      const safeIndex = (index + galleryLinks.length) % galleryLinks.length;
      const currentLink = galleryLinks[safeIndex];
      const imageElement = currentLink.querySelector('img');
      const imageSource = currentLink.getAttribute('href') || '';
      const imageAlt = imageElement?.getAttribute('alt') || 'Image Preview';
      lightboxImage.setAttribute('src', imageSource);
      lightboxImage.setAttribute('alt', imageAlt);
      activeImageIndex = safeIndex;

      if (counterElement) {
        counterElement.textContent = `${safeIndex + 1} / ${galleryLinks.length}`;
      }
    };

    const closeLightbox = () => {
      lightbox.classList.remove('show');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');
      lightboxImage.setAttribute('src', '');
    };

    const openLightbox = (index) => {
      showImageAtIndex(index);
      lightbox.classList.add('show');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');
    };

    galleryLinks.forEach((link) => {
      link.removeAttribute('target');
      link.removeAttribute('rel');

      link.addEventListener('click', (event) => {
        event.preventDefault();
        const clickedIndex = galleryLinks.indexOf(link);
        openLightbox(clickedIndex);
      });
    });

    previousImageButton?.addEventListener('click', () => {
      showImageAtIndex(activeImageIndex - 1);
    });

    nextImageButton?.addEventListener('click', () => {
      showImageAtIndex(activeImageIndex + 1);
    });

    closeButton?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (!lightbox.classList.contains('show')) {
        return;
      }

      if (event.key === 'Escape') {
        closeLightbox();
      }

      if (event.key === 'ArrowLeft') {
        showImageAtIndex(activeImageIndex - 1);
      }

      if (event.key === 'ArrowRight') {
        showImageAtIndex(activeImageIndex + 1);
      }
    });
  }
});