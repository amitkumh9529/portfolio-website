/**
 * Amit Halder | Senior Data Engineer Portfolio
 * Integrated Smooth Scroll-Driven Background Frame Animation & Portfolio Interactions
 */

(() => {
  // Configuration
  const TOTAL_FRAMES = 300;
  const FOLDER_PATH = 'ezgif-8a5442510b989641-jpg';
  const FRAME_PREFIX = 'frame_';
  const FRAME_EXT = '.jpg';
  const PADDING_DIGITS = 4; // Files are formatted as frame_0001.jpg to frame_0300.jpg
  const LERP_FACTOR = 0.08; // Physics lerp easing factor for smooth inertia

  // DOM Elements
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const loader = document.getElementById('loader');
  const loaderBar = document.getElementById('loader-bar');
  const loaderProgress = document.getElementById('loader-progress');
  const navbar = document.getElementById('navbar');
  const scrollCue = document.querySelector('.scroll-cue');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Animation State
  const images = new Array(TOTAL_FRAMES);
  let loadedCount = 0;
  let targetProgress = 0;
  let currentProgress = 0;
  let lastDrawnFrame = -1;
  let isInitialFrameRendered = false;
  let isResizePending = false;

  // Build zero-padded file path (e.g. frame_0001.jpg)
  function getFramePath(index) {
    const padded = String(index).padStart(PADDING_DIGITS, '0');
    return `${FOLDER_PATH}/${FRAME_PREFIX}${padded}${FRAME_EXT}`;
  }

  // Preload single image
  function preloadImage(index) {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = getFramePath(index + 1);

      img.onload = () => {
        images[index] = img;
        loadedCount++;
        updateProgress();

        // Render first frame as soon as frame 0 is ready
        if (index === 0 && !isInitialFrameRendered) {
          isInitialFrameRendered = true;
          renderFrame(0);
        }
        resolve(img);
      };

      img.onerror = () => {
        console.warn(`Frame failed to load: ${img.src}`);
        loadedCount++;
        updateProgress();
        resolve(null);
      };
    });
  }

  // Update loading UI and dismiss when ready
  function updateProgress() {
    const percent = Math.min(100, Math.floor((loadedCount / TOTAL_FRAMES) * 100));
    if (loaderBar) loaderBar.style.width = `${percent}%`;
    if (loaderProgress) loaderProgress.textContent = `${percent}%`;

    // Once sufficient frames or all frames are ready, hide loader smoothly
    if (loadedCount >= TOTAL_FRAMES || (loadedCount >= 25 && isInitialFrameRendered)) {
      setTimeout(() => {
        if (loader) loader.classList.add('hidden');
      }, 250);
    }
  }

  // Batch preloading with concurrency for high performance
  async function preloadAllFrames() {
    // 1. Prioritize frame 0 immediately
    await preloadImage(0);

    // 2. Load the remaining frames with controlled batch concurrency
    const CONCURRENCY = 14;
    const remainingIndices = [];
    for (let i = 1; i < TOTAL_FRAMES; i++) {
      remainingIndices.push(i);
    }

    async function loadWorker() {
      while (remainingIndices.length > 0) {
        const nextIndex = remainingIndices.shift();
        if (nextIndex !== undefined) {
          await preloadImage(nextIndex);
        }
      }
    }

    const workers = [];
    for (let c = 0; c < CONCURRENCY; c++) {
      workers.push(loadWorker());
    }
    await Promise.all(workers);
  }

  // Fallback to nearest loaded frame to avoid any blank flashes during rapid scrub
  function getBestAvailableFrame(targetIndex) {
    if (images[targetIndex] && images[targetIndex].complete && images[targetIndex].naturalWidth > 0) {
      return images[targetIndex];
    }

    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const left = targetIndex - offset;
      if (left >= 0 && images[left] && images[left].complete && images[left].naturalWidth > 0) {
        return images[left];
      }
      const right = targetIndex + offset;
      if (right < TOTAL_FRAMES && images[right] && images[right].complete && images[right].naturalWidth > 0) {
        return images[right];
      }
    }
    return null;
  }

  // High-DPI Canvas Resize with Cover Aspect Ratio
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
    }

    // Force redraw current frame on resize
    if (lastDrawnFrame >= 0) {
      renderFrame(lastDrawnFrame, true);
    }
  }

  // Draw image on canvas preserving cover ratio and centering
  function renderFrame(frameIndex, forceRedraw = false) {
    if (frameIndex === lastDrawnFrame && !forceRedraw) return;

    const img = getBestAvailableFrame(frameIndex);
    if (!img) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth || 1280;
    const ih = img.naturalHeight || 720;

    // Cover math (fill canvas maintaining aspect ratio)
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.drawImage(img, dx, dy, dw, dh);
    lastDrawnFrame = frameIndex;
  }

  // Calculate scroll metrics cross-browser
  function updateScrollProgress() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const scrollHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
    const maxScroll = scrollHeight - window.innerHeight;

    if (maxScroll > 0) {
      targetProgress = Math.max(0, Math.min(1, scrollY / maxScroll));
    }

    // Navbar background blur/darken on scroll
    if (navbar) {
      if (scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Hide scroll cue on scroll
    if (scrollCue) {
      if (scrollY > 50) {
        scrollCue.style.opacity = '0';
        scrollCue.style.pointerEvents = 'none';
      } else {
        scrollCue.style.opacity = '1';
        scrollCue.style.pointerEvents = 'auto';
      }
    }

    // Update active nav link based on current section in viewport
    let currentSectionId = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  }

  // Physics animation loop using linear interpolation (LERP)
  function animate() {
    // Continuously read scroll position
    updateScrollProgress();

    // Smooth lerp toward target scroll progress
    const diff = targetProgress - currentProgress;
    if (Math.abs(diff) > 0.0001) {
      currentProgress += diff * LERP_FACTOR;
    } else {
      currentProgress = targetProgress;
    }

    // Calculate current frame index (0 to TOTAL_FRAMES - 1)
    const targetFrame = Math.min(
      TOTAL_FRAMES - 1,
      Math.max(0, Math.round(currentProgress * (TOTAL_FRAMES - 1)))
    );

    renderFrame(targetFrame);

    requestAnimationFrame(animate);
  }

  // Interactive Skill Bars Animation on Scroll into View
  function setupSkillBarsObserver() {
    const skillSection = document.getElementById('skills');
    if (!skillSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            document.querySelectorAll('.progress-bar-fill').forEach((bar) => {
              const width = bar.style.getPropertyValue('--skill-width');
              bar.style.width = width;
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(skillSection);
  }

  // Interactive Project dots click handler
  function setupProjectDots() {
    const dots = document.querySelectorAll('.projects-dots .dot');
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        dots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        const cards = document.querySelectorAll('.project-card');
        if (cards[idx]) {
          cards[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    });
  }

  // Event Listeners
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  window.addEventListener('resize', () => {
    if (!isResizePending) {
      isResizePending = true;
      requestAnimationFrame(() => {
        resizeCanvas();
        isResizePending = false;
      });
    }
  });

  // Continuous Animated RGB/Rainbow Theme Hue Shift
  function initThemeColorCycle() {
    let currentHue = 355;
    let lastThemeTime = performance.now();
    // 30 degrees per second -> vibrant full rainbow transition in 12 seconds
    const HUE_SPEED_DEG_PER_SEC = 30;
    const rootStyle = document.documentElement.style;

    function stepThemeHue(timestamp) {
      const deltaSeconds = (timestamp - lastThemeTime) / 1000;
      lastThemeTime = timestamp;

      currentHue = (currentHue + HUE_SPEED_DEG_PER_SEC * deltaSeconds) % 360;
      const h = currentHue.toFixed(1);
      const hAlt = ((currentHue + 40) % 360).toFixed(1);

      const colorMain = `hsl(${h}, 94%, 58%)`;
      const colorGlow = `hsla(${h}, 94%, 58%, 0.45)`;
      const colorSoft = `hsla(${h}, 94%, 58%, 0.16)`;
      const colorBorder = `hsla(${h}, 94%, 58%, 0.4)`;
      const colorAlt = `hsl(${hAlt}, 96%, 62%)`;
      const colorDark = `hsl(${h}, 90%, 38%)`;

      rootStyle.setProperty('--theme-hue', h);
      rootStyle.setProperty('--accent-theme', colorMain);
      rootStyle.setProperty('--accent-theme-glow', colorGlow);
      rootStyle.setProperty('--accent-theme-soft', colorSoft);
      rootStyle.setProperty('--accent-theme-border', colorBorder);
      rootStyle.setProperty('--accent-theme-alt', colorAlt);
      rootStyle.setProperty('--accent-theme-dark', colorDark);

      // Direct aliases so all elements and gradients update simultaneously
      rootStyle.setProperty('--accent-red', colorMain);
      rootStyle.setProperty('--accent-red-glow', colorGlow);
      rootStyle.setProperty('--border-glass-glow', colorBorder);

      requestAnimationFrame(stepThemeHue);
    }

    requestAnimationFrame(stepThemeHue);
  }

  // Start RGB theme cycling immediately
  initThemeColorCycle();

  // Initialization
  function initApp() {
    resizeCanvas();
    preloadAllFrames();
    setupSkillBarsObserver();
    setupProjectDots();
    requestAnimationFrame(animate);
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
