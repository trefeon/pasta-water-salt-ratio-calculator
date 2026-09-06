// Wiring: stepper, presets, unit pill, salinity cards, badges, tips, validation.
const $ = (s) => document.querySelector(s);
const water = $("#water"), err = $("#error"), gramsEl = $("#grams"), ozEl = $("#oz"),
  tipEl = $("#tip"), tipCount = $("#tipCount"),
  ratioBadge = $("#ratioBadge"), densityBadge = $("#densityBadge"),
  salPill = $("#salPill"), waveCap = $("#waveCap"), unitLabel = $("#unitLabel"),
  eqFine = $("#eqFine"), eqFineT = $("#eqFineT"),
  eqMor = $("#eqMor"), eqMorT = $("#eqMorT"),
  eqDia = $("#eqDia"), eqDiaT = $("#eqDiaT"),
  unitBtns = [...document.querySelectorAll(".pill button")],
  presetBtns = [...document.querySelectorAll(".presets button")];
const waveFront = $("#waveFront"), DROP = { light: "lv1", classic: "lv2", restaurant: "lv3" };
let unit = "L", tipIdx = 0, lastKey = "";
const level = () => document.querySelector('input[name="level"]:checked').value;
const key = () => unit + "|" + level() + "|" + water.value.trim();
function setUnit(u) {
  unit = u;
  unitBtns.forEach(b => b.setAttribute("aria-pressed", String(b.dataset.unit === u)));
  unitLabel.textContent = u === "qt" ? "qt" : "L";
  update();
}
/** @param {ReturnType<typeof calcSalt> | null} r */
function setTiles(r) {
  ozEl.textContent = r ? `(≈ ${r.oz} oz)` : "";
  eqFine.textContent = r ? `${r.fine.tsp} tsp` : "—";
  eqFineT.textContent = r ? `${r.fine.tbsp} tbsp` : "";
  eqMor.textContent = r ? `${r.morton.tsp} tsp` : "—";
  eqMorT.textContent = r ? `${r.morton.tbsp} tbsp` : "";
  eqDia.textContent = r ? `${r.diamond.tsp} tsp` : "—";
  eqDiaT.textContent = r ? `${r.diamond.tbsp} tbsp` : "";
}
function update() {
  const lv = level(), raw = water.value, meta = LEVELS[lv];
  if (key() !== lastKey) {
    lastKey = key();
    tipIdx = (tipIdx + 1) % TIPS.length;
    tipEl.textContent = TIPS[tipIdx];
    tipCount.textContent = `Tip ${tipIdx + 1} of ${TIPS.length}`;
  }
  ratioBadge.textContent = unit === "qt"
    ? `${(meta.gPerL * QUART_TO_LITRE).toFixed(1)} g / 1 qt`
    : `${meta.gPerL} g / 1000 ml`;
  densityBadge.textContent = `${meta.pct} m/v`;
  salPill.textContent = `${meta.pct} salinity`;
  waveCap.textContent = meta.blurb;
  waveFront.setAttribute("class", DROP[lv]);
  presetBtns.forEach(b => b.classList.toggle("on",
    Math.abs(Number(b.dataset.l) - (unit === "qt" ? Number(raw) * QUART_TO_LITRE : Number(raw))) < 0.001 && raw.trim() !== ""));
  const parsed = parseAmount(raw);
  if (!parsed.ok) {
    gramsEl.textContent = "—"; setTiles(null);
    err.hidden = parsed.problem === "empty";
    if (!err.hidden) err.textContent = parsed.problem;
    return;
  }
  const litres = unit === "qt" ? parsed.value * QUART_TO_LITRE : parsed.value;
  if (litres > MAX_WATER) {
    gramsEl.textContent = "—"; setTiles(null);
    err.textContent = "That is a lot of water — double-check the amount."; err.hidden = false;
    return;
  }
  err.hidden = true;
  const r = calcSalt(parsed.value, unit, lv);
  gramsEl.textContent = String(r.grams);
  setTiles(r);
}
function step(d) {
  const cur = Number(water.value) || 0;
  water.value = String(Math.round((cur + d) * 10) / 10);
  update();
}
$("#minus").addEventListener("click", () => step(-0.5));
$("#plus").addEventListener("click", () => step(0.5));
unitBtns.forEach(b => b.addEventListener("click", () => setUnit(b.dataset.unit)));
presetBtns.forEach(b => b.addEventListener("click", () => {
  const litres = Number(b.dataset.l);
  water.value = unit === "qt" ? String(Math.round(litres / QUART_TO_LITRE * 10) / 10) : String(litres);
  update();
}));
water.addEventListener("input", update);
water.addEventListener("change", update);
document.querySelectorAll('input[name="level"]').forEach(r => r.addEventListener("change", update));
update();
