<script>
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form");
  if (!form) return;

  const textFields = [
    "first_name",
    "last_name",
    "first_name_ar",
    "last_name_ar",
    "position",
    "position_ar",
    "phone",
    "email",
    "linkedIn"
  ];

  form.addEventListener("submit", () => {
    textFields.forEach((name) => {
      const field = form.elements.namedItem(name);

      if (field && typeof field.value === "string") {
        field.value = field.value.trim();
      }
    });
  });
});
</script>