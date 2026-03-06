function hasMojibake(text) {
  return /Ã|Â|â|ð|�/.test(text);
}

function normalizeEncoding(text) {
  if (typeof text !== "string" || !text) return text;

  let current = text.replace(/^\uFEFF/, "");

  for (let i = 0; i < 4; i += 1) {
    if (!hasMojibake(current)) break;

    const decoded = Buffer.from(current, "latin1").toString("utf8");
    if (decoded === current) break;
    current = decoded;
  }

  return current.trim();
}

module.exports = normalizeEncoding;
