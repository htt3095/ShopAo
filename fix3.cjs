const fs = require('fs');

let content = fs.readFileSync('src/pages/CheckoutView.vue', 'utf8');

// 1. Hide the distance UI if distance is 0
const uiRegex = /<div class="flex items-center justify-between">\s*<span class="font-semibold text-slate-600 "\s*>Khoảng cách:<\/span\s*>\s*<span class="font-bold">{{ distanceKm }} km<\/span>\s*<\/div>/g;
const newUI = `<div class="flex items-center justify-between" v-if="Number(distanceKm) > 0">
                  <span class="font-semibold text-slate-600 ">Khoảng cách:</span>
                  <span class="font-bold">{{ distanceKm }} km</span>
                </div>`;
content = content.replace(uiRegex, newUI);

// 2. Add progressive fallback to ALL Nominatim fetches (both autoFillAddressHierarchyFromText and calculateRouteFromFreeformAddress)
const geoRegex = /try \{\s*const geoRes = await fetch\(\s*`\/nominatim\/search\?format=json&addressdetails=1&limit=1&q=\$\{encodeURIComponent\(addressText \+ ", Việt Nam"\)\}`,\s*\);\s*if \(!geoRes\.ok\) \{\s*if \(geoRes\.status === 429\) \{\s*\/\/ Rate limit: provide graceful fallback\s*routeError\.value = 'Geocoding service busy — tính ship tạm thời bằng ước lượng\.';\s*applyTextFallbackShipping\(addressText\);\s*return true;\s*\}\s*const txt = await safeParseResponse\(geoRes\);\s*throw new Error\(typeof txt === 'string' \? txt : `Geocoding failed \(HTTP \$\{geoRes\.status\}\)`\);\s*\}\s*const geoData = await safeParseResponse\(geoRes\);\s*const first = Array\.isArray\(geoData\) \? geoData\[0\] : null;\s*if \(!first\) \{\s*applyTextFallbackShipping\(addressText\);\s*return true;\s*\}/g;

const newGeoBlock = `try {
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
    }`;

content = content.replace(geoRegex, newGeoBlock);

fs.writeFileSync('src/pages/CheckoutView.vue', content);
console.log('Fixed everything!');
