function fixEncoding(text) {
  if (!text) return text;

  return text
    .replace(/Ã¡/g, "á")
    .replace(/Ã©/g, "é")
    .replace(/Ã­/g, "í")
    .replace(/Ã³/g, "ó")
    .replace(/Ãº/g, "ú")
    .replace(/Ã/g, "Á")
    .replace(/Ã/g, "É")
    .replace(/Ã/g, "Í")
    .replace(/Ã/g, "Ó")
    .replace(/Ã/g, "Ú")
    .replace(/Ã±/g, "ñ")
    .replace(/Ã/g, "Ñ");
}

module.exports = fixEncoding;