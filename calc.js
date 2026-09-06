// @ts-check
// Pure domain logic: rates, conversions, validation, tips.
const GRAMS_PER_TSP = 6;
const QUART_TO_LITRE = 0.946353;
const MAX_WATER = 50; // litres; above this is almost certainly a typo
/** @typedef {"light"|"classic"|"restaurant"} Level */
/** @type {Record<Level, {gPerL:number,pct:string,name:string,blurb:string}>} */
const LEVELS = {
  light: { gPerL: 5, pct: "0.5%", name: "Delicato", blurb: "Subtle balance (5 g/L)" },
  classic: { gPerL: 10, pct: "1.0%", name: "Mediterranean balance", blurb: "Mediterranean balance (10 g/L)" },
  restaurant: { gPerL: 15, pct: "1.5%", name: "Ristorante punch", blurb: "Ristorante punch (15 g/L)" },
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
  if (!Number.isFinite(v)) return { ok: false, problem: "Enter a number, e.g. 3." };
  if (v <= 0) return { ok: false, problem: "Enter a water amount above 0." };
  return { ok: true, value: v };
}
/**
 * @param {number} amount user-entered amount in the given unit
 * @param {"L"|"qt"} unit
 * @param {Level} level
 * @returns {{grams:number,tsp:number,tbsp:number}}
 */
function calcSalt(amount, unit, level) {
  const litres = unit === "qt" ? amount * QUART_TO_LITRE : amount;
  const grams = litres * LEVELS[level].gPerL;
  const r1 = (n) => Math.round(n * 10) / 10;
  return { grams: r1(grams), tsp: r1(grams / GRAMS_PER_TSP), tbsp: r1(grams / GRAMS_PER_TSP / 3) };
}
