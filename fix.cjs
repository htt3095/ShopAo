const fs = require('node:fs')

let content = fs.readFileSync('src/pages/CheckoutView.vue', 'utf8')

const startStr = '    const geoRes = await fetch('
const endStr = '    const first = Array.isArray(geoData) ? geoData[0] : null;'

const startIdx = content.indexOf(startStr)
const endIdx = content.indexOf(endStr)

if (startIdx !== -1 && endIdx !== -1) {
  const before = content.slice(0, Math.max(0, startIdx))
  const after = content.slice(Math.max(0, endIdx + endStr.length))

  const fixBlock = `    let first = null;
    const parts = addressText.split(',').map(s => s.trim()).filter(Boolean);
    while (parts.length > 0) {
      const q = parts.join(', ');
      const geoRes = await fetch(
        \`/nominatim/search?format=json&addressdetails=1&limit=1&q=\${encodeURIComponent(q + ", Việt Nam")}\`
      );
      if (!geoRes.ok) {
        if (geoRes.status === 429) {
          routeError.value = "Geocoding service busy — tính ship tạm thời bằng ước lượng.";
          applyTextFallbackShipping(addressText);
          return true;
        }
        const txt = await safeParseResponse(geoRes);
        throw new Error(typeof txt === "string" ? txt : \`Geocoding failed (HTTP \${geoRes.status})\`);
      }
      const geoData = await safeParseResponse(geoRes);
      if (Array.isArray(geoData) && geoData.length > 0) {
        first = geoData[0];
        break;
      }
      parts.shift();
    }`

  content = before + fixBlock + after
  fs.writeFileSync('src/pages/CheckoutView.vue', content)
  console.log('Fixed')
} else {
  console.log('Not found')
}
