document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("site-nav");
  const toggle = document.getElementById("menu-toggle");

  if (nav && toggle) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const page = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".site-nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (
      href === page ||
      (page === "" && href === "index.html") ||
      (page === "/" && href === "index.html")
    ) {
      link.setAttribute("aria-current", "page");
    }
  });

  const form = document.getElementById("rfq-form");
  if (!form) {
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function fieldWrap(field) {
    return field.closest(".field");
  }

  function showError(field, message) {
    field.setAttribute("aria-invalid", "true");
    const wrap = fieldWrap(field);
    if (!wrap) {
      return;
    }
    let error = wrap.querySelector(".field-error");
    if (!error) {
      error = document.createElement("span");
      error.className = "field-error";
      error.setAttribute("role", "alert");
      wrap.appendChild(error);
    }
    error.textContent = message;
  }

  function clearError(field) {
    field.removeAttribute("aria-invalid");
    const wrap = fieldWrap(field);
    const error = wrap ? wrap.querySelector(".field-error") : null;
    if (error) {
      error.textContent = "";
    }
  }

  function requiredValue(field) {
    return field.value.trim();
  }

  form.addEventListener("submit", (event) => {
    const name = form.querySelector("#name");
    const company = form.querySelector("#company");
    const email = form.querySelector("#email");
    const message = form.querySelector("#notes");
    let valid = true;

    [name, company, email, message].forEach((field) => {
      if (field) {
        clearError(field);
      }
    });

    if (name && requiredValue(name).length < 2) {
      showError(name, "Enter your name.");
      valid = false;
    }

    if (company && requiredValue(company).length < 2) {
      showError(company, "Enter your company.");
      valid = false;
    }

    if (email && !emailPattern.test(requiredValue(email))) {
      showError(email, "Enter a valid email address.");
      valid = false;
    }

    if (message && requiredValue(message).length < 10) {
      showError(message, "Describe the work in at least a few sentences.");
      valid = false;
    }

    if (!valid) {
      event.preventDefault();
      const firstError = form.querySelector("[aria-invalid='true']");
      if (firstError) {
        firstError.focus();
      }
    }
  });
});
