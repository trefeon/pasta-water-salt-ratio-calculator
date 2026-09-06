import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
const ctx = vm.createContext();
vm.runInContext(fs.readFileSync(new URL("../calc.js", import.meta.url), "utf8"), ctx);
test("validation & rates", () => {
  assert.equal(ctx.parseAmount("").ok, false);
  assert.equal(ctx.parseAmount("0").ok, false);
  assert.equal(ctx.parseAmount("-1").ok, false);
  assert.equal(ctx.parseAmount("abc").ok, false);
  assert.equal(ctx.parseAmount("3,5").value, 3.5);
  assert.equal(ctx.calcSalt(1, "L", "light").grams, 5);
  assert.equal(ctx.calcSalt(1, "L", "classic").grams, 10);
  assert.equal(ctx.calcSalt(1, "L", "restaurant").grams, 15);
  assert.equal(ctx.calcSalt(1, "qt", "classic").grams, 9.5);
  assert.equal(ctx.calcSalt(1, "L", "classic").fine.tsp, 1.7);
  assert.equal(ctx.calcSalt(1, "L", "classic").diamond.tsp, 3.3);
});
