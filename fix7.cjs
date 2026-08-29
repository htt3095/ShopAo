const fs = require('fs');

let content = fs.readFileSync('src/pages/CheckoutView.vue', 'utf8');

const oldCode = `  try {
    let first = null;
    const parts = addressText.split(',').map(s => s.trim()).filter(Boolean);`;

const newCode = `  try {
    let first = null;
    const parts = input.split(',').map(s => s.trim()).filter(Boolean);`;

if (content.includes(oldCode)) {
    content = content.replace(oldCode, newCode);
    fs.writeFileSync('src/pages/CheckoutView.vue', content);
    console.log('Fixed ReferenceError in autoFill!');
} else {
    console.log('Could not find oldCode');
}
