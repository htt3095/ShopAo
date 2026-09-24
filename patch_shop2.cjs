const fs = require('fs');
let content = fs.readFileSync('src/pages/ShopView.vue', 'utf8');

const regex = /function getUnavailableVariantCount \(product\) \{[\s\S]*?return getProductVariants\(product\)\.filter\(v => normalizeVariantStatus\(v\) !== 'SELLING'\)\.length[\s\S]*?\}/;
const replace = `function getUnavailableVariantCount (product) {
    return getProductVariants(product).filter(v => {
      const status = normalizeVariantStatus(v)
      return status !== 'SELLING' && status !== 'HIDDEN'
    }).length
  }`;

content = content.replace(regex, replace);
fs.writeFileSync('src/pages/ShopView.vue', content, 'utf8');
console.log("Patched ShopView");
