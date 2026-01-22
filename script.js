document.addEventListener('DOMContentLoaded', function () {
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
});
