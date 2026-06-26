/**
 * HAVEN RENTALS — Listings Renderer + Carousel Logic
 * ------------------------------------------------------
 * Renders listing cards from LISTINGS_DATA (listings-data.js)
 * and wires up the per-card room carousel + lightbox.
 */

(function () {
  const SVG = {
    location: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    guests: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    bed: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2"/></svg>`,
    bath: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-2.5 1V9"/><path d="M4 9h18v3a8 8 0 0 1-8 8H10a8 8 0 0 1-8-8Z"/><line x1="6" y1="20" x2="6" y2="22"/><line x1="18" y1="20" x2="18" y2="22"/></svg>`,
    star: `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2 15 9 22 9.5 16.7 14.2 18.3 21 12 17.3 5.7 21 7.3 14.2 2 9.5 9 9Z"/></svg>`
  };

  function formatPrice(amount, currency) {
    return currency + amount.toLocaleString("en-NG");
  }

  function roomSlideHTML(room, index, isFirst) {
    const inner = room.image
      ? `<img
            src="${room.image}"
            alt="${room.label}"
            loading="${isFirst ? 'eager' : 'lazy'}"
            decoding="async"
            fetchpriority="${isFirst ? 'high' : 'low'}"
          />`
      : `<div class="carousel-fallback">${room.emoji || "🏠"}</div>`;
    return `
      <div class="carousel-slide" data-index="${index}">
        ${inner}
        <span class="carousel-slide-label">${room.label}</span>
      </div>`;
  }

  function listingCardHTML(listing, cardIndex) {
    const dots = listing.rooms
      .map((_, i) => `<span class="carousel-dot${i === 0 ? " active" : ""}" data-dot="${i}"></span>`)
      .join("");

    // First slide of first card loads eager+high priority, rest are lazy
    const slides = listing.rooms
      .map((room, i) => roomSlideHTML(room, i, cardIndex === 0 && i === 0))
      .join("");

    const amenities = listing.amenities
      .map((a) => `<span class="amenity-pill">${a}</span>`)
      .join("");

    return `
    <article class="listing-card" data-listing-id="${listing.id}">
      <div class="listing-carousel" data-carousel>
        <div class="carousel-room-count">${listing.rooms.length} rooms</div>
        <div class="carousel-dots">${dots}</div>
        <div class="carousel-track" data-track>${slides}</div>
        <button class="carousel-arrow prev" data-prev aria-label="Previous room">&#8249;</button>
        <button class="carousel-arrow next" data-next aria-label="Next room">&#8250;</button>
      </div>

      <div class="listing-info">
        <div class="listing-location">${SVG.location} ${listing.location}</div>
        <h3 class="listing-name">${listing.name}</h3>
        <p class="listing-desc">${listing.description}</p>

        <div class="listing-meta-row">
          <span class="meta-item">${SVG.guests} ${listing.guests} guests</span>
          <span class="meta-item">${SVG.bed} ${listing.bedrooms} bedroom${listing.bedrooms > 1 ? "s" : ""}</span>
          <span class="meta-item">${SVG.bath} ${listing.bathrooms} bath${listing.bathrooms > 1 ? "s" : ""}</span>
        </div>

        <div class="listing-rating">
          ${SVG.star} ${listing.rating.toFixed(1)}
          <span class="rating-count">(${listing.reviewCount} stays)</span>
        </div>

        <div class="listing-amenities">${amenities}</div>

        <div class="listing-footer">
          <div class="listing-price">
            <span class="price-amount">${formatPrice(listing.pricePerNight, listing.currency)}</span>
            <span class="price-period">/ night</span>
          </div>
          <a href="mailto:stay@havenrentals.example?subject=Booking%20enquiry%20—%20${encodeURIComponent(listing.name)}" class="listing-book-btn">
            Request to Book
          </a>
        </div>
      </div>
    </article>`;
  }

  function renderListings() {
    const grid = document.getElementById("listingsGrid");
    if (!grid) return;
    grid.innerHTML = LISTINGS_DATA.map((listing, i) => listingCardHTML(listing, i)).join("");
  }

  /* ---------- Per-card carousel logic ---------- */
  function initCarousels() {
    document.querySelectorAll("[data-carousel]").forEach((carousel) => {
      const track = carousel.querySelector("[data-track]");
      const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
      const dots = Array.from(carousel.querySelectorAll(".carousel-dot"));
      const prevBtn = carousel.querySelector("[data-prev]");
      const nextBtn = carousel.querySelector("[data-next]");
      const total = slides.length;
      let current = 0;
      let isTransitioning = false;

      if (total <= 1) return;

      function updateDots() {
        dots.forEach((d, i) => d.classList.toggle("active", i === current));
      }

      // Infinite wrap: jump instantly (no animation) then re-enable transition
      function goTo(index, animated) {
        if (animated === false) {
          track.style.transition = "none";
        } else {
          track.style.transition = "transform 0.5s var(--ease-out)";
        }
        track.style.transform = `translateX(-${index * 100}%)`;
        current = index;
        updateDots();
      }

      function advance(dir) {
        if (isTransitioning) return;
        isTransitioning = true;

        const next = (current + dir + total) % total;
        goTo(next, true);

        setTimeout(() => { isTransitioning = false; }, 520);
      }

      prevBtn.addEventListener("click", (e) => { e.stopPropagation(); advance(-1); });
      nextBtn.addEventListener("click", (e) => { e.stopPropagation(); advance(1); });

      dots.forEach((dot) => {
        dot.addEventListener("click", (e) => {
          e.stopPropagation();
          const target = parseInt(dot.dataset.dot, 10);
          if (target !== current && !isTransitioning) {
            isTransitioning = true;
            goTo(target, true);
            setTimeout(() => { isTransitioning = false; }, 520);
          }
        });
      });

      // Lightbox on image click (not arrows/dots)
      carousel.addEventListener("click", (e) => {
        if (
          e.target.closest("[data-prev]") ||
          e.target.closest("[data-next]") ||
          e.target.closest(".carousel-dot")
        ) return;
        const listingCard = carousel.closest(".listing-card");
        const listing = LISTINGS_DATA.find((l) => l.id === listingCard.dataset.listingId);
        window.HavenLightbox.open(listing, current);
      });

      // Swipe support — uses advance() so wrapping works on mobile too
      let touchStartX = 0;
      let touchStartY = 0;
      carousel.addEventListener("touchstart", (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }, { passive: true });

      carousel.addEventListener("touchend", (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        // Only treat as horizontal swipe if clearly horizontal
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
          dx > 0 ? advance(-1) : advance(1);
        }
      }, { passive: true });

      // Keyboard support when carousel is focused
      carousel.setAttribute("tabindex", "0");
      carousel.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") { e.preventDefault(); advance(-1); }
        if (e.key === "ArrowRight") { e.preventDefault(); advance(1); }
      });
    });
  }

  /* ---------- Scroll reveal for cards ---------- */
  function initScrollReveal() {
    const cards = document.querySelectorAll(".listing-card");
    if (!("IntersectionObserver" in window)) {
      cards.forEach((c) => c.classList.add("in-view"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    cards.forEach((c) => observer.observe(c));
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderListings();
    initCarousels();
    initScrollReveal();
  });
})();
