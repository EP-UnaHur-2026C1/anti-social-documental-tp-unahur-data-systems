const test = require('node:test');
const assert = require('node:assert/strict');
const { getCachedValue, setCachedValue, clearCache } = require('../src/utils/cache');

test('cache guarda y expira valores correctamente', () => {
  clearCache();
  setCachedValue('demo', { ok: true }, 50);

  assert.deepEqual(getCachedValue('demo'), { ok: true });

  clearCache();
  assert.equal(getCachedValue('demo'), null);
});
