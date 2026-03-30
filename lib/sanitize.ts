/**
 * Replace Cyrillic look-alike characters with their Latin equivalents.
 * AI models sometimes output Cyrillic chars that look identical to Latin ones,
 * causing display issues and language mixing.
 */
const CYRILLIC_TO_LATIN: Record<string, string> = {
  // Lowercase
  "\u0430": "a", // а → a
  "\u0435": "e", // е → e
  "\u043E": "o", // о → o
  "\u0440": "p", // р → p
  "\u0441": "c", // с → c
  "\u0443": "y", // у → y (in some contexts)
  "\u0445": "x", // х → x
  "\u0456": "i", // і → i
  "\u0458": "j", // ј → j
  "\u043B": "l", // л → l (this was the bug)
  "\u043D": "n", // н → n (rare but possible)
  "\u0442": "t", // т → t (rare)
  "\u0432": "v", // в → v (rare)
  "\u043A": "k", // к → k
  "\u043C": "m", // м → m
  // Uppercase
  "\u0410": "A", // А → A
  "\u0412": "B", // В → B
  "\u0415": "E", // Е → E
  "\u041A": "K", // К → K
  "\u041C": "M", // М → M
  "\u041D": "H", // Н → H
  "\u041E": "O", // О → O
  "\u0420": "P", // Р → P
  "\u0421": "C", // С → C
  "\u0422": "T", // Т → T
  "\u0425": "X", // Х → X
};

export function sanitizeCyrillic(text: string): string {
  let result = text;
  for (const [cyrillic, latin] of Object.entries(CYRILLIC_TO_LATIN)) {
    result = result.replaceAll(cyrillic, latin);
  }
  return result;
}
