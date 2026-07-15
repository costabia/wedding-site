const hero = document.querySelector('.hero-gallery');
const scene = document.querySelector('.hero-gallery__sticky');

if (hero && scene) {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let ticking = false;

  const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);
  const mix = (from, to, progress) => from + (to - from) * progress;
  const easeOutCubic = (value) => 1 - Math.pow(1 - value, 3);
  const easeInOutCubic = (value) =>
    value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;

  function render() {
    const rect = hero.getBoundingClientRect();
    const scrollableDistance = hero.offsetHeight - window.innerHeight;
    const rawProgress = scrollableDistance > 0 ? clamp(-rect.top / scrollableDistance) : 0;

    const shrinkProgress = easeInOutCubic(clamp(rawProgress / 0.68));
    const revealProgress = easeOutCubic(clamp((rawProgress - 0.16) / 0.7));
    const introProgress = easeOutCubic(clamp(rawProgress / 0.28));
    const heroLogoProgress = easeOutCubic(clamp((rawProgress - 0.22) / 0.2));
    const isMobile = window.innerWidth <= 760;

    const tileGap = isMobile ? 6 : 12;
    const targetWidth = isMobile
      ? (window.innerWidth - tileGap - 18) / 2
      : Math.min(window.innerWidth * 0.26, 360);
    const targetHeight = isMobile
      ? (window.innerHeight - tileGap * 3 - 32) / 4
      : Math.min(targetWidth * 0.62, window.innerHeight * 0.24);
    const tileRadius = isMobile ? 16 : 22;
    const mobileColumnOffset = targetWidth + tileGap;
    const mobileRowOffset = targetHeight + tileGap;

    root.style.setProperty('--progress', rawProgress.toFixed(4));
    root.style.setProperty('--main-width', `${mix(window.innerWidth, targetWidth, shrinkProgress)}px`);
    root.style.setProperty('--main-height', `${mix(window.innerHeight, targetHeight, shrinkProgress)}px`);
    root.style.setProperty('--main-radius', `${mix(0, tileRadius, shrinkProgress)}px`);
    root.style.setProperty('--main-x', `${isMobile ? mix(0, -mobileColumnOffset / 2, shrinkProgress) : 0}px`);
    root.style.setProperty('--main-y', `${isMobile ? mix(0, -mobileRowOffset * 1.5, shrinkProgress) : 0}px`);
    root.style.setProperty('--tile-width', `${targetWidth}px`);
    root.style.setProperty('--tile-height', `${targetHeight}px`);
    root.style.setProperty('--column-offset', `${targetWidth + tileGap}px`);
    root.style.setProperty('--row-offset', `${targetHeight + tileGap}px`);
    root.style.setProperty('--column-half-offset', `${(targetWidth + tileGap) / 2}px`);
    root.style.setProperty('--row-half-offset', `${(targetHeight + tileGap) / 2}px`);
    root.style.setProperty('--row-one-half-offset', `${(targetHeight + tileGap) * 1.5}px`);
    root.style.setProperty('--tile-radius', `${tileRadius}px`);
    root.style.setProperty('--intro-opacity', (1 - introProgress).toFixed(4));
    root.style.setProperty('--intro-shift', `${mix(0, -28, introProgress)}px`);
    root.style.setProperty('--hero-logo-opacity', heroLogoProgress.toFixed(4));
    root.style.setProperty('--memory-opacity', revealProgress.toFixed(4));
    root.style.setProperty('--memory-scale', mix(0.84, 1, revealProgress).toFixed(4));
    root.style.setProperty('--memory-blur', `${mix(8, 0, revealProgress)}px`);
    root.style.setProperty('--left-shift', `${mix(isMobile ? -18 : -12, 0, revealProgress)}vw`);
    root.style.setProperty('--right-shift', `${mix(isMobile ? 18 : 12, 0, revealProgress)}vw`);
    root.style.setProperty('--top-shift', `${mix(isMobile ? -10 : -12, 0, revealProgress)}vh`);
    root.style.setProperty('--bottom-shift', `${mix(isMobile ? 10 : 12, 0, revealProgress)}vh`);

    ticking = false;
  }

  function requestRender() {
    if (!ticking) {
      window.requestAnimationFrame(render);
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestRender, { passive: true });
  window.addEventListener('resize', requestRender, { passive: true });
  reduceMotion.addEventListener('change', requestRender);
  requestRender();
}

const revealCopies = [...document.querySelectorAll('.reveal-copy')];

if (revealCopies.length) {
  revealCopies.forEach((revealCopy) => {
    const sentence = revealCopy.textContent.trim().replace(/\s+/g, ' ');
    const fragment = document.createDocumentFragment();

    revealCopy.textContent = '';
    revealCopy.setAttribute('aria-label', sentence);

    sentence.split(' ').forEach((word, index, words) => {
      const span = document.createElement('span');
      span.className = 'reveal-word';
      span.setAttribute('aria-hidden', 'true');
      span.style.setProperty('--word-delay', `${index * 75}ms`);
      span.textContent = word;
      fragment.appendChild(span);

      if (index < words.length - 1) {
        fragment.appendChild(document.createTextNode(' '));
      }
    });

    revealCopy.appendChild(fragment);
  });

  if ('IntersectionObserver' in window) {
    const copyObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 },
    );

    revealCopies.forEach((revealCopy) => copyObserver.observe(revealCopy));
  } else {
    revealCopies.forEach((revealCopy) => revealCopy.classList.add('is-visible'));
  }
}

const accordion = document.querySelector('[data-accordion]');

if (accordion) {
  const items = [...accordion.querySelectorAll('details')];

  items.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;

      items.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.removeAttribute('open');
        }
      });
    });
  });
}

const storyStack = document.querySelector('.story-stack');
const storyHeading = document.querySelector('.story-stack__heading');
const polaroids = [...document.querySelectorAll('.polaroid')];

if (storyStack && polaroids.length) {
  let storyTicking = false;
  const clampStory = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);
  const mixStory = (from, to, progress) => from + (to - from) * progress;
  const easeStory = (value) => 1 - Math.pow(1 - value, 3);

  function renderStoryStack() {
    const rect = storyStack.getBoundingClientRect();
    const scrollableDistance = storyStack.offsetHeight - window.innerHeight;
    const progress = scrollableDistance > 0
      ? clampStory(-rect.top / scrollableDistance)
      : 1;

    if (storyHeading) {
      const headingProgress = easeStory(clampStory(progress / 0.12));

      storyHeading.style.setProperty('--story-heading-opacity', headingProgress.toFixed(4));
      storyHeading.style.setProperty('--story-heading-blur', `${mixStory(10, 0, headingProgress)}px`);
      storyHeading.style.setProperty('--story-heading-y', `${mixStory(36, 0, headingProgress)}px`);
    }

    polaroids.forEach((card, index) => {
      const start = 0.04 + index * 0.24;
      const cardProgress = easeStory(clampStory((progress - start) / 0.16));

      card.style.setProperty('--card-opacity', cardProgress.toFixed(4));
      card.style.setProperty('--card-scale', mixStory(0.88, 1, cardProgress).toFixed(4));
      card.style.setProperty('--card-y', `${mixStory(80, 0, cardProgress)}px`);
    });

    storyTicking = false;
  }

  function requestStoryRender() {
    if (!storyTicking) {
      window.requestAnimationFrame(renderStoryStack);
      storyTicking = true;
    }
  }

  window.addEventListener('scroll', requestStoryRender, { passive: true });
  window.addEventListener('resize', requestStoryRender, { passive: true });
  requestStoryRender();
}

const countdownSection = document.querySelector('.countdown-section');
const countdownValues = {
  days: document.querySelector('[data-countdown="days"]'),
  hours: document.querySelector('[data-countdown="hours"]'),
  minutes: document.querySelector('[data-countdown="minutes"]'),
  seconds: document.querySelector('[data-countdown="seconds"]'),
};

if (countdownSection && Object.values(countdownValues).every(Boolean)) {
  const weddingTime = new Date('2026-09-12T00:00:00-03:00').getTime();
  const reduceCountdownMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const second = 1000;
  const minute = 60 * second;
  const hour = 60 * minute;
  const day = 24 * hour;

  function setCountdownValue(element, value) {
    const nextValue = String(value).padStart(2, '0');

    if (element.textContent === nextValue) return;

    element.textContent = nextValue;

    if (!reduceCountdownMotion.matches && typeof element.animate === 'function') {
      element.animate(
        [
          { opacity: 0.25, transform: 'translateY(0.22em)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: 420, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      );
    }
  }

  function updateCountdown() {
    const remaining = Math.max(0, weddingTime - Date.now());

    setCountdownValue(countdownValues.days, Math.floor(remaining / day));
    setCountdownValue(countdownValues.hours, Math.floor((remaining % day) / hour));
    setCountdownValue(countdownValues.minutes, Math.floor((remaining % hour) / minute));
    setCountdownValue(countdownValues.seconds, Math.floor((remaining % minute) / second));
  }

  countdownSection.classList.add('is-ready');

  if ('IntersectionObserver' in window) {
    const countdownObserver = new IntersectionObserver(
      ([entry], observer) => {
        if (entry.isIntersecting) {
          countdownSection.classList.add('is-visible');
          observer.unobserve(countdownSection);
        }
      },
      { threshold: 0.35 },
    );

    countdownObserver.observe(countdownSection);
  } else {
    countdownSection.classList.add('is-visible');
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);
}
