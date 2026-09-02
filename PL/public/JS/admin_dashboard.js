// Header scroll effect (same idea as home.js)
window.addEventListener("scroll", () => {
  const header = document.getElementById("header");
  if (!header) return;

  if (window.scrollY > 30) header.classList.add("scrolled");
  else header.classList.remove("scrolled");
});

// Tabs logic (semantic: uses hidden)
const employeesBtn = document.getElementById("employeesBtn");
const productsBtn  = document.getElementById("productsBtn");
const carouselBtn  = document.getElementById("carouselBtn");

const employeesView = document.getElementById("employeesView");
const productsView  = document.getElementById("productsView");
const carouselView  = document.getElementById("carouselView");

const tabs = [
  { btn: employeesBtn, view: employeesView },
  { btn: productsBtn,  view: productsView },
  { btn: carouselBtn,  view: carouselView },
].filter(t => t.btn && t.view);

if (tabs.length) {
  const setActive = (active) => {
    tabs.forEach(t => {
      t.view.hidden = (t !== active);
      t.btn.classList.toggle("active", t === active);
      t.btn.setAttribute("aria-selected", t === active ? "true" : "false");
    });
  };

  tabs.forEach(t => t.btn.addEventListener("click", () => setActive(t)));

  setActive(tabs[0]);
}