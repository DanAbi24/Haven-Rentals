/**
 * HAVEN RENTALS — Main interactions
 * Nav scroll state, hero sound toggle, lightbox, footer year.
 */

(function () {
  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Nav scroll state ---------- */
  const nav = document.getElementById("siteNav");
  function handleNavScroll() {
    if (window.scrollY > 40) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", handleNavScroll, { passive: true });
  handleNavScroll();

  /* ---------- Hero sound toggle ---------- */
  const soundToggle = document.getElementById("soundToggle");
  const heroVideo = document.querySelector(".hero-video");

  if (soundToggle && heroVideo) {
    soundToggle.addEventListener("click", () => {
      heroVideo.muted = !heroVideo.muted;
      const isMuted = heroVideo.muted;
      soundToggle.setAttribute("aria-pressed", String(!isMuted));
      soundToggle.querySelector("span").textContent = isMuted ? "Sound off" : "Sound on";
    });
  }

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  let activeListing = null;
  let activeIndex = 0;

  function renderLightboxSlide() {
    if (!activeListing) return;
    const room = activeListing.rooms[activeIndex];
    if (room.image) {
      lightboxImg.src = room.image;
      lightboxImg.alt = room.label;
      lightboxImg.style.display = "block";
    } else {
      lightboxImg.style.display = "none";
    }
    lightboxCaption.textContent = `${activeListing.name} — ${room.label}`;
  }

  function openLightbox(listing, index) {
    activeListing = listing;
    activeIndex = index;
    renderLightboxSlide();
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function stepLightbox(dir) {
    if (!activeListing) return;
    const total = activeListing.rooms.length;
    activeIndex = (activeIndex + dir + total) % total;
    renderLightboxSlide();
  }

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener("click", () => stepLightbox(-1));
  if (lightboxNext) lightboxNext.addEventListener("click", () => stepLightbox(1));

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });

  // Exposed for listings.js to call on image click
  window.HavenLightbox = { open: openLightbox };
})();
