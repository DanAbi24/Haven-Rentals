/**
 * HAVEN RENTALS — Listings Renderer + Carousel Logic
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
      ? `<img src="${room.image}" alt="${room.label}" loading="${isFirst ? 'eager' : 'lazy'}" decoding="async" fetchpriority="${isFirst ? 'high' : 'low'}" />`
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

  /* ---------- Clone-based infinite carousel ----------
   *
   * Layout after cloning:
   *   [clone of LAST] [slide 0] [slide 1] ... [slide N-1] [clone of FIRST]
   *
   * We start positioned at index 1 (the real first slide).
   * When user lands on the clone-of-LAST  (index 0)      → snap to real LAST  (index N)
   * When user lands on the clone-of-FIRST (index N+1)    → snap to real FIRST (index 1)
   * Snap = instant reposition with no transition, invisible to the user.
   */
  function initCarousels() {
    document.querySelectorAll("[data-carousel]").forEach((carousel) => {
      const track    = carousel.querySelector("[data-track]");
      const dots     = Array.from(carousel.querySelectorAll(".carousel-dot"));
      const prevBtn  = carousel.querySelector("[data-prev]");
      const nextBtn  = carousel.querySelector("[data-next]");

      const realSlides = Array.from(track.querySelectorAll(".carousel-slide"));
      const total      = realSlides.length;
      if (total <= 1) return;

      // --- Build clone sandwich ---
      const firstClone = realSlides[0].cloneNode(true);
      const lastClone  = realSlides[total - 1].cloneNode(true);
      firstClone.setAttribute("aria-hidden", "true");
      lastClone.setAttribute("aria-hidden",  "true");
      track.appendChild(firstClone);   // goes after real last
      track.prepend(lastClone);         // goes before real first

      // Total slides in DOM = total + 2 clones
      // Real slides live at positions 1 … total  (0-indexed inside track)
      let position = 1; // start on real first slide
      let isTransitioning = false;

      // real slide index (0-based) from DOM position
      function realIndex(pos) {
        return ((pos - 1) % total + total) % total;
      }

      function setPosition(pos, animated) {
        track.style.transition = animated ? "transform 0.45s var(--ease-out)" : "none";
        track.style.transform  = `translateX(-${pos * 100}%)`;
        position = pos;
      }

      function updateDots() {
        const ri = realIndex(position);
        dots.forEach((d, i) => d.classList.toggle("active", i === ri));
      }

      // Start without animation at position 1
      setPosition(1, false);
      updateDots();

      // After each animated move, check if we landed on a clone and snap
      track.addEventListener("transitionend", () => {
        isTransitioning = false;

        if (position === 0) {
          // Landed on clone-of-last → snap to real last
          setPosition(total, false);
          updateDots();
        } else if (position === total + 1) {
          // Landed on clone-of-first → snap to real first
          setPosition(1, false);
          updateDots();
        }
      });

      function advance(dir) {
        if (isTransitioning) return;
        isTransitioning = true;
        setPosition(position + dir, true);
        updateDots();
      }

      prevBtn.addEventListener("click", (e) => { e.stopPropagation(); advance(-1); });
      nextBtn.addEventListener("click", (e) => { e.stopPropagation(); advance(1);  });

      dots.forEach((dot) => {
        dot.addEventListener("click", (e) => {
          e.stopPropagation();
          if (isTransitioning) return;
          const target = parseInt(dot.dataset.dot, 10) + 1; // +1 because of prepended clone
          if (target !== position) {
            isTransitioning = true;
            setPosition(target, true);
            updateDots();
          }
        });
      });

      // Lightbox on image click (not controls)
      carousel.addEventListener("click", (e) => {
        if (
          e.target.closest("[data-prev]") ||
          e.target.closest("[data-next]") ||
          e.target.closest(".carousel-dot")
        ) return;
        const listingCard = carousel.closest(".listing-card");
        const listing = LISTINGS_DATA.find((l) => l.id === listingCard.dataset.listingId);
        window.HavenLightbox.open(listing, realIndex(position));
      });

      // Swipe
      let touchStartX = 0;
      let touchStartY = 0;
      carousel.addEventListener("touchstart", (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }, { passive: true });

      carousel.addEventListener("touchend", (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
          dx > 0 ? advance(-1) : advance(1);
        }
      }, { passive: true });

      // Keyboard
      carousel.setAttribute("tabindex", "0");
      carousel.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft")  { e.preventDefault(); advance(-1); }
        if (e.key === "ArrowRight") { e.preventDefault(); advance(1);  }
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
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
