const fs = require('fs');
const files = [
  'F:/Code/VSC/DATN/frontend-shopgiay/src/pages/ProductDetailView.vue',
  'F:/Code/VSC/DATN/frontend-shopgiay/src/pages/CartView.vue',
  'F:/Code/VSC/DATN/frontend-shopgiay/src/pages/CheckoutView.vue',
  'F:/Code/VSC/DATN/frontend-shopgiay/src/pages/LoginView.vue'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(/class=\"([^\"]*)\"/g, (match, classes) => {
    if (classes.includes('bg-primary') || classes.includes('bg-blue-') || classes.includes('bg-[#FF6B35]') || classes.includes('bg-[#0EA5E9]')) {
      return 'class=\"' + classes.replace(/text-slate-800/g, 'text-white') + '\"';
    }
    return match;
  });

  content = content.replace(/class=\`([^\`]*)\`/g, (match, classes) => {
    if (classes.includes('bg-primary') || classes.includes('bg-blue-') || classes.includes('bg-[#FF6B35]') || classes.includes('bg-[#0EA5E9]')) {
      return 'class=\`' + classes.replace(/text-slate-800/g, 'text-white') + '\`';
    }
    return match;
  });

  fs.writeFileSync(file, content);
  console.log('Fixed buttons in', file);
});
