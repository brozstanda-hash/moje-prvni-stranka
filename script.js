document.addEventListener("DOMContentLoaded", () => {
  // Tlačítko v headeru -> scroll na kontakt/objednávku
  const btn = document.getElementById("btnKontakt");
  const objednavka = document.getElementById("objednavka");
  if (btn && objednavka) {
    btn.addEventListener("click", () => {
      objednavka.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // Objednávkový formulář
  const form = document.getElementById("orderForm");
  const msg = document.getElementById("orderMsg");

  const sumEl = document.getElementById("sum");
  const deliveryEl = document.getElementById("delivery");
  const totalEl = document.getElementById("total");

  if (!form || !msg || !sumEl || !deliveryEl || !totalEl) return;

  const jmenoEl = form.elements["jmeno"];
  const telefonEl = form.elements["telefon"];
  const emailEl = form.elements["email"];
  const typEl = form.elements["typ"];
  const adresaEl = form.elements["adresa"];
  const poznamkaEl = form.elements["poznamka"];

  const itemCheckboxes = Array.from(form.querySelectorAll('input[name="item"]'));

  let hideTimer;

  function showError(text) {
    clearTimeout(hideTimer);
    msg.textContent = text;
    msg.classList.remove("msg--success");
    msg.classList.add("msg--error");
  }

  function showSuccess(text) {
    clearTimeout(hideTimer);
    msg.textContent = text;
    msg.classList.remove("msg--error");
    msg.classList.add("msg--success");
    hideTimer = setTimeout(() => {
      msg.classList.remove("msg--success");
      msg.textContent = "";
    }, 5000);
  }

  function clearErrors() {
    [jmenoEl, telefonEl, emailEl, adresaEl].forEach(el => el.classList.remove("input-error"));
    msg.classList.remove("msg--error");
  }

  function calc() {
    const items = itemCheckboxes
      .filter(ch => ch.checked)
      .map(ch => {
        const [name, price] = ch.value.split("|");
        return { name, price: Number(price) };
      });

    const sum = items.reduce((a, b) => a + b.price, 0);

    const delivery = (typEl.value === "rozvoz" && sum > 0) ? 49 : 0; // rozvoz 49 Kč
    const total = sum + delivery;

    sumEl.textContent = String(sum);
    deliveryEl.textContent = String(delivery);
    totalEl.textContent = String(total);

    return { items, sum, delivery, total };
  }

  // přepočty při změnách
  itemCheckboxes.forEach(ch => ch.addEventListener("change", calc));
  typEl.addEventListener("change", calc);

  // když začneš psát, mizí červené orámování
  [jmenoEl, telefonEl, emailEl, adresaEl].forEach(el => {
    el.addEventListener("input", () => el.classList.remove("input-error"));
  });

  // init
  calc();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    const jmeno = jmenoEl.value.trim();
    const telefon = telefonEl.value.trim();
    const email = emailEl.value.trim();
    const typ = typEl.value;
    const adresa = adresaEl.value.trim();
    const poznamka = poznamkaEl.value.trim();

    const { items, total } = calc();

    let ok = true;

    if (!jmeno) { jmenoEl.classList.add("input-error"); ok = false; }
    if (!telefon) { telefonEl.classList.add("input-error"); ok = false; }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailEl.classList.add("input-error"); ok = false;
    }

    if (items.length === 0) {
      showError("Vyber prosím alespoň jednu pizzu.");
      return;
    }

    if (typ === "rozvoz" && !adresa) {
      adresaEl.classList.add("input-error");
      showError("Pro rozvoz vyplň adresu.");
      return;
    }

    if (!ok) {
      showError("Zkontroluj prosím červeně označená pole.");
      return;
    }

    // ZATÍM jen demo potvrzení (backend/platby přidáme potom)
    const seznam = items.map(i => `${i.name} (${i.price} Kč)`).join(", ");
    showSuccess(`Objednávka připravena ✅ Celkem ${total} Kč. Vybráno: ${seznam}`);

    form.reset();
    calc();
  });
});
