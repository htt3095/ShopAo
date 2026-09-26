const fs = require('node:fs')
let content = fs.readFileSync('src/pages/ShopView.vue', 'utf8')

const regex = / {2}function getUnavailableVariantCount \(product\) \{\n {4}return getProductVariants\(product\)\.filter\(v => normalizeVariantStatus\(v\) !== 'SELLING'\)\.length\n {2}\}/
const replace = `  function getUnavailableVariantCount (product) {
    return getProductVariants(product).filter(v => {
      const status = normalizeVariantStatus(v)
      return status !== 'SELLING' && status !== 'HIDDEN'
    }).length
  }`

content = content.replace(regex, replace)
fs.writeFileSync('src/pages/ShopView.vue', content, 'utf8')
console.log('Patched ShopView')
