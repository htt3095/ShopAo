const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminPOSView.vue', 'utf8');
code = code.replace(/alert\('(.+?)'\)/g, "showPaymentDialog({ type: 'error', subtitle: 'C?nh báo', title: 'Thông báo', message: '\' })");
code = code.replace(/alert\(\(.+?)\\)/g, "showPaymentDialog({ type: 'error', subtitle: 'C?nh báo', title: 'Thông báo', message: \\\ })");
fs.writeFileSync('src/pages/AdminPOSView.vue', code);
