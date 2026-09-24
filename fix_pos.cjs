const fs = require('node:fs')
let code = fs.readFileSync('src/pages/AdminPOSView.vue', 'utf8')
code = code.replace(/alert\('(.+?)'\)/g, 'showPaymentDialog({ type: \'error\', subtitle: \'C?nh b�o\', title: \'Th�ng b�o\', message: \'$1\' })')
code = code.replace(/alert\(\`([\s\S]+?)\`\)/g, 'showPaymentDialog({ type: \'error\', subtitle: \'C?nh b�o\', title: \'Th�ng b�o\', message: `$1` })')

code = code.replace(
  /\{\{ variant\.colorName \}\} \/ Size \{\{ variant\.sizeName \}\} \- \{\{ variant\.variantCode \|\| getVariantCode\(item\.product\.productCode, variant\.colorName, variant\.sizeName\) \}\} \(Kho: \{\{ variant\.stockQuantity \}\}\)/g,
  '{{ variant.colorName }} / Size {{ variant.sizeName }} - {{ variant.variantCode || getVariantCode(item.product.productCode, variant.colorName, variant.sizeName) }} <template v-if="Number(variant.stockQuantity || 0) > 0">(Kho: {{ variant.stockQuantity }})</template><template v-else>(H?t h�ng)</template>',
)

fs.writeFileSync('src/pages/AdminPOSView.vue', code)
