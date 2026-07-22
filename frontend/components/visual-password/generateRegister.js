const ALPHABET = Array.from(
  { length: 26 },
  (_, i) => String.fromCharCode(65 + i)
);

export default function generateRegister(positionKeys) {
  const stored = [...new Set((positionKeys || []).map((k) => k.toUpperCase()))];

  const pool = ALPHABET.filter(letter => !stored.includes(letter));

  const decoys = [];
  const remaining = [...pool];

  while (decoys.length < 3) {
    const index = Math.floor(Math.random() * remaining.length);
    decoys.push(remaining.splice(index,1)[0]);
  }

  const register = [...stored, ...decoys];

  for(let i = register.length-1; i>0; i--){
      const j = Math.floor(Math.random()*(i+1));
      [register[i],register[j]]=[register[j],register[i]];
  }

  console.log("generateRegister received:", positionKeys);

  return register;
}