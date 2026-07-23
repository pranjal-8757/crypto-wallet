const REGISTER_KEYS = ['J', 'C', 'A', 'P', 'W'];

function generateRegisterPositions(positionKeys = []) {
  const stored = normalizePositionKeys(positionKeys) || [];
  const decoys = REGISTER_KEYS.filter((key) => !stored.includes(key));
  return [...stored, ...decoys].slice(0, REGISTER_KEYS.length);
}

function normalizePositionKeys(positionKeys) {
  if (!Array.isArray(positionKeys) || positionKeys.length !== 2) return null;
  const normalized = positionKeys.map((key) => String(key).trim().toUpperCase());
  return new Set(normalized).size === 2 && normalized.every((key) => /^[A-Z]$/.test(key)) ? normalized : null;
}

function validateRegisterDigits(selectedDigits, positionKeys, expectedDigits) {
  const positions = normalizePositionKeys(positionKeys);
  if (!positions || !/^\d{2}$/.test(String(expectedDigits))) return false;
  if (Array.isArray(selectedDigits)) {
    return selectedDigits.length === REGISTER_KEYS.length && positions.every(
      (key, index) => selectedDigits[REGISTER_KEYS.indexOf(key)] === String(expectedDigits)[index]
    );
  }
  return positions.every((key, index) => selectedDigits?.[key] === String(expectedDigits)[index]);
}

module.exports = { REGISTER_KEYS, generateRegisterPositions, normalizePositionKeys, validateRegisterDigits };
