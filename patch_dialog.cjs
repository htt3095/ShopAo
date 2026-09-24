const fs = require('node:fs')
let content = fs.readFileSync('src/pages/AdminPOSView.vue', 'utf8')

const regexClose = / {2}function closePaymentDialog \(\) \{\n {4}paymentDialog\.value = null\n {2}\}/
const replaceClose = `  function closePaymentDialog () {
    const dialog = paymentDialog.value
    if (dialog?.onSecondary) {
      dialog.onSecondary()
    }
    paymentDialog.value = null
  }`
content = content.replace(regexClose, replaceClose)

const regexConfig = / {8}onPrimary: typeof config\.onPrimary === 'function' \? config\.onPrimary : null,/
const replaceConfig = `        onPrimary: typeof config.onPrimary === 'function' ? config.onPrimary : null,
        onSecondary: typeof config.onSecondary === 'function' ? config.onSecondary : null,`
content = content.replace(regexConfig, replaceConfig)

const removeConfirm = 'onConfirm: () => resolve(true),'
content = content.replaceAll(removeConfirm, 'onPrimary: () => resolve(true),')

const removeCancel = 'onCancel: () => resolve(false)'
content = content.replaceAll(removeCancel, 'onSecondary: () => resolve(false)')

fs.writeFileSync('src/pages/AdminPOSView.vue', content, 'utf8')
console.log('Dialog fixed')
