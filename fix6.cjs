const fs = require('fs');

let content = fs.readFileSync('src/pages/CheckoutView.vue', 'utf8');

const oldCode = `  const res = await fetch(\`/nominatim/search?format=json&addressdetails=1&limit=1&q=\${encodeURIComponent(q + ", Việt Nam")}\`);
  if (!res.ok) return { ok: false, status: res.status };
  const data = await res.json();
  const result = { ok: true, data };`;

const newCode = `  const targetUrl = \`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1&q=\${encodeURIComponent(q + ", Việt Nam")}\`;
  const res = await fetch(\`https://api.allorigins.win/get?url=\${encodeURIComponent(targetUrl)}\`);
  if (!res.ok) return { ok: false, status: res.status };
  const allOriginsData = await res.json();
  let data = [];
  if (allOriginsData.contents) {
    try { data = JSON.parse(allOriginsData.contents); } catch (e) {}
  }
  const result = { ok: true, data };`;

content = content.replace(oldCode, newCode);

fs.writeFileSync('src/pages/CheckoutView.vue', content);
console.log('Fixed bypass proxy!');
