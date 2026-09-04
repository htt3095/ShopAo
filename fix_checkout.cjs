const fs = require('node:fs')

let content = fs.readFileSync('src/pages/CheckoutView.vue', 'utf8')

// 1. Hide the distance UI if distance is 0
const originalUI = `<div class="flex items-center justify-between">
                  <span class="font-semibold text-slate-600 "
                    >Khoảng cách:</span
                  >`
const fixedUI = `<div class="flex items-center justify-between" v-if="Number(distanceKm) > 0">
                  <span class="font-semibold text-slate-600 ">Khoảng cách:</span>`
content = content.replace(originalUI, fixedUI)

// 2. Add progressive fallback to calculateRouteFromFreeformAddress
const originalGeoBlock = `  try {
    const geoRes = await fetch(
      \`/nominatim/search?format=json&addressdetails=1&limit=1&q=\${encodeURIComponent(addressText + ", Việt Nam")}\`,
    );
    if (!geoRes.ok) {
      if (geoRes.status === 429) {
        // Rate limit: provide graceful fallback
        routeError.value = 'Geocoding service busy — tính ship tạm thời bằng ước lượng.';
        applyTextFallbackShipping(addressText);
        return true;
      }
      const txt = await safeParseResponse(geoRes);
      throw new Error(typeof txt === 'string' ? txt : \`Geocoding failed (HTTP \${geoRes.status})\`);
    }
    const geoData = await safeParseResponse(geoRes);
    const first = Array.isArray(geoData) ? geoData[0] : null;
    if (!first) {
      applyTextFallbackShipping(addressText);
      return true;
    }`

const fixedGeoBlock = `  try {
    let first = null;
    const parts = addressText.split(',').map(s => s.trim()).filter(Boolean);
    while (parts.length > 0) {
      const q = parts.join(', ');
      const geoRes = await fetch(
        \`/nominatim/search?format=json&addressdetails=1&limit=1&q=\${encodeURIComponent(q + ", Việt Nam")}\`
      );
      if (!geoRes.ok) {
        if (geoRes.status === 429) {
          routeError.value = 'Geocoding service busy — tính ship tạm thời bằng ước lượng.';
          applyTextFallbackShipping(addressText);
          return true;
        }
        const txt = await safeParseResponse(geoRes);
        throw new Error(typeof txt === 'string' ? txt : \`Geocoding failed (HTTP \${geoRes.status})\`);
      }
      const geoData = await safeParseResponse(geoRes);
      if (Array.isArray(geoData) && geoData.length > 0) {
        first = geoData[0];
        break;
      }
      parts.shift();
    }
    if (!first) {
      applyTextFallbackShipping(addressText);
      return true;
    }`

const lastIndexOfTry = content.lastIndexOf(`  try {\n    const geoRes = await fetch(`)
if (lastIndexOfTry === -1) {
  console.error('Could not find the target geo block!')
} else {
  const before = content.slice(0, Math.max(0, lastIndexOfTry))
  const after = content.slice(Math.max(0, lastIndexOfTry))
  const updatedAfter = after.replace(originalGeoBlock, fixedGeoBlock)
  content = before + updatedAfter
}

fs.writeFileSync('src/pages/CheckoutView.vue', content)
console.log('Successfully patched CheckoutView.vue!')
