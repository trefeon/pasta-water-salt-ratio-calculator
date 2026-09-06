// @ts-check
// Pure domain logic: rates, conversions, validation, tips.
const GRAMS_PER_TSP = 6;
const QUART_TO_LITRE = 0.946353;
const MAX_WATER = 50; // litres; above this is almost certainly a typo
/** @typedef {"light"|"classic"|"restaurant"} Level */
/** @type {Record<Level, {gPerL:number,label:string,drop:string}>} */
const LEVELS = {
  light: { gPerL: 5, label: "5 g per litre", drop: "lv1" },
  classic: { gPerL: 10, label: "10 g per litre", drop: "lv2" },
  restaurant: { gPerL: 15, label: "15 g per litre", drop: "lv3" },
};
const TIPS = [
  "Salted water seasons pasta from the inside; sauce only coats the outside.",
  "Pasta absorbs water as it cooks, so salted water means seasoned noodles.",
  "Salt early so it fully dissolves before the pasta goes in.",
  "Water salted like the sea means you need less salt in the sauce later.",
  "Unsalted pasta tastes flat no matter how good the sauce is.",
];
/**
 * @param {string} raw
 * @returns {{ok:true,value:number}|{ok:false,problem:string}}
 */
function parseAmount(raw) {
  const t = raw.trim().replace(",", ".");
  if (!t) return { ok: false, problem: "empty" };
  const v = Number(t);
  if (!Number.isFinite(v)) return { ok: false, problem: "Enter a number, e.g. 4." };
  if (v <= 0) return { ok: false, problem: "Enter a water amount above 0." };
  return { ok: true, value: v };
}
/**
 * @param {number} amount user-entered amount in the given unit
 * @param {"L"|"qt"} unit
 * @param {Level} level
 * @returns {{grams:number,tsp:number}}
 */
function calcSalt(amount, unit, level) {
  const litres = unit === "qt" ? amount * QUART_TO_LITRE : amount;
  const grams = litres * LEVELS[level].gPerL;
  return { grams: Math.round(grams * 10) / 10, tsp: Math.round((grams / GRAMS_PER_TSP) * 10) / 10 };
}
