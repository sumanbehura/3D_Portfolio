document.addEventListener('DOMContentLoaded', function () {
  // --- Background Audio Control ---
  const introAudio = document.getElementById('introAudio');
  const audioToggle = document.getElementById('audioToggle');
  let isAudioMuted = localStorage.getItem('audioMuted') === 'true';
  
  // Set volume to 80% (20% reduction)
  introAudio.volume = 0.8;

  // Set initial audio state based on localStorage
  if (isAudioMuted) {
    introAudio.muted = true;
    audioToggle.classList.add('muted');
  } else {
    // Try to play audio (may be blocked by browser policy)
    const audioPromise = introAudio.play();
    if (audioPromise !== undefined) {
      audioPromise.catch(error => {
        // Audio autoplay is blocked - unmute only when user interacts
        introAudio.muted = true;
        audioToggle.classList.add('muted');
      });
    }
  }

  // Audio toggle button
  audioToggle.addEventListener('click', function () {
    isAudioMuted = !isAudioMuted;
    introAudio.muted = isAudioMuted;
    audioToggle.classList.toggle('muted', isAudioMuted);
    
    // Save preference to localStorage
    localStorage.setItem('audioMuted', isAudioMuted);

    // Play audio if unmuted
    if (!isAudioMuted) {
      const audioPromise = introAudio.play();
      if (audioPromise !== undefined) {
        audioPromise.catch(error => {
          console.log('Audio autoplay blocked');
        });
      }
    }
  });

  // Resume audio on user interaction if it was blocked by browser
  document.addEventListener('click', function resumeAudioOnClick() {
    if (introAudio.paused && !isAudioMuted) {
      introAudio.play().catch(error => {
        // Still blocked
      });
    }
  }, { once: true });

  // --- Sidebar Navigation ---
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const sidebarLinks = document.querySelectorAll('.sidebar-link');

  function closeSidebar() {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    sidebarToggle.setAttribute('aria-expanded', 'false');
  }

  function openSidebar() {
    sidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
    sidebarToggle.setAttribute('aria-expanded', 'true');
  }

  sidebarToggle.addEventListener('click', function () {
    if (sidebar.classList.contains('active')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  sidebarOverlay.addEventListener('click', closeSidebar);

  sidebarLinks.forEach(link => {
    link.addEventListener('click', closeSidebar);
  });

  // Close sidebar on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sidebar.classList.contains('active')) {
      closeSidebar();
    }
  });

  // --- Sub-page Navigation ---
  const subpageCards = document.querySelectorAll('[data-subpage]');
  const backBtn = document.querySelector('.btn-back');
  const stageMain = document.getElementById('stage-main');
  const subpages = document.querySelectorAll('.subpage');

  subpageCards.forEach(card => {
    card.addEventListener('click', function () {
      const subpageId = this.dataset.subpage;
      showSubpage(subpageId);
    });
  });

  function showSubpage(subpageId) {
    // Hide main stage
    stageMain.style.display = 'none';
    // Hide all subpages
    subpages.forEach(page => page.style.display = 'none');
    // Show selected subpage
    const subpage = document.getElementById(subpageId);
    if (subpage) {
      subpage.style.display = 'block';
      // Show back button with animation
      backBtn.style.display = 'flex';
      setTimeout(() => backBtn.style.opacity = '1', 10);
    }
  }

  function hideSubpage() {
    // Show main stage
    stageMain.style.display = 'block';
    // Hide all subpages
    subpages.forEach(page => page.style.display = 'none');
    // Hide back button
    backBtn.style.opacity = '0';
    setTimeout(() => backBtn.style.display = 'none', 300);
  }

  backBtn.addEventListener('click', function (e) {
    e.preventDefault();
    hideSubpage();
  });

  // --- On-scroll reveal animation ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('inview');
      }
    });
  }, {
    threshold: 0.2
  });

  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach(el => observer.observe(el));

  // --- Profile image glow effect ---
  const wrapper = document.querySelector('.profile-glow-wrapper');
  const img = document.getElementById('profileGlowImg');
  if (wrapper && img) {
    function activateGlow() {
      wrapper.classList.add('glow-active');
    }
    function deactivateGlow() {
      wrapper.classList.remove('glow-active');
    }
    img.addEventListener('pointerdown', activateGlow);
    img.addEventListener('pointerup', deactivateGlow);
    img.addEventListener('pointerleave', deactivateGlow);
    img.addEventListener('touchstart', activateGlow);
    img.addEventListener('touchend', deactivateGlow);
  }

  // --- Logo scroll animation (detect scroll direction) ---
  (function () {
    const logoImg = document.querySelector('.logo-img');
    if (!logoImg) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const delta = currentY - lastScrollY;

          if (Math.abs(delta) > 5) {
            if (delta > 0) {
              logoImg.classList.remove('logo-scroll-up');
              logoImg.classList.add('logo-scroll-down');
            } else {
              logoImg.classList.remove('logo-scroll-down');
              logoImg.classList.add('logo-scroll-up');
            }
          }

          lastScrollY = currentY;
          ticking = false;
        });
        ticking = true;
      }
    }

    let resetTimer = null;
    window.addEventListener('scroll', function () {
      onScroll();
      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        logoImg.classList.remove('logo-scroll-down', 'logo-scroll-up');
      }, 800);
    }, { passive: true });
  })();

  // --- Download CV button animation ---
  (function () {
    const btn = document.querySelector('.btn-download-cv');
    if (!btn) return;

    const label = btn.querySelector('span');

    function animateDownloading() {
      btn.classList.add('downloading');
      label.textContent = 'Downloading...';
      setTimeout(() => {
        btn.classList.remove('downloading');
        btn.classList.add('downloaded');
        label.textContent = 'Downloaded';
        setTimeout(() => {
          btn.classList.remove('downloaded');
          label.textContent = 'Download CV';
        }, 1400);
      }, 1200);
    }

    btn.addEventListener('click', function () {
      animateDownloading();
    });
  })();

  // --- Mobile & Responsive Optimization ---
  (function () {
    const isMobile = () => window.innerWidth <= 768;
    const isTablet = () => window.innerWidth > 768 && window.innerWidth <= 1024;

    // Disable certain animations on mobile for better performance
    if (isMobile()) {
      document.body.classList.add('mobile-device');
    }

    if (isTablet()) {
      document.body.classList.add('tablet-device');
    }

    // Close sidebar when window is resized to desktop size
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
      }
    });

    // Optimize touch interactions
    document.addEventListener('touchstart', function () {
      document.documentElement.style.scrollBehavior = 'auto';
    }, { passive: true });

    document.addEventListener('touchend', function () {
      document.documentElement.style.scrollBehavior = 'smooth';
    }, { passive: true });
  })();
});
