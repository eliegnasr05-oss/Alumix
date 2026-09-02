document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    if (!form) return;

    form.addEventListener("submit", () => {
        ["name","description","price"].forEach(name => {
        const el = form.querySelector(`[name="${name}"]`);
        if (el && typeof el.value === "string") el.value = el.value.trim();
        });
    });
});
