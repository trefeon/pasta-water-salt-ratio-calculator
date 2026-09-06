// Wiring: instant recompute, droplet color, rotating tip, validation.
const $ = (s) => document.querySelector(s);
const water = $("#water"), err = $("#error"), gramsEl = $("#grams"), tspEl = $("#tsp");
const ratioEl = $("#ratio"), drop = $("#drop"), tipEl = $("#tip");
let tipIdx = 0, lastKey = "";
const val = (name) => document.querySelector(`input[name="${name}"]:checked`).value;
function key(unit, level, raw) { return unit + "|" + level + "|" + raw.trim(); }
function update() {
  const unit = val("unit"), level = val("level"), raw = water.value;
  if (key(unit, level, raw) !== lastKey) { // rotate tip on every input change
    lastKey = key(unit, level, raw);
    tipIdx = (tipIdx + 1) % TIPS.length;
    tipEl.textContent = TIPS[tipIdx];
  }
  const meta = LEVELS[level];
  drop.setAttribute("class", meta.drop);
  ratioEl.textContent = unit === "qt"
    ? `${meta.label} (about ${(meta.gPerL * QUART_TO_LITRE).toFixed(1)} g per quart)`
    : meta.label;
  const parsed = parseAmount(raw);
  if (!parsed.ok) {
    gramsEl.textContent = "—"; tspEl.textContent = "—";
    if (parsed.problem === "empty") { err.hidden = true; }
    else { err.textContent = parsed.problem; err.hidden = false; }
    return;
  }
  err.hidden = true;
  const litres = unit === "qt" ? parsed.value * QUART_TO_LITRE : parsed.value;
  if (litres > MAX_WATER) {
    gramsEl.textContent = "—"; tspEl.textContent = "—";
    err.textContent = "That is a lot of water — double-check the amount."; err.hidden = false;
    return;
  }
  const r = calcSalt(parsed.value, unit, level);
  gramsEl.textContent = String(r.grams); tspEl.textContent = String(r.tsp);
}
const form = document.querySelector("#calc");
form.addEventListener("input", update);
form.addEventListener("change", update);
update();
