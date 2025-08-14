/* CECI - main.js
   - Mobile nav toggle
   - Reveal on scroll (IntersectionObserver)
   - Parallax effect for .parallax
   - Lightbox for gallery (images/videos)
   - Smooth active year + basic form handling
*/

(function () {
  const qs = (s, el = document) => el.querySelector(s);
  const qsa = (s, el = document) => Array.from(el.querySelectorAll(s));

  // Year in footer
  const y = qs('#year');
  if (y) y.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const toggle = qs('.nav-toggle');
  const menu = qs('#menu');
  if (toggle && menu) {
    const setState = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      // For desktop keep inline; for mobile drawer use .open class
      menu.style.display = open ? 'flex' : '';
      if (open) menu.classList.add('open'); else menu.classList.remove('open');
    };
    let open = false;
    toggle.addEventListener('click', () => { open = !open; setState(open); });
    // Collapse on link click (small screens)
    qsa('a', menu).forEach(a => a.addEventListener('click', () => { if (open) { open = false; setState(false); } }));
  }

  // Reveal on scroll
  const revealEls = qsa('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('reveal-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('reveal-visible'));
  }

  // Parallax (simple translate based on scroll)
  const parallax = qsa('.parallax');
  if (parallax.length) {
    const onScroll = () => {
      const y = window.scrollY;
      parallax.forEach(el => {
        el.style.backgroundPosition = `center ${Math.round(y * 0.2)}px`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Marquee duplication for seamless loop
  const marquee = qs('#marquee-track');
  if (marquee) {
    marquee.innerHTML = marquee.innerHTML + marquee.innerHTML; // duplicate content once
  }

  // Sticky CTA ribbon show/hide
  const cta = qs('#cta-ribbon');
  if (cta) {
    let shown = false;
    const onScrollCTA = () => {
      const y = window.scrollY;
      const shouldShow = y > 240;
      if (shouldShow !== shown) {
        shown = shouldShow;
        cta.classList.toggle('show', shown);
      }
    };
    window.addEventListener('scroll', onScrollCTA, { passive: true });
    onScrollCTA();
  }

  // Lightbox for galleries (supports multiple sections)
  const galleries = qsa('.masonry');
  const lightbox = qs('#lightbox');
  const lbContent = qs('#lightbox-content');
  if (galleries.length && lightbox && lbContent) {
    const openFromFigure = (fig) => {
      lbContent.innerHTML = '';
      const img = fig.querySelector('img');
      const vid = fig.querySelector('video');
      if (img && img.src) {
        const full = new Image();
        full.src = img.src; full.alt = img.alt || '';
        lbContent.appendChild(full);
      } else if (vid) {
        const v = vid.cloneNode(true);
        v.controls = true; v.muted = false; v.autoplay = true;
        lbContent.appendChild(v);
      } else {
        return;
      }
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };
    galleries.forEach(gal => {
      gal.addEventListener('click', (e) => {
        const fig = e.target.closest('figure');
        if (!fig || !gal.contains(fig)) return;
        openFromFigure(fig);
      });
    });
    const close = () => {
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      lbContent.innerHTML = '';
    };
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.hasAttribute('data-close')) close();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }

  // Basic contact form handler (demo only)
  const form = qs('#contact-form');
  if (form) {
    const status = qs('#form-status');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      status.textContent = 'Envoi en cours…';
      setTimeout(() => {
        status.textContent = 'Merci, votre demande a bien été envoyée. Nous vous recontacterons rapidement.';
        form.reset();
      }, 900);
    });
  }
})();
