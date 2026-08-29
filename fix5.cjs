const fs = require('fs');

let content = fs.readFileSync('src/pages/CheckoutView.vue', 'utf8');

const oldStr = `      const geoRes = await fetch(
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
      const geoData = await safeParseResponse(geoRes);`;

const newStr = `      const geoRes = await fetchGeocode(q);
      if (!geoRes.ok) {
        if (geoRes.status === 429) {
          routeError.value = "Geocoding service busy — tính ship tạm thời bằng ước lượng.";
          applyTextFallbackShipping(addressText);
          return true;
        }
        throw new Error(\`Geocoding failed (HTTP \${geoRes.status})\`);
      }
      const geoData = geoRes.data;`;

if (content.includes(oldStr)) {
    content = content.replace(oldStr, newStr);
    fs.writeFileSync('src/pages/CheckoutView.vue', content);
    console.log('Fixed first fetch!');
} else {
    console.log('Could not find the string to replace!');
}
