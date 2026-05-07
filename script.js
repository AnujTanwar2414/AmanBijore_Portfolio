const words = [
  "clean execution",
  "modern UI",
  "real impact",
  "high performance",
];

const typeTarget = document.getElementById("typeTarget");
const yearEl = document.getElementById("year");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const links = Array.from(document.querySelectorAll(".nav-links a"));
const sections = Array.from(document.querySelectorAll("main section"));

yearEl.textContent = new Date().getFullYear();

let wordIndex = 0;
setInterval(() => {
  wordIndex = (wordIndex + 1) % words.length;
  typeTarget.textContent = words[wordIndex];
}, 1800);

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

links.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.2 },
);

const countWhenVisible = (el) => {
  const target = Number(el.dataset.count || 0);
  const displayEl = el.querySelector(".count") || el;
  let curr = 0;
  const steps = 36;
  const jump = Math.max(1, Math.ceil(target / steps));

  const format = (v) => {
    // if percent sign element exists, show two decimals
    if (el.querySelector(".percent")) {
      return Number(v).toFixed(2);
    }
    return String(Math.round(v));
  };

  const tick = () => {
    curr += jump;
    if (curr >= target) {
      displayEl.textContent = format(target);
      return;
    }
    displayEl.textContent = format(curr);
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

const statObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }
      const h2 = entry.target.querySelector("h2[data-count]");
      if (h2) {
        countWhenVisible(h2);
      }
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.45 },
);

const setActiveLink = () => {
  const marker = window.scrollY + 120;
  let active = sections[0]?.id;

  sections.forEach((section) => {
    if (section.offsetTop <= marker) {
      active = section.id;
    }
  });

  links.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${active}`;
    link.classList.toggle("active", isActive);
  });
};

const cards = Array.from(document.querySelectorAll(".tilt-card"));
cards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = (y / rect.height - 0.5) * -6;
    const rotateY = (x / rect.width - 0.5) * 8;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  });
});

document
  .querySelectorAll(".reveal")
  .forEach((el) => revealObserver.observe(el));
document
  .querySelectorAll(".stat-card")
  .forEach((el) => statObserver.observe(el));

window.addEventListener("scroll", setActiveLink, { passive: true });
setActiveLink();
