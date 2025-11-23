// ACENO Café Interactions
// - Mobile menu toggle
// - Sticky header on scroll
// - Smooth scrolling
// - Fade-in animations via IntersectionObserver
// - Simple gallery lightbox

(function () {
	"use strict";

	const header = document.getElementById("header");
	const navToggle = document.querySelector(".nav-toggle");
	const navMenu = document.getElementById("nav-menu");
	const navLinks = document.querySelectorAll(".nav-link");

	// Footer year
	const yearEl = document.getElementById("year");
	if (yearEl) yearEl.textContent = new Date().getFullYear().toString();

	// Sticky header
	const setHeaderState = () => {
		if (window.scrollY > 10) {
			header?.classList.add("scrolled");
		} else {
			header?.classList.remove("scrolled");
		}
	};
	setHeaderState();
	window.addEventListener("scroll", setHeaderState, { passive: true });

	// Mobile menu toggle
	const closeMenu = () => {
		navMenu?.classList.remove("open");
		if (navToggle) navToggle.setAttribute("aria-expanded", "false");
		document.body.style.overflow = "";
	};
	const openMenu = () => {
		navMenu?.classList.add("open");
		if (navToggle) navToggle.setAttribute("aria-expanded", "true");
		document.body.style.overflow = "hidden";
	};
	if (navToggle && navMenu) {
		navToggle.addEventListener("click", () => {
			const isOpen = navMenu.classList.contains("open");
			isOpen ? closeMenu() : openMenu();
		});
	}

	// Smooth scrolling
	const smoothLinks = document.querySelectorAll('a[href^="#"], [data-scroll]');
	const smoothScroll = (e) => {
		const targetAttr = e.currentTarget.getAttribute("href");
		if (!targetAttr || !targetAttr.startsWith("#")) return;
		const target = document.querySelector(targetAttr);
		if (!target) return;
		e.preventDefault();
		target.scrollIntoView({ behavior: "smooth", block: "start" });
		closeMenu();
	};
	smoothLinks.forEach((link) => link.addEventListener("click", smoothScroll));

	// Close mobile menu when link clicked
	navLinks.forEach((link) => link.addEventListener("click", closeMenu));

	// Fade-in on scroll
	const fadeEls = document.querySelectorAll(".fade-in");
	if ("IntersectionObserver" in window) {
		const obs = new IntersectionObserver(
			(entries, observer) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("in-view");
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.18 }
		);
		fadeEls.forEach((el) => obs.observe(el));
	} else {
		// Fallback
		fadeEls.forEach((el) => el.classList.add("in-view"));
	}

	// Simple lightbox
	const galleryLinks = document.querySelectorAll('[data-lightbox]');
	let lightbox, lightboxImg, closeBtn;

	const ensureLightbox = () => {
		if (lightbox) return;
		lightbox = document.createElement("div");
		lightbox.className = "lightbox";
		lightbox.innerHTML = `
			<button class="close" aria-label="Close preview">Close ✕</button>
			<img alt="Preview" />
		`;
		document.body.appendChild(lightbox);
		lightboxImg = lightbox.querySelector("img");
		closeBtn = lightbox.querySelector(".close");

		// Close interactions
		lightbox.addEventListener("click", (e) => {
			if (e.target === lightbox || e.target === closeBtn) hideLightbox();
		});
		document.addEventListener("keydown", (e) => {
			if (e.key === "Escape") hideLightbox();
		});
	};

	const showLightbox = (src) => {
		ensureLightbox();
		if (!lightbox || !lightboxImg) return;
		lightboxImg.src = src;
		lightbox.classList.add("open");
		document.body.style.overflow = "hidden";
	};
	const hideLightbox = () => {
		if (!lightbox) return;
		lightbox.classList.remove("open");
		document.body.style.overflow = "";
		setTimeout(() => {
			if (lightboxImg) lightboxImg.src = "";
		}, 200);
	};

	galleryLinks.forEach((a) => {
		a.addEventListener("click", (e) => {
			e.preventDefault();
			const src = a.getAttribute("href");
			if (src) showLightbox(src);
		});
	});
})();


