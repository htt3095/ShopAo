const fs = require('fs');

let content = fs.readFileSync('src/pages/CheckoutView.vue', 'utf8');

// 1. Hide the distance UI if distance is 0
const originalUI = `<div class="flex items-center justify-between">
                  <span class="font-semibold text-slate-600 "
                    >Khoảng cách:</span
                  >`;
const fixedUI = `<div class="flex items-center justify-between" v-if="Number(distanceKm) > 0">
                  <span class="font-semibold text-slate-600 ">Khoảng cách:</span>`;
content = content.replace(originalUI, fixedUI);

fs.writeFileSync('src/pages/CheckoutView.vue', content);
console.log('Fixed UI');
