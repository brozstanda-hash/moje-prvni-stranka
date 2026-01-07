document.addEventListener("DOMContentLoaded", () => {
  // Tlačítko "Napiš mi"
  const btn = document.getElementById("btnKontakt");
  const kontakt = document.getElementById("kontakt");

  if (btn && kontakt) {
    btn.addEventListener("click", () => {
      kontakt.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // Formulář
  const form = document.getElementById("kontaktForm");
  const msg = document.getElementById("formMsg");

  if (!form || !msg) return;

  const jmenoEl = form.elements["jmeno"];
  const emailEl = form.elements["email"];
  const zpravaEl = form.elements["zprava"];

  function clearErrors() {
    jmenoEl.classList.remove("input-error");
    emailEl.classList.remove("input-error");
    zpravaEl.classList.remove("input-error");
  }

  function showError(text) {
    msg.textContent = text;
    msg.classList.remove("msg--success");
    msg.classList.add("msg--error");
  }

  function showSuccess(text) {
    msg.textContent = text;
    msg.classList.remove("msg--error");
    msg.classList.add("msg--success");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    const jmeno = jmenoEl.value.trim();
    const email = emailEl.value.trim();
    const zprava = zpravaEl.value.trim();

    // základní kontrola
    let ok = true;

    if (!jmeno) {
      jmenoEl.classList.add("input-error");
      ok = false;
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!email || !emailOk) {
      emailEl.classList.add("input-error");
      ok = false;
    }

    if (!zprava) {
      zpravaEl.classList.add("input-error");
      ok = false;
    }

    if (!ok) {
      showError("Zkontroluj prosím červeně označená pole.");
      return;
    }

    showSuccess(`Díky, ${jmeno}! Zpráva je připravená ✅ (zatím test)`);
    form.reset();
  });
});
