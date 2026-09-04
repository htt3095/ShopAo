const fs = require('node:fs')

let content = fs.readFileSync('src/pages/CheckoutView.vue', 'utf8')

// 1. Insert the cache and helper
const helperCode = `const wards = ref([]);

const geocodeCache = new Map();
let lastGeocodeTime = 0;
async function fetchGeocode(q) {
  if (geocodeCache.has(q)) return geocodeCache.get(q);
  const now = Date.now();
  const timeSinceLast = now - lastGeocodeTime;
  if (timeSinceLast < 1100) {
    await new Promise(r => setTimeout(r, 1100 - timeSinceLast));
  }
  lastGeocodeTime = Date.now();
  const res = await fetch(\`/nominatim/search?format=json&addressdetails=1&limit=1&q=\${encodeURIComponent(q + ", Việt Nam")}\`);
  if (!res.ok) return { ok: false, status: res.status };
  const data = await res.json();
  const result = { ok: true, data };
  geocodeCache.set(q, result);
  return result;
}
`
content = content.replace('const wards = ref([]);', helperCode)

// 2. Replace the fetch block in progressive fallback
const oldFetchRegex = /const geoRes = await fetch\(\s*`\/nominatim\/search\?format=json&addressdetails=1&limit=1&q=\$\{encodeURIComponent\(q \+ ", Việt Nam"\)\}`\s*\);\s*if \(!geoRes\.ok\) \{\s*if \(geoRes\.status === 429\) \{\s*routeError\.value = 'Geocoding service busy — tính ship tạm thời bằng ước lượng\.';\s*applyTextFallbackShipping\(addressText\);\s*return true;\s*\}\s*const txt = await safeParseResponse\(geoRes\);\s*throw new Error\(typeof txt === 'string' \? txt : `Geocoding failed \(HTTP \$\{geoRes\.status\}\)`\);\s*\}\s*const geoData = await safeParseResponse\(geoRes\);/g

const newFetchCode = `const geoRes = await fetchGeocode(q);
      if (!geoRes.ok) {
        if (geoRes.status === 429) {
          routeError.value = 'Geocoding service busy — tính ship tạm thời bằng ước lượng.';
          applyTextFallbackShipping(addressText);
          return true;
        }
        throw new Error(\`Geocoding failed (HTTP \${geoRes.status})\`);
      }
      const geoData = geoRes.data;`

content = content.replace(oldFetchRegex, newFetchCode)

fs.writeFileSync('src/pages/CheckoutView.vue', content)
console.log('Fixed caching!')
